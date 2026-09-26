import React, { useEffect, useState, useRef } from 'react';
import Header from '../components/Header';
import MainScanner from '../components/MainScanner';
import DetailsPanel from '../components/DetailsPanel';
import Footer from '../components/Footer';

import { fetchStatus, fetchEvents, triggerScan, setDemoMode } from '../services/api';

export default function Dashboard() {
  const [statusData, setStatusData] = useState(null);
  const [events, setEvents] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [demoMode, setDemoModeState] = useState('none');

  // State machine: 'IDLE', 'DETECTING', 'SCANNING', 'ANALYZING', 'RESULT', 'ERROR'
  const [scanState, setScanState] = useState('IDLE');
  const [scanStage, setScanStage] = useState(0);

  const prevConnectedRef = useRef(false);
  const scanningTimerRef = useRef(null);

  // Trigger 1.2-1.5s visual scanning sequence
  const runScanningSequence = (onComplete) => {
    setScanState('DETECTING');
    setScanStage(1);

    if (scanningTimerRef.current) clearTimeout(scanningTimerRef.current);

    setTimeout(() => {
      setScanState('SCANNING');
      setScanStage(2);
    }, 400);

    setTimeout(() => {
      setScanState('ANALYZING');
      setScanStage(3);
    }, 800);

    scanningTimerRef.current = setTimeout(() => {
      setScanState('RESULT');
      setScanStage(4);
      if (onComplete) onComplete();
    }, 1300);
  };

  const loadData = async () => {
    try {
      const data = await fetchStatus();
      setStatusData(data);
      setIsOnline(true);
      if (data.demo_mode) {
        setDemoModeState(data.demo_mode);
      }

      const evtData = await fetchEvents();
      if (evtData && evtData.events) {
        setEvents(evtData.events);
      }

      const isConnected = data.connected;

      // USB Insertion Detection: Transition from disconnected to connected
      if (isConnected && !prevConnectedRef.current) {
        prevConnectedRef.current = true;
        runScanningSequence();
      } else if (!isConnected) {
        prevConnectedRef.current = false;
        setScanState('IDLE');
        setScanStage(0);
      } else if (scanState === 'IDLE' && isConnected) {
        // Fallback for initial load when USB is already plugged in
        prevConnectedRef.current = true;
        runScanningSequence();
      }
    } catch (err) {
      console.error("Poll status error:", err);
      setIsOnline(false);
      setScanState('ERROR');
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 1500);
    return () => {
      clearInterval(interval);
      if (scanningTimerRef.current) clearTimeout(scanningTimerRef.current);
    };
  }, []);

  const handleManualScan = async () => {
    runScanningSequence(async () => {
      try {
        await triggerScan();
        await loadData();
      } catch (e) {}
    });
  };

  const handleToggleDemo = async (newMode) => {
    setDemoModeState(newMode);
    runScanningSequence(async () => {
      try {
        await setDemoMode(newMode);
        await loadData();
      } catch (e) {}
    });
  };

  const isScanning = scanState === 'DETECTING' || scanState === 'SCANNING' || scanState === 'ANALYZING';

  return (
    <div className="utility-window">
      {/* Header Bar */}
      <Header isOnline={isOnline} isScanning={isScanning} />

      {/* Core Scanning & Result View */}
      <MainScanner
        scanState={scanState}
        scanStage={scanStage}
        statusData={statusData}
        showDetails={showDetails}
        onToggleDetails={() => setShowDetails(!showDetails)}
        onManualScan={handleManualScan}
      />

      {/* Expandable Details Section */}
      {showDetails && statusData?.connected && (
        <DetailsPanel statusData={statusData} events={events} />
      )}

      {/* Minimal Footer Bar */}
      <Footer demoMode={demoMode} onToggleDemo={handleToggleDemo} />
    </div>
  );
}
