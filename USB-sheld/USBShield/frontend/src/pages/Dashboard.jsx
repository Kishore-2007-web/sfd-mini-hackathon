import React, { useEffect, useState, useRef } from 'react';
import Header from '../components/Header';
import USBStatusCard from '../components/USBStatusCard';
import AlertPanel from '../components/AlertPanel';
import DeviceCard from '../components/DeviceCard';
import RiskAnalysis from '../components/RiskAnalysis';
import AIMLPanel from '../components/AIMLPanel';
import ScanPipeline from '../components/ScanPipeline';
import FileTable from '../components/FileTable';
import EventTimeline from '../components/EventTimeline';
import ScanHistory from '../components/ScanHistory';

import { fetchStatus, fetchEvents, triggerScan, setDemoMode } from '../services/api';

export default function Dashboard() {
  const [statusData, setStatusData] = useState(null);
  const [events, setEvents] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [demoMode, setDemoModeState] = useState('none');
  
  const isInitialMount = useRef(true);

  // Poll status and events every 2 seconds
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
    } catch (err) {
      console.error("Poll status error:", err);
      setIsOnline(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleManualScan = async () => {
    setIsScanning(true);
    try {
      await triggerScan();
      // Brief 1.2 second scanning animation feel
      setTimeout(async () => {
        await loadData();
        setIsScanning(false);
      }, 1200);
    } catch (err) {
      console.error("Manual scan error:", err);
      setIsScanning(false);
    }
  };

  const handleToggleDemo = async (newMode) => {
    setDemoModeState(newMode);
    try {
      await setDemoMode(newMode);
      await loadData();
    } catch (err) {
      console.error("Toggle demo error:", err);
    }
  };

  const scrollToFiles = () => {
    const elem = document.getElementById('files-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ paddingBottom: '40px' }}>
      <Header
        isOnline={isOnline}
        isScanning={isScanning}
        onManualScan={handleManualScan}
        demoMode={demoMode}
        onToggleDemo={handleToggleDemo}
      />

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* 1. Main USB Status Card */}
        <div style={{ marginBottom: '20px' }}>
          <USBStatusCard statusData={statusData} isScanning={isScanning} />
        </div>

        {/* 2. Security Alert Panel (if content detected) */}
        <AlertPanel
          statusData={statusData}
          onScrollToFiles={scrollToFiles}
          onManualScan={handleManualScan}
          isScanning={isScanning}
        />

        {/* 3. Scan Pipeline */}
        <ScanPipeline
          isScanning={isScanning}
          connected={statusData?.connected}
          trust={statusData?.risk?.trust}
        />

        {/* 4. Top Grid: Device Profile, Risk Analysis & AI/ML Layer */}
        <div className="dashboard-grid-3col" style={{ marginBottom: '20px' }}>
          <DeviceCard statusData={statusData} />
          <RiskAnalysis statusData={statusData} />
          <AIMLPanel />
        </div>

        {/* 5. Middle Section: Detected Files Table */}
        <div style={{ marginBottom: '20px' }}>
          <FileTable
            files={statusData?.scan?.files || []}
            connected={statusData?.connected}
          />
        </div>

        {/* 6. Bottom Grid: Security Event Timeline & Scan History */}
        <div className="dashboard-grid-2col">
          <EventTimeline events={events} />
          <ScanHistory currentScan={statusData} />
        </div>

      </main>
    </div>
  );
}
