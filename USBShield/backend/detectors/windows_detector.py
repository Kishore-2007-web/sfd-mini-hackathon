import subprocess
import json
import psutil
import os

def detect_windows_removable_drives():
    """
    Detect removable drives on Windows using PowerShell / CIM Win32_LogicalDisk (DriveType=2).
    Fallback to psutil if PowerShell is unavailable or fails.
    """
    drives = []
    
    # Try PowerShell CIM instance query first
    try:
        ps_script = 'Get-CimInstance Win32_LogicalDisk -Filter "DriveType=2" | Select-Object DeviceID, VolumeName, FileSystem, Size, FreeSpace | ConvertTo-Json'
        cmd = ['powershell', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', ps_script]
        
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=5)
        stdout = result.stdout.strip()
        
        if stdout:
            parsed = json.loads(stdout)
            # PowerShell ConvertTo-Json returns a dict for 1 item, list for >1 items
            items = parsed if isinstance(parsed, list) else [parsed]
            
            for item in items:
                drive_id = item.get("DeviceID", "").strip()
                if not drive_id:
                    continue
                # Ensure trailing colon without backslash (e.g., 'E:')
                drive_letter = drive_id.rstrip('\\')
                
                label = item.get("VolumeName") or "Removable Disk"
                filesystem = item.get("FileSystem") or "Unknown"
                total_bytes = int(item.get("Size") or 0)
                free_bytes = int(item.get("FreeSpace") or 0)
                
                drives.append({
                    "drive": drive_letter,
                    "label": label,
                    "filesystem": filesystem,
                    "total_bytes": total_bytes,
                    "free_bytes": free_bytes
                })
            return drives
    except Exception as e:
        print(f"[WindowsDetector] PowerShell detection failed: {e}")

    # Fallback to psutil disk partitions
    try:
        partitions = psutil.disk_partitions(all=True)
        for part in partitions:
            if 'removable' in part.opts.lower() or part.fstype != '':
                # Check if it's not system drive C:
                if part.mountpoint.upper().startswith('C'):
                    continue
                drive_letter = part.mountpoint.rstrip('\\')
                try:
                    usage = psutil.disk_usage(part.mountpoint)
                    total_bytes = usage.total
                    free_bytes = usage.free
                except Exception:
                    total_bytes = 0
                    free_bytes = 0
                
                drives.append({
                    "drive": drive_letter,
                    "label": "Removable Disk",
                    "filesystem": part.fstype or "FAT32",
                    "total_bytes": total_bytes,
                    "free_bytes": free_bytes
                })
    except Exception as e:
        print(f"[WindowsDetector] psutil fallback failed: {e}")
        
    return drives
