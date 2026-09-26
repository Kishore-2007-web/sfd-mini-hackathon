import os
import pathlib
import datetime
from models import get_file_category

def format_size(size_in_bytes: int) -> str:
    if size_in_bytes < 1024:
        return f"{size_in_bytes} B"
    elif size_in_bytes < 1024 * 1024:
        return f"{size_in_bytes / 1024:.1f} KB"
    elif size_in_bytes < 1024 * 1024 * 1024:
        return f"{size_in_bytes / (1024 * 1024):.1f} MB"
    else:
        return f"{size_in_bytes / (1024 * 1024 * 1024):.1f} GB"

def is_file_hidden(filepath: str) -> bool:
    """Safely check if a file or directory is hidden on Windows/POSIX."""
    try:
        filename = os.path.basename(filepath)
        if filename.startswith('.'):
            return True
        if os.name == 'nt':
            import ctypes
            attrs = ctypes.windll.kernel32.GetFileAttributesW(str(filepath))
            if attrs != -1 and (attrs & 2):  # FILE_ATTRIBUTE_HIDDEN = 2
                return True
    except Exception:
        pass
    return False

def scan_drive(drive_path: str) -> dict:
    """
    Recursively scans the given drive path metadata safely.
    Does NOT execute, open, modify, delete or quarantine any file.
    """
    # Normalize drive path e.g. 'E:' -> 'E:\\'
    root_path = drive_path.rstrip('\\') + '\\'
    
    files_list = []
    category_counts = {
        "executable": 0,
        "script": 0,
        "library": 0,
        "document": 0,
        "image": 0,
        "video": 0,
        "audio": 0,
        "archive": 0,
        "disk image": 0,
        "other": 0
    }
    hidden_files_count = 0
    
    if not os.path.exists(root_path):
        return {
            "error": "Drive path does not exist",
            "drive": drive_path,
            "scanned_at": datetime.datetime.now().isoformat(),
            "total_files": 0,
            "files": [],
            "category_summary": category_counts,
            "executables_count": 0,
            "scripts_count": 0,
            "archives_count": 0,
            "hidden_files_count": 0
        }
        
    try:
        for root, dirs, filenames in os.walk(root_path, followlinks=False):
            # Skip system folders to prevent permission errors and false noise
            dirs[:] = [d for d in dirs if d.upper() not in ['System Volume Information', '$RECYCLE.BIN']]
            
            for f in filenames:
                full_path = os.path.join(root, f)
                rel_path = os.path.relpath(full_path, root_path)
                
                try:
                    stat = os.stat(full_path)
                    size_bytes = stat.st_size
                except (PermissionError, OSError, FileNotFoundError):
                    size_bytes = 0

                ext = os.path.splitext(f)[1].lower()
                category = get_file_category(ext)
                category_counts[category] = category_counts.get(category, 0) + 1
                
                hidden = is_file_hidden(full_path)
                if hidden:
                    hidden_files_count += 1

                # Determine risk indicator string for file table
                if category == "executable":
                    risk_indicator = "Executable content"
                elif category == "script":
                    risk_indicator = "Script content"
                elif category == "archive":
                    risk_indicator = "Archive file"
                elif hidden:
                    risk_indicator = "Hidden file"
                else:
                    risk_indicator = "None"
                    
                files_list.append({
                    "name": f,
                    "path": "\\" + rel_path,
                    "extension": ext or "none",
                    "size_bytes": size_bytes,
                    "size_formatted": format_size(size_bytes),
                    "category": category,
                    "risk_indicator": risk_indicator,
                    "status": "REVIEW"
                })
    except Exception as e:
        print(f"[Scanner] Error walking path {root_path}: {e}")

    return {
        "drive": drive_path,
        "scanned_at": datetime.datetime.now().isoformat(),
        "total_files": len(files_list),
        "files": files_list,
        "category_summary": category_counts,
        "executables_count": category_counts["executable"],
        "scripts_count": category_counts["script"],
        "archives_count": category_counts["archive"],
        "hidden_files_count": hidden_files_count
    }
