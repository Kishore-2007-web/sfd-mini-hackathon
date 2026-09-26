def evaluate_usb_risk(scan_result: dict, activity_summary: dict = None) -> dict:
    """
    Central Risk Analysis Engine using transparent explainable rules.
    Does NOT claim malware infection or fake AI predictions.
    """
    if not scan_result or scan_result.get("drive") is None:
        return {
            "trust": "NO_USB_DEVICE",
            "risk_state": "NO_DEVICE",
            "risk_score": 0,
            "risk_level": "NONE",
            "risk_factors": [],
            "recommendation": "Connect a removable USB storage device to begin inspection.",
            "ai_analysis": {
                "enabled": False,
                "model": None,
                "classification": None,
                "confidence": None
            }
        }
        
    total_files = scan_result.get("total_files", 0)
    executables_count = scan_result.get("executables_count", 0)
    scripts_count = scan_result.get("scripts_count", 0)
    archives_count = scan_result.get("archives_count", 0)
    hidden_files_count = scan_result.get("hidden_files_count", 0)

    # CASE 2: Removable USB connected and 0 files
    if total_files == 0:
        return {
            "trust": "SAFE",
            "risk_state": "LOW",
            "risk_score": 0,
            "risk_level": "LOW",
            "risk_factors": [],
            "recommendation": "No files detected on removable storage.",
            "ai_analysis": {
                "enabled": False,
                "model": None,
                "classification": None,
                "confidence": None
            }
        }

    # CASE 3: Removable USB connected and 1 or more files
    score = 0
    risk_factors = []
    
    # 1. File presence rule (+1)
    score += 1
    risk_factors.append("Files detected on removable storage")
    
    # 2. Executable presence rule (+3)
    if executables_count > 0:
        score += 3
        risk_factors.append(f"Executable content detected ({executables_count} file{'s' if executables_count > 1 else ''})")
        
    # 3. Script presence rule (+3)
    if scripts_count > 0:
        score += 3
        risk_factors.append(f"Script content detected ({scripts_count} file{'s' if scripts_count > 1 else ''})")
        
    # 4. Archive presence rule (+1)
    if archives_count > 0:
        score += 1
        risk_factors.append(f"Archive content detected ({archives_count} file{'s' if archives_count > 1 else ''})")

    # 5. Hidden files presence rule (+2)
    if hidden_files_count > 0:
        score += 2
        risk_factors.append(f"Hidden content detected ({hidden_files_count} file{'s' if hidden_files_count > 1 else ''})")

    # 6. Activity changes rule (+3)
    if activity_summary and activity_summary.get("new_files_count", 0) > 0:
        score += 3
        new_cnt = activity_summary["new_files_count"]
        risk_factors.append(f"Rapid filesystem activity detected ({new_cnt} new file{'s' if new_cnt > 1 else ''} added)")

    # Determine risk level category
    if score <= 1:
        risk_level = "LOW"
    elif score <= 3:
        risk_level = "MODERATE"
    else:
        risk_level = "HIGH"

    return {
        "trust": "UNTRUSTED",
        "risk_state": "REQUIRES_INSPECTION",
        "risk_score": score,
        "risk_level": risk_level,
        "risk_factors": risk_factors,
        "recommendation": "Review USB contents before opening files.",
        "ai_analysis": {
            "enabled": False,
            "model": None,
            "classification": None,
            "confidence": None
        }
    }
