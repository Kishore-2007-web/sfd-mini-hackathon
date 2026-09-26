import React from 'react';
import { Terminal, Clock, ShieldAlert, ShieldCheck, Activity, HardDriveDownload, HardDriveUpload } from 'lucide-react';

export default function EventTimeline({ events = [] }) {
  const getEventIcon = (type) => {
    switch (type) {
      case 'USB_CONNECTED':
        return <HardDriveDownload style={{ width: '14px', height: '14px', color: '#38bdf8' }} />;
      case 'USB_REMOVED':
        return <HardDriveUpload style={{ width: '14px', height: '14px', color: '#64748b' }} />;
      case 'EXECUTABLE_DETECTED':
      case 'SCRIPT_DETECTED':
        return <ShieldAlert style={{ width: '14px', height: '14px', color: '#ef4444' }} />;
      case 'ACTIVITY_DETECTED':
        return <Activity style={{ width: '14px', height: '14px', color: '#f59e0b' }} />;
      default:
        return <Terminal style={{ width: '14px', height: '14px', color: '#94a3b8' }} />;
    }
  };

  return (
    <div className="panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <div className="panel-title">
          <Terminal style={{ width: '16px', height: '16px', color: '#10b981' }} />
          <span>SECURITY EVENTS ({events.length})</span>
        </div>
        <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
          REAL-TIME LOG
        </span>
      </div>

      {events.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
          <p>No security events recorded yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '350px', overflowY: 'auto', paddingRight: '4px' }}>
          {events.map((evt) => (
            <div key={evt.id} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              background: 'var(--bg-panel)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '10px 12px'
            }}>
              <div style={{ marginTop: '2px' }}>
                {getEventIcon(evt.event)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <span className="mono" style={{ fontSize: '12px', fontWeight: '700', color: '#ffffff' }}>
                    {evt.event}
                  </span>
                  <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {evt.timestamp}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {evt.details}
                </p>
                {evt.drive && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <span>Target: <strong>{evt.drive}</strong></span>
                    {evt.status && <span>Status: <strong style={{ color: evt.status === 'UNTRUSTED' ? '#ef4444' : '#10b981' }}>{evt.status}</strong></span>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
