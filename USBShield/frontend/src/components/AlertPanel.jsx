import React from 'react';
import { AlertTriangle, Eye, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function AlertPanel({ statusData, onScrollToFiles, onManualScan, isScanning }) {
  const connected = statusData?.connected;
  const fileCount = statusData?.scan?.total_files ?? 0;
  const risk = statusData?.risk;
  const device = statusData?.device;

  if (!connected || fileCount === 0 || !risk || risk.trust === 'SAFE') {
    return null; // Only show security alert when files exist on USB
  }

  const factors = risk.risk_factors || ["Files detected on removable storage"];

  return (
    <div className="panel" style={{
      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(245, 158, 11, 0.05) 100%)',
      borderColor: 'rgba(239, 68, 68, 0.4)',
      boxShadow: '0 4px 20px rgba(239, 68, 68, 0.08)',
      marginBottom: '20px'
    }}>
      <div className="panel-header" style={{ borderBottomColor: 'rgba(239, 68, 68, 0.2)' }}>
        <div className="panel-title" style={{ color: '#f87171' }}>
          <AlertTriangle style={{ width: '18px', height: '18px', color: '#ef4444' }} />
          <span>USB SECURITY ALERT — CONTENT DETECTED</span>
        </div>
        <span className="badge badge-untrusted">
          TRUST STATUS: UNTRUSTED
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        
        {/* Left column: Summary Info */}
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>DEVICE LABEL</div>
              <div className="mono" style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff' }}>
                {device?.label || 'UNKNOWN'}
              </div>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>MOUNT DRIVE</div>
              <div className="mono" style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff' }}>
                {device?.drive || 'E:'}
              </div>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>DETECTED FILES</div>
              <div className="mono" style={{ fontSize: '14px', fontWeight: '700', color: '#f59e0b' }}>
                {fileCount} total
              </div>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>RISK LEVEL</div>
              <div className="mono" style={{ fontSize: '14px', fontWeight: '700', color: '#ef4444' }}>
                {risk.risk_level || 'HIGH'} ({risk.risk_score}/10)
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
              RECOMMENDED ACTION
            </div>
            <p style={{ color: '#f8fafc', fontSize: '13px', fontWeight: '500' }}>
              "{risk.recommendation || 'Review the contents before opening files.'}"
            </p>
          </div>
        </div>

        {/* Right column: Why section */}
        <div>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
            WHY IS THIS USB UNTRUSTED?
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {factors.map((factor, idx) => (
              <li key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: '#f8fafc',
                background: 'rgba(0, 0, 0, 0.2)',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)'
              }}>
                <span style={{ color: '#ef4444', fontWeight: 'bold' }}>•</span>
                <span>{factor}</span>
              </li>
            ))}
            <li style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              padding: '4px 8px'
            }}>
              <span style={{ color: '#f59e0b' }}>•</span>
              <span>Further inspection recommended before execution</span>
            </li>
          </ul>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-primary" onClick={onScrollToFiles} style={{ flex: 1 }}>
              <Eye style={{ width: '14px', height: '14px' }} />
              <span>VIEW FILES</span>
            </button>
            <button className="btn" onClick={onManualScan} disabled={isScanning}>
              <RefreshCw style={{ width: '14px', height: '14px' }} />
              <span>SCAN AGAIN</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
