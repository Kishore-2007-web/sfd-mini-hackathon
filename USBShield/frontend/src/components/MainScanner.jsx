import React from 'react';
import { HardDrive, ShieldCheck, ShieldAlert, CheckCircle2, ChevronDown, ChevronUp, AlertCircle, RefreshCw } from 'lucide-react';

export default function MainScanner({ scanState, scanStage, statusData, showDetails, onToggleDetails, onManualScan }) {
  const connected = statusData?.connected;
  const trust = statusData?.risk?.trust || 'NO_USB_DEVICE';
  const fileCount = statusData?.scan?.total_files ?? 0;
  const device = statusData?.device;

  // 1. IDLE STATE: No USB connected
  if (!connected && scanState === 'IDLE') {
    return (
      <div className="utility-main">
        <div className="icon-container">
          <HardDrive style={{ width: '40px', height: '40px', color: '#64748b' }} />
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>
          NO USB DEVICE
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', maxWidth: '320px', marginBottom: '20px' }}>
          Connect a removable USB drive to begin inspection.
        </p>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <span className="pulse-dot online" style={{ width: '6px', height: '6px' }} />
          <span>Monitoring USB ports</span>
        </div>
      </div>
    );
  }

  // 2. SCANNING STATES: DETECTING, SCANNING, ANALYZING
  if (scanState === 'DETECTING' || scanState === 'SCANNING' || scanState === 'ANALYZING') {
    return (
      <div className="utility-main">
        <div className="icon-container">
          <div className="scan-ring" />
          <HardDrive style={{ width: '40px', height: '40px', color: '#38bdf8' }} />
        </div>

        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
          USB DEVICE DETECTED
        </h2>
        
        {device && (
          <div className="mono" style={{ fontSize: '14px', fontWeight: '600', color: '#38bdf8', marginBottom: '16px' }}>
            {device.label} ({device.drive}\)
          </div>
        )}

        <div style={{ fontSize: '12px', fontWeight: '700', color: '#f59e0b', letterSpacing: '0.08em', uppercase: true, marginBottom: '16px' }}>
          SCANNING FILESYSTEM...
        </div>

        {/* Animated Checklist sequence */}
        <div className="scan-steps">
          <div className={`scan-step-item ${scanStage >= 1 ? (scanStage > 1 ? 'done' : 'active') : ''}`}>
            <span>Identifying device</span>
            {scanStage > 1 ? <CheckCircle2 style={{ width: '14px', height: '14px', color: '#10b981' }} /> : (scanStage === 1 ? <RefreshCw style={{ width: '13px', height: '13px', color: '#38bdf8', animation: 'spin 1s linear infinite' }} /> : <span>○</span>)}
          </div>

          <div className={`scan-step-item ${scanStage >= 2 ? (scanStage > 2 ? 'done' : 'active') : ''}`}>
            <span>Scanning filesystem</span>
            {scanStage > 2 ? <CheckCircle2 style={{ width: '14px', height: '14px', color: '#10b981' }} /> : (scanStage === 2 ? <RefreshCw style={{ width: '13px', height: '13px', color: '#38bdf8', animation: 'spin 1s linear infinite' }} /> : <span>○</span>)}
          </div>

          <div className={`scan-step-item ${scanStage >= 3 ? (scanStage > 3 ? 'done' : 'active') : ''}`}>
            <span>Analyzing content risk</span>
            {scanStage > 3 ? <CheckCircle2 style={{ width: '14px', height: '14px', color: '#10b981' }} /> : (scanStage === 3 ? <RefreshCw style={{ width: '13px', height: '13px', color: '#38bdf8', animation: 'spin 1s linear infinite' }} /> : <span>○</span>)}
          </div>
        </div>
      </div>
    );
  }

  // 3. ERROR STATE: Backend disconnected
  if (scanState === 'ERROR') {
    return (
      <div className="utility-main">
        <div className="icon-container" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
          <AlertCircle style={{ width: '40px', height: '40px', color: '#ef4444' }} />
        </div>

        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#ef4444', marginBottom: '6px' }}>
          AGENT OFFLINE
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', maxWidth: '340px' }}>
          Unable to communicate with the local security agent. Ensure Flask backend is running on port 5000.
        </p>
      </div>
    );
  }

  // 4. RESULT STATE: SAFE or NOT SAFE
  const isSafe = trust === 'SAFE' || fileCount === 0;

  return (
    <div className="utility-main">
      {isSafe ? (
        <div className="result-card-safe">
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <ShieldCheck style={{ width: '30px', height: '30px', color: '#10b981' }} />
          </div>

          <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#ffffff', marginBottom: '4px', letterSpacing: '-0.02em' }}>
            ✓ SAFE
          </h2>
          <p style={{ color: '#10b981', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
            No files detected on removable storage
          </p>

          {device && (
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.3)', padding: '6px 14px', borderRadius: '20px', display: 'inline-block' }}>
              <span className="mono" style={{ color: '#ffffff', fontWeight: '600' }}>{device.label} • {device.drive}\</span> (0 files)
            </div>
          )}
        </div>
      ) : (
        <div className="result-card-danger">
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <ShieldAlert style={{ width: '30px', height: '30px', color: '#ef4444' }} />
          </div>

          <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#ffffff', marginBottom: '4px', letterSpacing: '-0.02em' }}>
            ⚠ NOT SAFE
          </h2>
          <p style={{ color: '#f87171', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
            Untrusted USB content detected
          </p>

          {device && (
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.3)', padding: '6px 14px', borderRadius: '20px', display: 'inline-block' }}>
              <span className="mono" style={{ color: '#ffffff', fontWeight: '600' }}>{device.label} • {device.drive}\</span> ({fileCount} files detected • Requires inspection)
            </div>
          )}
        </div>
      )}

      {/* Expand Details Button */}
      <button className="btn-toggle" onClick={onToggleDetails}>
        <span>{showDetails ? 'HIDE DETAILS' : 'VIEW DETAILS'}</span>
        {showDetails ? <ChevronUp style={{ width: '16px', height: '16px' }} /> : <ChevronDown style={{ width: '16px', height: '16px' }} />}
      </button>
    </div>
  );
}
