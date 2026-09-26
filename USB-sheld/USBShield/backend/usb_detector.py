import sys
from detectors.windows_detector import detect_windows_removable_drives

def get_connected_drives():
    """
    Cross-platform modular entry point for USB detection.
    Current MVP delegates to Windows agent.
    Future architecture can delegate to linux_detector, macos_detector based on sys.platform.
    """
    if sys.platform.startswith("win"):
        return detect_windows_removable_drives()
    elif sys.platform.startswith("linux"):
        # Placeholder for Linux detector module
        return []
    elif sys.platform == "darwin":
        # Placeholder for macOS detector module
        return []
    else:
        return detect_windows_removable_drives()
