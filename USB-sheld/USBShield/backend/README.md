# USBShield Backend Engine

Python Flask service for real-time USB removable storage detection, filesystem inspection, explainable risk assessment, activity monitoring, and security event logging.

## API Endpoints

- `GET /api/status`: Active USB status, device profile, content scan, risk evaluation, activity monitor snapshot
- `GET /api/drives`: List of detected removable drives
- `GET /api/events`: Security event log (last 20 events)
- `POST /api/scan`: Trigger immediate rescan
- `POST /api/demo/mode`: Set demo simulation mode (`none`, `simulate_empty`, `simulate_filed`)

## Run Backend

```bash
py -3 app.py
```
Backend runs on `http://127.0.0.1:5000`.
