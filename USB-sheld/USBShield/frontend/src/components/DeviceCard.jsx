import React from 'react';
import { HardDrive, Database, Folder, Clock, FileText, CheckCircle2 } from 'lucide-react';

export default function DeviceCard({ statusData }) {
  const connected = statusData?.connected;
  const device = statusData?.device;

  if (!connected || !device) {
    return (
      <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="panel-header">
          <div className="panel-title">
            <HardDrive style={{ width: '16px', height: '16px' }} />
            <span>DEVICE PROFILE</span>
          </div>
          <span className="badge badge-nodevice">DISCONNECTED</span>
        </div>
        <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-muted)' }}>
          <HardDrive style={{ width: '36px', height: '36px', strokeWidth: 1.5, marginBottom: '10px' }} />
          <p>No removable USB device connected.</p>
        </div>
      </div>
    );
  }

  const freePercent = device.total_bytes > 0 
    ? Math.round((device.free_bytes / device.total_bytes) * 100) 
    : 0;
  const usedPercent = 100 - freePercent;

  return (
    <div className="panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <div className="panel-title">
          <HardDrive style={{ width: '16px', height: '16px', color: '#38bdf8' }} />
          <span>DEVICE PROFILE</span>
        </div>
        <span className="badge badge-safe">ACTIVE AGENT</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
        
        <div style={{ background: 'var(--bg-panel)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>DEVICE LABEL</div>
          <div className="mono" style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', marginTop: '2px' }}>
            {device.label}
          </div>
        </div>

        <div style={{ background: 'var(--bg-panel)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>MOUNT PATH</div>
          <div className="mono" style={{ fontSize: '16px', fontWeight: '700', color: '#38bdf8', marginTop: '2px' }}>
            {device.drive}\
          </div>
        </div>

        <div style={{ background: 'var(--bg-panel)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>FILESYSTEM</div>
          <div className="mono" style={{ fontSize: '14px', fontWeight: '600', color: '#f8fafc', marginTop: '2px' }}>
            {device.filesystem}
          </div>
        </div>

        <div style={{ background: 'var(--bg-panel)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>TOTAL FILES</div>
          <div className="mono" style={{ fontSize: '14px', fontWeight: '600', color: '#f59e0b', marginTop: '2px' }}>
            {device.file_count} files
          </div>
        </div>

      </div>

      {/* Storage Capacity Bar */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Capacity Used: {device.used_formatted} / {device.capacity_formatted}</span>
          <span style={{ color: 'var(--text-muted)' }}>{freePercent}% Free</span>
        </div>
        <div style={{ width: '100%', height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${usedPercent}%`, height: '100%', background: 'linear-gradient(90deg, #38bdf8 0%, #818cf8 100%)', borderRadius: '4px' }} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Clock style={{ width: '12px', height: '12px' }} />
          Last Scan: {device.last_scan_time || 'Just now'}
        </span>
        <span style={{ color: '#10b981' }}>Metadata Only</span>
      </div>
    </div>
  );
}
