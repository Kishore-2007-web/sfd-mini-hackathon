import datetime
import json
import os
import uuid

EVENTS_FILE = os.path.join(os.path.dirname(__file__), "events.json")

class EventLogger:
    def __init__(self, max_events=20):
        self.max_events = max_events
        self.events = []
        self._load_events()

    def _load_events(self):
        if os.path.exists(EVENTS_FILE):
            try:
                with open(EVENTS_FILE, "r", encoding="utf-8") as f:
                    self.events = json.load(f)
            except Exception as e:
                print(f"[EventLogger] Failed to load events: {e}")
                self.events = []

    def _save_events(self):
        try:
            with open(EVENTS_FILE, "w", encoding="utf-8") as f:
                json.dump(self.events, f, indent=2)
        except Exception as e:
            print(f"[EventLogger] Failed to save events: {e}")

    def log_event(self, event_type: str, drive: str = "", label: str = "", file_count: int = 0, status: str = "", details: str = "") -> dict:
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Deduplication check for frequent polling events
        if self.events:
            last = self.events[0]
            if (last.get("event") == event_type and 
                last.get("drive") == drive and 
                last.get("status") == status and 
                last.get("file_count") == file_count and
                last.get("details") == details):
                return last

        event_entry = {
            "id": str(uuid.uuid4())[:8],
            "timestamp": timestamp,
            "event": event_type,
            "drive": drive,
            "label": label,
            "file_count": file_count,
            "status": status,
            "details": details or f"{event_type.replace('_', ' ')} for {drive or 'system'}"
        }

        self.events.insert(0, event_entry)
        if len(self.events) > self.max_events:
            self.events = self.events[:self.max_events]
            
        self._save_events()
        return event_entry

    def get_events(self):
        return self.events

event_logger = EventLogger(max_events=20)
