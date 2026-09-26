import subprocess
import json
import psutil

def detect_windows_removable_drives():
    """
    Detect ONLY genuine removable USB drives on Windows.
    DriveType=2 represents Removable Storage in Win32_LogicalDisk.
    Fixed local hard drives (DriveType=3, e.g., C:, D:, E:) are strictly ignored.
    """
    drives = []
    
    # 1. Primary Method: PowerShell CIM Win32_LogicalDisk (DriveType=2)
    try:
        ps_script = 'Get-CimInstance Win32_LogicalDisk -Filter "DriveType=2" | Select-Object DeviceID, VolumeName, FileSystem, Size, FreeSpace | ConvertTo-Json'
        cmd = ['powershell', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', ps_script]
        
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=5)
        stdout = result.stdout.strip()
        
        if stdout:
            parsed = json.loads(stdout)
            items = parsed if isinstance(parsed, list) else [parsed]
            
            for item in items:
                drive_id = item.get("DeviceID", "").strip()
                if not drive_id:
                    continue
                
                drive_letter = drive_id.rstrip('\\')
                total_bytes = int(item.get("Size") or 0)
                
                # Only include drives that have valid mounted size (prevents empty card readers)
                if total_bytes > 0:
                    label = item.get("VolumeName") or "Removable USB Disk"
                    filesystem = item.get("FileSystem") or "FAT32"
                    free_bytes = int(item.get("FreeSpace") or 0)
                    
                    drives.append({
                        "drive": drive_letter,
                        "label": label,
                        "filesystem": filesystem,
                        "total_bytes": total_bytes,
                        "free_bytes": free_bytes
                    })
            
            # If CIM returned a valid list (even empty []), return it directly!
            return drives
    except Exception as e:
        print(f"[WindowsDetector] PowerShell DriveType=2 detection failed: {e}")

    # 2. Fallback Method: psutil disk_partitions (STRICT 'removable' check)
    try:
        partitions = psutil.disk_partitions(all=False)
        for part in partitions:
            # STRICT CHECK: Must have 'removable' in opts
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
