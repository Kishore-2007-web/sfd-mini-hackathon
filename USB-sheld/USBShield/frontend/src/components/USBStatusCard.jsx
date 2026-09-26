import React from 'react';
import { ShieldCheck, ShieldAlert, HardDrive, AlertTriangle, CheckCircle2, HardDriveDownload } from 'lucide-react';

export default function USBStatusCard({ statusData, isScanning }) {
  const connected = statusData?.connected;
  const trust = statusData?.risk?.trust || 'NO_USB_DEVICE';
  const riskState = statusData?.risk?.risk_state || 'NO_DEVICE';
  const fileCount = statusData?.scan?.total_files ?? 0;
  const device = statusData?.device;

  // Determine visual styling based on primary trust status rules
  let cardStyle = {
    background: 'var(--bg-card)',
    borderColor: 'var(--border-subtle)',
    glow: 'none'
  };

  if (!connected || trust === 'NO_USB_DEVICE') {
    cardStyle = {
      background: 'rgba(30, 41, 59, 0.3)',
      borderColor: 'rgba(255, 255, 255, 0.08)',
      iconColor: '#64748b',
      badgeClass: 'badge-nodevice',
      title: 'NO USB DEVICE',
      subtext: 'Connect a removable USB storage device to begin inspection.'
    };
  } else if (trust === 'SAFE' || fileCount === 0) {
    cardStyle = {
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(14, 17, 23, 0.95) 100%)',
      borderColor: 'rgba(16, 185, 129, 0.3)',
      iconColor: '#10b981',
      badgeClass: 'badge-safe',
      title: 'SAFE',
      subtext: 'No files detected on removable storage.'
    };
  } else {
    cardStyle = {
      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(14, 17, 23, 0.95) 100%)',
      borderColor: 'rgba(239, 68, 68, 0.3)',
      iconColor: '#ef4444',
      badgeClass: 'badge-untrusted',
      title: 'NOT SAFE',
      subtext: 'Files detected on removable storage. Requires inspection before opening.'
    };
  }

  return (
    <div className="panel" style={{
      background: cardStyle.background,
      borderColor: cardStyle.borderColor,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: `1px solid ${cardStyle.borderColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {!connected || trust === 'NO_USB_DEVICE' ? (
              <HardDrive style={{ width: '28px', height: '28px', color: cardStyle.iconColor }} />
            ) : trust === 'SAFE' ? (
              <ShieldCheck style={{ width: '28px', height: '28px', color: cardStyle.iconColor }} />
            ) : (
              <ShieldAlert style={{ width: '28px', height: '28px', color: cardStyle.iconColor }} />
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.02em', color: '#ffffff' }}>
                {cardStyle.title}
              </h2>
              <span className={`badge ${cardStyle.badgeClass}`}>
                TRUST: {trust}
              </span>
              {connected && (
                <span className="badge badge-warning">
                  STATE: {riskState}
                </span>
              )}
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
              {cardStyle.subtext}
            </p>
          </div>
        </div>

        {/* Quick Drive Stats Badge */}
        {connected && device && (
          <div style={{
            textAlign: 'right',
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              TARGET DEVICE
            </div>
            <div className="mono" style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc', marginTop: '2px' }}>
              {device.label} ({device.drive})
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Files Detected: <strong style={{ color: fileCount > 0 ? '#f59e0b' : '#10b981' }}>{fileCount}</strong>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
