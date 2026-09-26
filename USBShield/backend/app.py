import sys
import datetime

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from flask import Flask, jsonify, request
from flask_cors import CORS

from usb_detector import get_connected_drives
from scanner import scan_drive, format_size
from risk_engine import evaluate_usb_risk
from activity_monitor import activity_monitor
from event_logger import event_logger

app = Flask(__name__)
CORS(app)

# Track previous state for event triggering
state_tracker = {
    "last_connected_drive": None,
    "last_trust_status": None,
    "last_file_count": -1,
    "demo_mode": "none"  # "none", "simulate_empty", "simulate_filed"
}

def get_demo_drive():
    mode = state_tracker["demo_mode"]
    if mode == "simulate_empty":
        return [{
            "drive": "E:",
            "label": "DEMO_SAFE_DRIVE",
            "filesystem": "FAT32",
            "total_bytes": 16000000000,
            "free_bytes": 15000000000
        }]
    elif mode == "simulate_filed":
        return [{
            "drive": "E:",
            "label": "DEMO_KINGSTON",
            "filesystem": "exFAT",
            "total_bytes": 16000000000,
            "free_bytes": 11300000000
        }]
    return None

def get_demo_scan(mode):
    if mode == "simulate_empty":
        return {
            "drive": "E:",
            "scanned_at": datetime.datetime.now().isoformat(),
            "total_files": 0,
            "files": [],
            "category_summary": {
                "executable": 0, "script": 0, "library": 0, "document": 0,
                "image": 0, "video": 0, "audio": 0, "archive": 0, "disk image": 0, "other": 0
            },
            "executables_count": 0,
            "scripts_count": 0,
            "archives_count": 0,
            "hidden_files_count": 0
        }
    elif mode == "simulate_filed":
        return {
            "drive": "E:",
            "scanned_at": datetime.datetime.now().isoformat(),
            "total_files": 7,
            "files": [
                {
                    "name": "setup.exe",
                    "path": "\\setup.exe",
                    "extension": ".exe",
                    "size_bytes": 2516582,
                    "size_formatted": "2.4 MB",
                    "category": "executable",
                    "risk_indicator": "Executable content",
                    "status": "REVIEW"
                },
                {
                    "name": "deploy_script.ps1",
                    "path": "\\scripts\\deploy_script.ps1",
                    "extension": ".ps1",
                    "size_bytes": 4096,
                    "size_formatted": "4.0 KB",
                    "category": "script",
                    "risk_indicator": "Script content",
                    "status": "REVIEW"
                },
                {
                    "name": "backup_data.zip",
                    "path": "\\archives\\backup_data.zip",
                    "extension": ".zip",
                    "size_bytes": 15728640,
                    "size_formatted": "15.0 MB",
                    "category": "archive",
                    "risk_indicator": "Archive file",
                    "status": "REVIEW"
                },
                {
                    "name": "project_report.pdf",
                    "path": "\\documents\\project_report.pdf",
                    "extension": ".pdf",
                    "size_bytes": 839680,
                    "size_formatted": "820.0 KB",
                    "category": "document",
                    "risk_indicator": "None",
                    "status": "REVIEW"
                },
                {
                    "name": "config.json",
                    "path": "\\config.json",
                    "extension": ".json",
                    "size_bytes": 1024,
                    "size_formatted": "1.0 KB",
                    "category": "other",
                    "risk_indicator": "None",
                    "status": "REVIEW"
                },
                {
                    "name": "system_patch.bat",
                    "path": "\\system_patch.bat",
                    "extension": ".bat",
                    "size_bytes": 2048,
                    "size_formatted": "2.0 KB",
                    "category": "script",
                    "risk_indicator": "Script content",
                    "status": "REVIEW"
                },
                {
                    "name": ".hidden_config",
                    "path": "\\.hidden_config",
                    "extension": "none",
                    "size_bytes": 512,
                    "size_formatted": "512 B",
                    "category": "other",
                    "risk_indicator": "Hidden file",
                    "status": "REVIEW"
                }
            ],
            "category_summary": {
                "executable": 1, "script": 2, "archive": 1, "document": 1, "other": 2,
                "library": 0, "image": 0, "video": 0, "audio": 0, "disk image": 0
            },
            "executables_count": 1,
            "scripts_count": 2,
            "archives_count": 1,
            "hidden_files_count": 1
        }
    return None

