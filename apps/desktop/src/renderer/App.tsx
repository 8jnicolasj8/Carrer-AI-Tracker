/**
 * apps/desktop/src/renderer/App.tsx
 * 
 * Main Application Shell and layout coordinator.
 */

import React, { useEffect } from 'react';
import { useApp } from './state/AppContext';
import { Topbar } from './components/Topbar';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { SquadPage } from './pages/SquadPage';
import { StaffPage } from './pages/StaffPage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutModal } from './components/AboutModal';
import { DiagnosticsModal } from './components/DiagnosticsModal';

export const App: React.FC = () => {
  const { activeTab, setActiveTab, compactMode } = useApp();

  // Apply compact mode class to body
  useEffect(() => {
    if (compactMode) {
      document.body.classList.add('compact-mode');
    } else {
      document.body.classList.remove('compact-mode');
    }
  }, [compactMode]);

  // Keyboard navigation shortcuts: Alt+1, Alt+2, Alt+3, Alt+4
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        if (e.key === '1') setActiveTab('dashboard');
        if (e.key === '2') setActiveTab('squad');
        if (e.key === '3') setActiveTab('staff');
        if (e.key === '4') setActiveTab('settings');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTab]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: 'var(--bg)',
      }}
    >
      <Topbar />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />

        <main
          style={{
            flex: 1,
            height: '100%',
            overflowY: 'auto',
            position: 'relative',
            backgroundColor: 'var(--bg)',
          }}
        >
          {activeTab === 'dashboard' && <DashboardPage />}
          {activeTab === 'squad' && <SquadPage />}
          {activeTab === 'staff' && <StaffPage />}
          {activeTab === 'settings' && <SettingsPage />}
        </main>
      </div>

      <AboutModal />
      <DiagnosticsModal />
    </div>
  );
};
