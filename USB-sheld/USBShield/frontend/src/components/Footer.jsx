import React from 'react';
import { Zap } from 'lucide-react';

export default function Footer({ demoMode, onToggleDemo }) {
  return (
    <footer className="utility-footer">
      <div>
        <span>USBShield Risk Engine v1.0 • Rule-based prototype • AI/ML expansion ready</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Zap style={{ width: '12px', height: '12px', color: '#f59e0b' }} />
        <select 
          className="demo-selector" 
          value={demoMode} 
          onChange={(e) => onToggleDemo(e.target.value)}
        >
          <option value="none" style={{ background: '#0d111a' }}>REAL USB (DEFAULT)</option>
          <option value="simulate_empty" style={{ background: '#0d111a' }}>DEMO: SIMULATE EMPTY USB</option>
          <option value="simulate_filed" style={{ background: '#0d111a' }}>DEMO: SIMULATE FILED USB</option>
        </select>
      </div>
    </footer>
  );
}
