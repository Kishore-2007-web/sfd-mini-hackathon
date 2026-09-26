import React from 'react';
import { Cpu, CheckCircle2, Circle, AlertCircle, Sparkles } from 'lucide-react';

export default function AIMLPanel() {
  return (
    <div className="panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <div className="panel-title">
          <Sparkles style={{ width: '16px', height: '16px', color: '#a855f7' }} />
          <span>AI / ML SECURITY LAYER</span>
        </div>
        <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', color: '#c084fc' }}>
          ARCHITECTURE ROADMAP
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-panel)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '12px', fontWeight: '500', color: '#f8fafc' }}>Rule-Based Risk Engine</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#10b981', fontWeight: '600' }}>
            <CheckCircle2 style={{ width: '13px', height: '13px' }} /> ACTIVE
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-panel)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '12px', fontWeight: '500', color: '#f8fafc' }}>Filesystem Activity Monitor</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#10b981', fontWeight: '600' }}>
            <CheckCircle2 style={{ width: '13px', height: '13px' }} /> BASIC ACTIVE
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ML File Classifier</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <Circle style={{ width: '12px', height: '12px' }} /> PLANNED
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Isolated Sandbox Analysis</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <Circle style={{ width: '12px', height: '12px' }} /> PLANNED
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Threat Reputation Lookup</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <Circle style={{ width: '12px', height: '12px' }} /> PLANNED
          </span>
        </div>

      </div>

      <div style={{ background: 'rgba(168, 85, 247, 0.05)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(168, 85, 247, 0.15)', fontSize: '11px', color: 'var(--text-secondary)' }}>
        <p><strong>Note:</strong> Current prototype uses transparent, explainable rule-based analysis. ML models and sandbox integration are architected for Phase 2 implementation.</p>
      </div>
    </div>
  );
}
