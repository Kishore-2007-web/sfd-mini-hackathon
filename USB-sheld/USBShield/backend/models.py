"""
USBShield Data Models & Constants
"""

FILE_CATEGORY_MAP = {
    # Executables & Scripts
    ".exe": "executable",
    ".scr": "executable",
    ".dll": "library",
    ".sys": "library",
    ".drv": "library",
    ".bat": "script",
    ".cmd": "script",
    ".ps1": "script",
    ".vbs": "script",
    ".js": "script",
    ".vbe": "script",
    ".jse": "script",
    ".wsf": "script",
    ".sh": "script",
    
    # Documents
    ".pdf": "document",
    ".docx": "document",
    ".doc": "document",
    ".xlsx": "document",
    ".xls": "document",
    ".pptx": "document",
    ".ppt": "document",
    ".txt": "document",
    ".csv": "document",
    ".rtf": "document",

    # Media
    ".jpg": "image",
    ".jpeg": "image",
    ".png": "image",
    ".gif": "image",
    ".bmp": "image",
    ".svg": "image",
    ".mp4": "video",
    ".mkv": "video",
    ".avi": "video",
    ".mov": "video",
    ".mp3": "audio",
    ".wav": "audio",
    ".flac": "audio",

    # Archives & Disk Images
    ".zip": "archive",
    ".rar": "archive",
    ".7z": "archive",
    ".tar": "archive",
    ".gz": "archive",
    ".iso": "disk image",
    ".img": "disk image"
}

def get_file_category(extension: str) -> str:
    ext = extension.lower()
    return FILE_CATEGORY_MAP.get(ext, "other")
