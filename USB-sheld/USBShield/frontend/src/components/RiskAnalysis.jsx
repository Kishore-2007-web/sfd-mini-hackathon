import React from 'react';
import { Cpu, ShieldAlert, FileCode, Archive, Eye, AlertTriangle } from 'lucide-react';

export default function RiskAnalysis({ statusData }) {
  const connected = statusData?.connected;
  const scan = statusData?.scan;
  const risk = statusData?.risk;
  const activity = statusData?.activity;

  const trust = risk?.trust || 'NO_USB_DEVICE';
  const score = risk?.risk_score ?? 0;
  const riskLevel = risk?.risk_level || 'LOW';

  const executables = scan?.executables_count ?? 0;
  const scripts = scan?.scripts_count ?? 0;
  const archives = scan?.archives_count ?? 0;
  const hidden = scan?.hidden_files_count ?? 0;
  const newFiles = activity?.new_files_count ?? 0;
  const indicatorsCount = risk?.risk_factors?.length ?? 0;

  return (
    <div className="panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <div className="panel-title">
          <Cpu style={{ width: '16px', height: '16px', color: '#f59e0b' }} />
          <span>USB CONTENT ANALYSIS</span>
        </div>
        <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#f59e0b' }}>
          ENGINE v1.0
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
        
        <div style={{ background: 'var(--bg-panel)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>FILES ANALYZED</div>
          <div className="mono" style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff' }}>
            {connected ? scan?.total_files ?? 0 : 0}
          </div>
        </div>

        <div style={{ background: executables > 0 ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-panel)', padding: '10px', borderRadius: '6px', border: `1px solid ${executables > 0 ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-subtle)'}` }}>
          <div style={{ fontSize: '10px', color: executables > 0 ? '#ef4444' : 'var(--text-muted)', textTransform: 'uppercase' }}>EXECUTABLES</div>
          <div className="mono" style={{ fontSize: '15px', fontWeight: '700', color: executables > 0 ? '#ef4444' : '#ffffff' }}>
            {connected ? executables : 0}
          </div>
        </div>

        <div style={{ background: scripts > 0 ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-panel)', padding: '10px', borderRadius: '6px', border: `1px solid ${scripts > 0 ? 'rgba(245, 158, 11, 0.3)' : 'var(--border-subtle)'}` }}>
          <div style={{ fontSize: '10px', color: scripts > 0 ? '#f59e0b' : 'var(--text-muted)', textTransform: 'uppercase' }}>SCRIPTS</div>
          <div className="mono" style={{ fontSize: '15px', fontWeight: '700', color: scripts > 0 ? '#f59e0b' : '#ffffff' }}>
            {connected ? scripts : 0}
          </div>
        </div>

        <div style={{ background: 'var(--bg-panel)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ARCHIVES</div>
          <div className="mono" style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff' }}>
            {connected ? archives : 0}
          </div>
        </div>

        <div style={{ background: 'var(--bg-panel)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>HIDDEN FILES</div>
          <div className="mono" style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff' }}>
            {connected ? hidden : 0}
          </div>
        </div>

        <div style={{ background: newFiles > 0 ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-panel)', padding: '10px', borderRadius: '6px', border: `1px solid ${newFiles > 0 ? 'rgba(59, 130, 246, 0.3)' : 'var(--border-subtle)'}` }}>
          <div style={{ fontSize: '10px', color: newFiles > 0 ? '#3b82f6' : 'var(--text-muted)', textTransform: 'uppercase' }}>NEW FILES</div>
          <div className="mono" style={{ fontSize: '15px', fontWeight: '700', color: newFiles > 0 ? '#3b82f6' : '#ffffff' }}>
            {connected ? newFiles : 0}
          </div>
        </div>

      </div>

      {/* Security Risk Score Meter */}
      <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '14px', borderRadius: '6px', border: '1px solid var(--border-subtle)', marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>SECURITY RISK SCORE</span>
          <span className="mono" style={{ fontSize: '14px', fontWeight: '700', color: score >= 4 ? '#ef4444' : score > 0 ? '#f59e0b' : '#10b981' }}>
            {score} / 10 ({riskLevel})
          </span>
        </div>
        
        <div style={{ width: '100%', height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{
            width: `${Math.min(100, (score / 10) * 100)}%`,
            height: '100%',
            background: score >= 4 ? '#ef4444' : score > 0 ? '#f59e0b' : '#10b981',
            borderRadius: '3px',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
        <span>Risk Indicators: <strong>{indicatorsCount}</strong></span>
        <span>Trust Classification: <strong style={{ color: trust === 'SAFE' ? '#10b981' : trust === 'UNTRUSTED' ? '#ef4444' : 'inherit' }}>{trust}</strong></span>
      </div>
    </div>
  );
}
