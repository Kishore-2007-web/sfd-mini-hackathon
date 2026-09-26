import ctypes
import os
import psutil

DRIVE_REMOVABLE = 2

def detect_windows_removable_drives():
    """
    Detect ONLY genuine removable USB drives on Windows using fast native Win32 API calls.
    DriveType=2 represents Removable Storage (DRIVE_REMOVABLE).
    Fixed local hard drives (DriveType=3, e.g., C:, D:) are strictly ignored.
    """
    drives = []
    
    # 1. Primary Method: Native Win32 API (ultra-fast, zero subprocess overhead)
    if os.name == 'nt':
        try:
            kernel32 = ctypes.windll.kernel32
            buf = ctypes.create_unicode_buffer(1024)
            length = kernel32.GetLogicalDriveStringsW(1024, buf)
            
            if length > 0:
                raw_drives = [d for d in buf.value.split('\x00') if d]
                for raw_drive in raw_drives:
                    drive_type = kernel32.GetDriveTypeW(raw_drive)
                    if drive_type == DRIVE_REMOVABLE:
                        drive_letter = raw_drive.rstrip('\\')
                        
                        free_bytes = ctypes.c_ulonglong(0)
                        total_bytes = ctypes.c_ulonglong(0)
                        total_free = ctypes.c_ulonglong(0)
                        
                        res = kernel32.GetDiskFreeSpaceExW(
                            raw_drive,
                            ctypes.byref(free_bytes),
                            ctypes.byref(total_bytes),
                            ctypes.byref(total_free)
                        )
                        
                        # Only include mounted removable drives with valid capacity
                        if res and total_bytes.value > 0:
                            vol_buf = ctypes.create_unicode_buffer(1024)
                            fs_buf = ctypes.create_unicode_buffer(1024)
                            kernel32.GetVolumeInformationW(
                                raw_drive,
                                vol_buf, 1024,
                                None, None, None,
                                fs_buf, 1024
                            )
                            
                            label = vol_buf.value if vol_buf.value else "Removable USB Disk"
                            filesystem = fs_buf.value if fs_buf.value else "FAT32"
                            
                            drives.append({
                                "drive": drive_letter,
                                "label": label,
                                "filesystem": filesystem,
                                "total_bytes": total_bytes.value,
                                "free_bytes": free_bytes.value
                            })
                return drives
        except Exception as e:
            print(f"[WindowsDetector] Native Win32 API detection failed: {e}")

    # 2. Fallback Method: psutil disk_partitions (STRICT 'removable' check)
    try:
        partitions = psutil.disk_partitions(all=False)
        for part in partitions:
            opts = part.opts.lower()
            if 'removable' in opts:
                drive_letter = part.mountpoint.rstrip('\\')
                try:
                    usage = psutil.disk_usage(part.mountpoint)
                    if usage.total > 0:
                        drives.append({
                            "drive": drive_letter,
                            "label": "Removable USB Disk",
                            "filesystem": part.fstype or "FAT32",
                            "total_bytes": usage.total,
                            "free_bytes": usage.free
                        })
                except Exception:
                    pass
    except Exception as e:
        print(f"[WindowsDetector] psutil fallback failed: {e}")
        
    return drives

