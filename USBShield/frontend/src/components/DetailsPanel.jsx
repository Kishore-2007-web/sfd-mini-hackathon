import React from 'react';
import { HardDrive, FileText, AlertTriangle, Clock, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function DetailsPanel({ statusData, events = [] }) {
  const device = statusData?.device;
  const scan = statusData?.scan;
  const risk = statusData?.risk;
  const files = scan?.files || [];

  const factors = risk?.risk_factors || ["Files detected on removable storage"];
  const recentEvents = (events || []).slice(0, 5);

  return (
    <div className="details-section">
      
      {/* 1. DEVICE INFORMATION */}
      <div className="details-block">
        <div className="details-block-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <HardDrive style={{ width: '13px', height: '13px', color: '#38bdf8' }} />
          <span>DEVICE INFORMATION</span>
        </div>
        <div className="details-grid">
          <div className="details-item">
            <span>Volume Name</span>
            <strong className="mono">{device?.label || 'UNKNOWN'}</strong>
          </div>
          <div className="details-item">
            <span>Mount Drive</span>
            <strong className="mono">{device?.drive || 'E:'}\</strong>
          </div>
          <div className="details-item">
            <span>Filesystem</span>
            <strong className="mono">{device?.filesystem || 'FAT32'}</strong>
          </div>
          <div className="details-item">
            <span>Total Capacity</span>
            <strong className="mono">{device?.capacity_formatted || '14.9 GB'} ({device?.free_formatted || '11.3 GB'} Free)</strong>
          </div>
        </div>
      </div>

      {/* 2. RISK INDICATORS & RECOMMENDATION */}
      <div className="details-block">
        <div className="details-block-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: risk?.trust === 'SAFE' ? '#10b981' : '#ef4444' }}>
          <AlertTriangle style={{ width: '13px', height: '13px' }} />
          <span>RISK INDICATORS ({factors.length})</span>
        </div>
        
        {risk?.trust === 'SAFE' ? (
          <p style={{ fontSize: '13px', color: '#10b981' }}>✓ No risk indicators identified. Removable drive contains 0 files.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 12px 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {factors.map((factor, idx) => (
              <li key={idx} style={{ fontSize: '12px', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#ef4444' }}>•</span>
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        )}

        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle)', marginTop: '8px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
            RECOMMENDED ACTION
          </span>
          <p style={{ fontSize: '12px', color: '#f8fafc', fontWeight: '500' }}>
            "{risk?.recommendation || 'Review the USB contents before opening files.'}"
          </p>
        </div>
      </div>

      {/* 3. DETECTED CONTENT */}
      {files.length > 0 && (
        <div className="details-block">
          <div className="details-block-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileText style={{ width: '13px', height: '13px', color: '#f59e0b' }} />
            <span>DETECTED CONTENT ({files.length} FILES)</span>
          </div>

          <div className="file-mini-list">
            {files.map((file, idx) => (
              <div key={idx} className="file-mini-item">
                <div>
                  <span style={{ fontWeight: '600', color: '#ffffff' }}>{file.name}</span>
                  <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '8px' }}>{file.path}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{file.size_formatted}</span>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: file.category === 'executable' ? 'rgba(239, 68, 68, 0.2)' : (file.category === 'script' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)'),
                    color: file.category === 'executable' ? '#ef4444' : (file.category === 'script' ? '#f59e0b' : 'var(--text-muted)')
                  }}>
                    {file.category.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. RECENT ACTIVITY (MAX 5) */}
      <div className="details-block">
        <div className="details-block-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock style={{ width: '13px', height: '13px', color: '#818cf8' }} />
          <span>RECENT ACTIVITY (MAX 5)</span>
        </div>

        {recentEvents.length === 0 ? (
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No recent activity events recorded.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {recentEvents.map((evt) => (
              <div key={evt.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', padding: '6px 10px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: evt.status === 'UNTRUSTED' ? '#ef4444' : '#10b981' }}>●</span>
                  <span style={{ color: '#ffffff', fontWeight: '500' }}>{evt.event.replace('_', ' ')}</span>
                  <span style={{ color: 'var(--text-muted)' }}>- {evt.details}</span>
                </div>
                <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{evt.timestamp}</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
