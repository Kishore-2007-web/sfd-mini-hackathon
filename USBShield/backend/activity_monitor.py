class USBActivityMonitor:
    def __init__(self):
        self.snapshots = {}  # drive -> { "file_count": int, "file_paths": set(...) }

    def clear(self, drive: str = None):
        if drive:
            self.snapshots.pop(drive, None)
        else:
            self.snapshots.clear()

    def update_and_compare(self, drive: str, current_scan: dict) -> dict:
        if not drive or not current_scan:
            return {
                "has_previous_snapshot": False,
                "new_files_count": 0,
                "removed_files_count": 0,
                "new_files": [],
                "removed_files": [],
                "activity_detected": False,
                "message": "No active drive"
            }

        current_files = current_scan.get("files", [])
        current_paths = {f["path"] for f in current_files}
        current_count = len(current_paths)

        prev = self.snapshots.get(drive)
        
        if prev is None:
            # Initial snapshot taken
            self.snapshots[drive] = {
                "file_count": current_count,
                "file_paths": current_paths
            }
            return {
                "has_previous_snapshot": False,
                "new_files_count": 0,
                "removed_files_count": 0,
                "new_files": [],
                "removed_files": [],
                "activity_detected": False,
                "message": f"Initial snapshot recorded ({current_count} files)"
            }

        prev_paths = prev["file_paths"]
        new_paths = list(current_paths - prev_paths)
        removed_paths = list(prev_paths - current_paths)

        activity_detected = len(new_paths) > 0
        message = ""
        if activity_detected:
            message = f"Unusual filesystem activity detected: {len(new_paths)} new file{'s' if len(new_paths)>1 else ''} added."
        elif len(removed_paths) > 0:
            message = f"Filesystem activity: {len(removed_paths)} file{'s' if len(removed_paths)>1 else ''} removed."
        else:
            message = "No filesystem activity detected since last scan."

        # Update snapshot for next scan
        self.snapshots[drive] = {
            "file_count": current_count,
            "file_paths": current_paths
        }

        return {
            "has_previous_snapshot": True,
            "new_files_count": len(new_paths),
            "removed_files_count": len(removed_paths),
            "new_files": new_paths,
            "removed_files": removed_paths,
            "activity_detected": activity_detected,
            "message": message
        }

activity_monitor = USBActivityMonitor()
