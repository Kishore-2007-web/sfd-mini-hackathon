import React from 'react';
import { Shield, Radio, RefreshCw, Monitor, Zap } from 'lucide-react';

export default function Header({ isOnline, isScanning, onManualScan, demoMode, onToggleDemo }) {
  return (
    <header className="panel" style={{ borderRadius: '0 0 12px 12px', borderTop: 'none', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
          }}>
            <Shield style={{ width: '22px', height: '22px', color: '#38bdf8' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.02em', color: '#f8fafc' }}>
                USBShield
              </h1>
              <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8' }}>
                MVP v1.0
              </span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              AI-Based USB Security Monitor & Trust Screener
            </p>
          </div>
        </div>

        {/* System Status Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span className={`pulse-dot ${isOnline ? (isScanning ? 'scanning' : 'online') : 'offline'}`} />
            <span style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {isOnline ? (isScanning ? 'SCANNING...' : 'SYSTEM ONLINE') : 'BACKEND OFFLINE'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <Monitor style={{ width: '14px', height: '14px' }} />
            <span>WINDOWS 11</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <Radio style={{ width: '14px', height: '14px', color: '#10b981' }} />
            <span>REAL-TIME MONITORING (2s)</span>
          </div>

          {/* Demo Mode selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.03)', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <Zap style={{ width: '13px', height: '13px', color: '#f59e0b' }} />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>DEMO:</span>
            <select 
              value={demoMode} 
              onChange={(e) => onToggleDemo(e.target.value)}
              style={{
                background: 'transparent',
                color: 'var(--text-secondary)',
                border: 'none',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="none" style={{ background: '#0e1117' }}>REAL USB (DEFAULT)</option>
              <option value="simulate_empty" style={{ background: '#0e1117' }}>SIMULATE EMPTY USB</option>
              <option value="simulate_filed" style={{ background: '#0e1117' }}>SIMULATE FILED USB</option>
            </select>
          </div>

          {/* Action button */}
          <button 
            className="btn btn-primary" 
            onClick={onManualScan}
            disabled={isScanning}
          >
            <RefreshCw style={{ width: '14px', height: '14px', animation: isScanning ? 'spin 1s linear infinite' : 'none' }} />
            <span>{isScanning ? 'SCANNING...' : 'SCAN USB'}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