def perform_system_status():
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # 1. Check for connected drives
    demo_drives = get_demo_drive()
    if demo_drives:
        drives = demo_drives
    else:
        drives = get_connected_drives()
        
    if not drives:
        # Check if USB was previously connected and now removed
        if state_tracker["last_connected_drive"] is not None:
            prev_drive = state_tracker["last_connected_drive"]
            event_logger.log_event(
                event_type="USB_REMOVED",
                drive=prev_drive,
                status="REMOVED",
                details=f"USB drive {prev_drive} was disconnected"
            )
            activity_monitor.clear()
            state_tracker["last_connected_drive"] = None
            state_tracker["last_trust_status"] = None
            state_tracker["last_file_count"] = -1

        no_device_risk = evaluate_usb_risk(None)
        return {
            "connected": False,
            "device": None,
            "scan": None,
            "risk": no_device_risk,
            "activity": None,
            "demo_mode": state_tracker["demo_mode"],
            "timestamp": timestamp
        }

    # Active drive selected (first removable drive)
    active_drive = drives[0]
    drive_letter = active_drive["drive"]
    label = active_drive.get("label", "Removable Disk")
    
    # Event: USB_CONNECTED (if new drive detected)
    if state_tracker["last_connected_drive"] != drive_letter:
        event_logger.log_event(
            event_type="USB_CONNECTED",
            drive=drive_letter,
            label=label,
            status="DETECTED",
            details=f"Removable storage device {label} ({drive_letter}) connected"
        )
        state_tracker["last_connected_drive"] = drive_letter

    # 2. Perform file scan
    if state_tracker["demo_mode"] != "none":
        scan_res = get_demo_scan(state_tracker["demo_mode"])
    else:
        scan_res = scan_drive(drive_letter)
        
    file_count = scan_res.get("total_files", 0)

    # 3. Activity monitoring comparison
    activity = activity_monitor.update_and_compare(drive_letter, scan_res)
    if activity.get("activity_detected"):
        event_logger.log_event(
            event_type="ACTIVITY_DETECTED",
            drive=drive_letter,
            label=label,
            file_count=file_count,
            status="WARNING",
            details=activity.get("message")
        )

    # 4. Risk engine evaluation
    risk = evaluate_usb_risk(scan_res, activity)
    trust_status = risk.get("trust")

    # Log security events on status change or content discovery
    if state_tracker["last_trust_status"] != trust_status:
        event_logger.log_event(
            event_type="STATUS_CHANGED",
            drive=drive_letter,
            label=label,
            file_count=file_count,
            status=trust_status,
            details=f"Trust status evaluated as {trust_status}"
        )
        state_tracker["last_trust_status"] = trust_status

    if scan_res.get("executables_count", 0) > 0 and state_tracker["last_file_count"] != file_count:
        event_logger.log_event(
            event_type="EXECUTABLE_DETECTED",
            drive=drive_letter,
            label=label,
            file_count=file_count,
            status="UNTRUSTED",
            details=f"{scan_res['executables_count']} executable file(s) identified on USB"
        )
    elif scan_res.get("scripts_count", 0) > 0 and state_tracker["last_file_count"] != file_count:
        event_logger.log_event(
            event_type="SCRIPT_DETECTED",
            drive=drive_letter,
            label=label,
            file_count=file_count,
            status="UNTRUSTED",
            details=f"{scan_res['scripts_count']} script file(s) identified on USB"
        )
    elif file_count > 0 and state_tracker["last_file_count"] != file_count:
        event_logger.log_event(
            event_type="FILES_DETECTED",
            drive=drive_letter,
            label=label,
            file_count=file_count,
            status="UNTRUSTED",
            details=f"{file_count} total file(s) detected on USB"
        )

    state_tracker["last_file_count"] = file_count

    total_b = active_drive.get("total_bytes", 0)
    free_b = active_drive.get("free_bytes", 0)
    used_b = max(0, total_b - free_b)

    device_profile = {
        "drive": drive_letter,
        "label": label,
        "filesystem": active_drive.get("filesystem", "Unknown"),
        "total_bytes": total_b,
        "free_bytes": free_b,
        "used_bytes": used_b,
        "capacity_formatted": format_size(total_b),
        "free_formatted": format_size(free_b),
        "used_formatted": format_size(used_b),
        "file_count": file_count,
        "detection_time": timestamp,
        "last_scan_time": timestamp
    }

    return {
        "connected": True,
        "device": device_profile,
        "scan": scan_res,
        "risk": risk,
        "activity": activity,
        "demo_mode": state_tracker["demo_mode"],
        "timestamp": timestamp
    }

@app.route("/api/status", methods=["GET"])
def api_status():
    try:
        res = perform_system_status()
        return jsonify(res), 200
    except Exception as e:
        print(f"[API ERROR] /api/status failed: {e}")
        return jsonify({"error": str(e), "connected": False}), 500

@app.route("/api/drives", methods=["GET"])
def api_drives():
    try:
        demo = get_demo_drive()
        drives = demo if demo else get_connected_drives()
        return jsonify({"drives": drives}), 200
    except Exception as e:
        return jsonify({"error": str(e), "drives": []}), 500

@app.route("/api/events", methods=["GET"])
def api_events():
    try:
        events = event_logger.get_events()
        return jsonify({"events": events}), 200
    except Exception as e:
        return jsonify({"error": str(e), "events": []}), 500

@app.route("/api/scan", methods=["POST"])
def api_scan():
    try:
        event_logger.log_event(
            event_type="SCAN_STARTED",
            status="IN_PROGRESS",
            details="Manual USB security scan triggered by operator"
        )
        res = perform_system_status()
        if res.get("connected") and res.get("device"):
            event_logger.log_event(
                event_type="SCAN_COMPLETED",
                drive=res["device"]["drive"],
                label=res["device"]["label"],
                file_count=res["device"]["file_count"],
                status=res["risk"]["trust"],
                details="Manual scan completed successfully"
            )
        return jsonify({"status": "complete", "result": res}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/demo/mode", methods=["POST"])
def api_demo_mode():
    try:
        data = request.get_json() or {}
        mode = data.get("mode", "none")  # "none", "simulate_empty", "simulate_filed"
        state_tracker["demo_mode"] = mode
        event_logger.log_event(
            event_type="STATUS_CHANGED",
            status="DEMO",
            details=f"Demo mode set to: {mode}"
        )
        return jsonify({"message": f"Demo mode set to {mode}", "mode": mode}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("[USBShield Backend] Server starting on http://127.0.0.1:5000 ...")
    app.run(host="127.0.0.1", port=5000, debug=True)
