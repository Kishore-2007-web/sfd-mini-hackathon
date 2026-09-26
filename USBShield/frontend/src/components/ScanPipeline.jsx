import React from 'react';
import { Layers, CheckCircle2, ChevronRight, RefreshCw, HardDrive, Search, ShieldCheck } from 'lucide-react';

export default function ScanPipeline({ isScanning, connected, trust }) {
  const steps = [
    { label: 'USB DEVICE DETECTED', icon: HardDrive },
    { label: 'DEVICE IDENTIFIED', icon: Search },
    { label: 'STORAGE MOUNTED', icon: Layers },
    { label: 'FILESYSTEM SCANNED', icon: Search },
    { label: 'CONTENT ANALYZED', icon: Search },
    { label: 'RISK ASSESSED', icon: ShieldCheck },
    { label: 'TRUST STATUS GENERATED', icon: ShieldCheck }
  ];

  return (
    <div className="panel" style={{ marginBottom: '20px' }}>
      <div className="panel-header">
        <div className="panel-title">
          <Layers style={{ width: '16px', height: '16px', color: '#38bdf8' }} />
          <span>INSPECTION PIPELINE</span>
        </div>
        <span className="badge" style={{ background: isScanning ? 'var(--color-warning-bg)' : 'rgba(255, 255, 255, 0.05)', color: isScanning ? 'var(--color-warning)' : 'var(--text-muted)' }}>
          {isScanning ? 'PIPELINE ACTIVE' : (connected ? 'PIPELINE READY' : 'IDLE')}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', padding: '8px 0' }}>
        {steps.map((step, idx) => {
          const isDone = connected && !isScanning;
          const isActive = isScanning;
          
          return (
            <React.Fragment key={idx}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '6px',
                background: isActive ? 'rgba(56, 189, 248, 0.1)' : (isDone ? 'rgba(16, 185, 129, 0.08)' : 'rgba(0, 0, 0, 0.2)'),
                border: `1px solid ${isActive ? 'rgba(56, 189, 248, 0.4)' : (isDone ? 'rgba(16, 185, 129, 0.2)' : 'var(--border-subtle)')}`,
                flex: '1',
                minWidth: '130px',
                transition: 'all 0.3s ease'
              }}>
                {isActive ? (
                  <RefreshCw style={{ width: '14px', height: '14px', color: '#38bdf8', animation: 'spin 1s linear infinite' }} />
                ) : isDone ? (
                  <CheckCircle2 style={{ width: '14px', height: '14px', color: '#10b981' }} />
                ) : (
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '1px solid var(--text-muted)' }} />
                )}
                
                <span style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.04em', color: isDone ? '#f8fafc' : 'var(--text-muted)' }}>
                  {step.label}
                </span>
              </div>
              
              {idx < steps.length - 1 && (
                <ChevronRight style={{ width: '14px', height: '14px', color: 'var(--text-muted)', flexShrink: 0 }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
