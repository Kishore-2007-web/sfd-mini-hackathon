# USBShield
### AI-Based USB Malware Detection & Protection System (Hackathon MVP)

USBShield is a lightweight, explainable first-stage USB security system that automatically detects removable devices, inspects their filesystem contents, identifies risk indicators, monitors filesystem activity, and provides real-time security alerts.

---

## 1. Core Problem

USB drives are frequently used to transfer files across air-gapped or sensitive systems, but removable storage can carry:
- Malware & ransomware
- Suspicious scripts (`.ps1`, `.bat`, `.vbs`, `.js`)
- Executables & disguised binaries (`.exe`, `.scr`)
- Suspicious archives (`.zip`, `.rar`, `.7z`)
- Hidden files and manipulated content

Traditional signature-only antivirus software may fail to flag modified or zero-day threats immediately. USBShield acts as a lightweight, zero-footprint USB trust and threat-screening gatekeeper.

---

## 2. Primary MVP Decision Logic

| Scenario | Status | Trust Classification | Risk State |
| :--- | :--- | :--- | :--- |
| **No Removable USB Connected** | `NO USB DEVICE` | `NO_USB_DEVICE` | `NO_DEVICE` |
| **USB Connected & 0 Files** | `SAFE` | `SAFE` | `LOW` |
| **USB Connected & ≥ 1 Files** | `NOT SAFE` | `UNTRUSTED` | `REQUIRES INSPECTION` |

> ⚠️ **Important:** The presence of a file on a USB drive does **NOT** definitively mean it is malware. USBShield uses transparent terminology (`UNTRUSTED USB`, `FILES DETECTED`, `REQUIRES INSPECTION`) rather than false "MALWARE DETECTED" claims.

---

## 3. Current Target Platform

- **Current Target:** Windows 11 (removable storage detected via PowerShell / CIM `Win32_LogicalDisk` with `DriveType=2`).
- **Modular Architecture:** Platform detection is decoupled so agents for Linux, macOS, and IoT kiosks can plug into the same core engine.

---

## 4. Architecture Overview

```
                          USB DEVICE
                              │
                              ▼
                    ┌──────────────────┐
                    │ USB DETECTOR     │
                    │ Windows Agent    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ DEVICE PROFILE   │
                    │ Drive / Label /  │
                    │ Capacity / FS    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ FILE SCANNER     │
                    │ Extensions /     │
                    │ Metadata inspection│
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ RISK ENGINE      │
                    │ Explainable rules│
                    │ Executable/Script│
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ TRUST DECISION   │
                    │ SAFE / UNTRUSTED │
                    └────────┬─────────┘
                             │
            ┌────────────────┼────────────────┐
            ▼                ▼                ▼
         ALERTS           LOGGING          DASHBOARD
```

---

## 5. Technology Stack

- **Frontend:** React 18, Vite, Lucide React Icons, Vanilla CSS Design System (Endpoint Security Dark Console theme)
- **Backend:** Python 3, Flask, Flask-CORS, psutil
- **Detection Agent:** PowerShell / CIM `Win32_LogicalDisk` (`DriveType=2`)

---

## 6. Gaps Addressed

1. **Lightweight Architecture:** Only inspects metadata; does not lock drive or slow down system.
2. **Explainable Risk Indicators:** Gives clear reasons (*"Executable content detected"*, *"Script content detected"*) instead of black-box opaque scores.
3. **Security Event Visibility:** Contextual event logging (`USB_CONNECTED`, `FILES_DETECTED`, `ACTIVITY_DETECTED`, `STATUS_CHANGED`, `USB_REMOVED`).
4. **Behavioral Snapshot Monitoring:** Detects new files added to USB while mounted.
5. **AI/ML-Ready Architecture:** Designed for seamless integration of ML file classifiers and threat intelligence feeds.

---

## 7. Current Limitations

The current MVP does **NOT** prove malware infection. It does not currently detect:
- Zero-day malware code payloads
- Malicious firmware modifications
- BadUSB / HID keystroke injection attacks
- Fileless attacks
- Kernel-level threats
- Payload hidden within legitimate files (steganography/macros)

---

## 8. AI / Security Roadmap

- **Phase 1 (Current MVP):** USB Trust Screening & Metadata Inspection
- **Phase 2:** File Hash Reputation Analysis (VirusTotal / HashDB integration)
- **Phase 3:** ML-Based Binary File Classification
- **Phase 4:** Behavioral Anomaly Detection & Process Execution Guard
- **Phase 5:** Isolated Sandbox Analysis
- **Phase 6:** BadUSB / HID Hardware Integrity Verification
- **Phase 7:** Firmware Integrity Hash Analysis
- **Phase 8:** Cross-Platform Native Security Agents (Linux / macOS)

---

## 9. Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+

### Running USBShield
1. Double click `start.bat` on Windows 11.
2. Open `http://localhost:5173` in your browser.
3. The Flask API runs on `http://127.0.0.1:5000`.

---

## 10. Demo Simulation Mode

For demonstration environments without a physical USB flash drive:
1. Open the USBShield Console header.
2. Select **DEMO: SIMULATE EMPTY USB** or **DEMO: SIMULATE FILED USB**.
3. Real USB detection is enabled by default.
