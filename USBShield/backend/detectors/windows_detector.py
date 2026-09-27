import ctypes
import os
import psutil

DRIVE_REMOVABLE = 2
DRIVE_FIXED = 3

SEM_FAILCRITICALERRORS = 0x0001

def check_usb_bus_type(drive_letter: str) -> bool:
    """Helper to check if a drive is attached via USB using Win32 IOCTL."""
    try:
        kernel32 = ctypes.windll.kernel32
        drive_path = r'\\.\\' + drive_letter.rstrip('\\')
        FILE_SHARE_READ = 0x00000001
        FILE_SHARE_WRITE = 0x00000002
        OPEN_EXISTING = 3

        handle = kernel32.CreateFileW(
            drive_path,
            0,
            FILE_SHARE_READ | FILE_SHARE_WRITE,
            None,
            OPEN_EXISTING,
            0,
            None
        )
        if handle == -1 or handle == 0:
            return False

        try:
            query = ctypes.c_buffer(12)
            out_buf = ctypes.c_buffer(1024)
            bytes_returned = ctypes.c_ulong(0)
            IOCTL_STORAGE_QUERY_PROPERTY = 0x2D1400

            res = kernel32.DeviceIoControl(
                handle,
                IOCTL_STORAGE_QUERY_PROPERTY,
                query, 12,
                out_buf, 1024,
                ctypes.byref(bytes_returned),
                None
            )
            if res:
                bus_type = ctypes.c_ulong.from_buffer(out_buf, 28).value
                return bus_type == 7  # BusTypeUsb = 7
        finally:
            kernel32.CloseHandle(handle)
    except Exception:
        pass
    return False

def detect_windows_removable_drives():
    """
    Detect genuine removable and USB storage drives on Windows using safe Win32 API calls.
    Ignores system OS drive (C:).
    Handles unready drives gracefully without raising WinError popups or crashing.
    """
    drives = []
    seen_drives = set()
    sys_drive = os.environ.get("SystemDrive", "C:").upper().rstrip("\\")

    if os.name == 'nt':
        try:
            kernel32 = ctypes.windll.kernel32
            # Suppress Windows error dialog boxes for unready drives (e.g. card readers)
            kernel32.SetErrorMode(SEM_FAILCRITICALERRORS)

            buf = ctypes.create_unicode_buffer(1024)
            length = kernel32.GetLogicalDriveStringsW(1024, buf)

            if length > 0:
                raw_drives = [d for d in buf.value.split('\x00') if d]
                for raw_drive in raw_drives:
                    drive_letter = raw_drive.rstrip('\\').upper()

                    # Always skip system drive
                    if drive_letter == sys_drive:
                        continue

                    try:
                        drive_type = kernel32.GetDriveTypeW(raw_drive)
                        is_usb = (drive_type == DRIVE_REMOVABLE)

                        # If DRIVE_FIXED, check if attached via USB bus
                        if drive_type == DRIVE_FIXED:
                            is_usb = check_usb_bus_type(drive_letter)

                        if not is_usb:
                            continue

                        free_bytes = ctypes.c_ulonglong(0)
                        total_bytes = ctypes.c_ulonglong(0)
                        total_free = ctypes.c_ulonglong(0)

                        res = kernel32.GetDiskFreeSpaceExW(
                            raw_drive,
                            ctypes.byref(free_bytes),
                            ctypes.byref(total_bytes),
                            ctypes.byref(total_free)
                        )

                        if res and total_bytes.value > 0:
                            vol_buf = ctypes.create_unicode_buffer(1024)
                            fs_buf = ctypes.create_unicode_buffer(1024)
                            try:
                                kernel32.GetVolumeInformationW(
                                    raw_drive,
                                    vol_buf, 1024,
                                    None, None, None,
                                    fs_buf, 1024
                                )
                                label = vol_buf.value if vol_buf.value else "Removable USB Disk"
                                filesystem = fs_buf.value if fs_buf.value else "FAT32"
                            except Exception:
                                label = "Removable USB Disk"
                                filesystem = "FAT32"

                            drives.append({
                                "drive": drive_letter,
                                "label": label,
                                "filesystem": filesystem,
                                "total_bytes": total_bytes.value,
                                "free_bytes": free_bytes.value
                            })
                            seen_drives.add(drive_letter)
                    except Exception as drive_err:
                        print(f"[WindowsDetector] Error inspecting drive {raw_drive}: {drive_err}")

                if drives:
                    return drives
        except Exception as e:
            print(f"[WindowsDetector] Native Win32 API detection failed: {e}")

    # Fallback Method: psutil
    try:
        partitions = psutil.disk_partitions(all=True)
        for part in partitions:
            drive_letter = part.mountpoint.rstrip('\\').upper()
            if drive_letter == sys_drive or drive_letter in seen_drives:
                continue

            opts = part.opts.lower()
            if 'removable' in opts or check_usb_bus_type(drive_letter):
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
                        seen_drives.add(drive_letter)
                except Exception:
                    pass
    except Exception as e:
        print(f"[WindowsDetector] psutil fallback failed: {e}")

    return drives
