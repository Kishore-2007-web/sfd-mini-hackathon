import React, { useEffect, useState } from 'react';
import { Clock, HardDrive, ShieldCheck, ShieldAlert, Trash2 } from 'lucide-react';

export default function ScanHistory({ currentScan }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('usbshield_scan_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to read scan history", e);
    }
  }, []);

  // Update history when a scan completes on a connected drive
  useEffect(() => {
    if (!currentScan || !currentScan.connected || !currentScan.device) return;

    const device = currentScan.device;
    const risk = currentScan.risk;
    const timestamp = currentScan.timestamp;

    const newEntry = {
      id: `${device.drive}-${timestamp}`,
      time: timestamp,
      label: device.label,
      drive: device.drive,
      trust: risk?.trust || 'UNKNOWN',
      fileCount: device.file_count || 0
    };

    setHistory((prev) => {
      // Avoid duplicate consecutive entries with identical timestamp
      if (prev.length > 0 && prev[0].time === newEntry.time && prev[0].drive === newEntry.drive) {
        return prev;
      }
      const updated = [newEntry, ...prev].slice(0, 10);
      try {
        localStorage.setItem('usbshield_scan_history', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, [currentScan]);

  const clearHistory = () => {
    localStorage.removeItem('usbshield_scan_history');
    setHistory([]);
  };

  return (
    <div className="panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <div className="panel-title">
          <Clock style={{ width: '16px', height: '16px', color: '#818cf8' }} />
          <span>LOCAL SCAN HISTORY ({history.length})</span>
        </div>
        {history.length > 0 && (
          <button 
            onClick={clearHistory} 
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
          >
            <Trash2 style={{ width: '12px', height: '12px' }} /> CLEAR
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
          <p>No historical scan records stored locally.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '350px', overflowY: 'auto' }}>
          {history.map((item) => (
            <div key={item.id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-panel)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '8px 12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {item.trust === 'SAFE' ? (
                  <ShieldCheck style={{ width: '16px', height: '16px', color: '#10b981' }} />
                ) : (
                  <ShieldAlert style={{ width: '16px', height: '16px', color: '#ef4444' }} />
                )}
                <div>
                  <div style={{ fontWeight: '600', fontSize: '12px', color: '#ffffff' }}>
                    {item.label} ({item.drive})
                  </div>
                  <div className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {item.time}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className={`badge ${item.trust === 'SAFE' ? 'badge-safe' : 'badge-untrusted'}`}>
                  {item.trust}
                </span>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {item.fileCount} files
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
