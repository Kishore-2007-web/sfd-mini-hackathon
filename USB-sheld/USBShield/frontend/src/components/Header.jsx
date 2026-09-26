import React from 'react';
import { Shield } from 'lucide-react';

export default function Header({ isOnline, isScanning }) {
  return (
    <header className="utility-header">
      <div className="brand-title">
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '6px',
          background: 'rgba(56, 189, 248, 0.1)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Shield style={{ width: '16px', height: '16px', color: '#38bdf8' }} />
        </div>
        <div>
          <h1>USBShield</h1>
        </div>
        <span>USB SECURITY</span>
      </div>

      <div className="status-indicator">
        <span className={`pulse-dot ${isOnline ? (isScanning ? 'scanning' : 'online') : 'offline'}`} />
        <span>
          {isOnline ? (isScanning ? 'SCANNING ACTIVE' : 'MONITORING ACTIVE') : 'AGENT OFFLINE'}
        </span>
      </div>
    </header>
  );
}
