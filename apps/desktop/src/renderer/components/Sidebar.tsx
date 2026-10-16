/**
 * apps/desktop/src/renderer/components/Sidebar.tsx
 * 
 * Tactical navigation sidebar with club indicators telemetry.
 */

import React from 'react';
import { useApp } from '../state/AppContext';
import { LayoutDashboard, Users, MessageSquareText, Sliders, Shield } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, t, indicators } = useApp();

  const navItems = [
    { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { id: 'squad', label: t.nav.squad, icon: Users },
    { id: 'staff', label: t.nav.staff, icon: MessageSquareText },
    { id: 'settings', label: t.nav.settings, icon: Sliders },
  ] as const;

  return (
    <aside
      style={{
        width: '240px',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'var(--bg-2)',
        padding: '20px 14px',
        flexShrink: 0,
      }}
    >
      <div>
        {/* Brand header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 8px 24px 8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--bg-3) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px var(--accent-soft)',
            }}
          >
            <Shield size={18} color="var(--accent-ink)" />
          </div>
          <div>
            <h1 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em', margin: 0 }}>
              Career AI Tracker
            </h1>
            <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 500 }}>
              FIFA 16 Companion
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--r-input)',
                  border: isActive ? '1px solid var(--border-strong)' : '1px solid transparent',
                  background: isActive ? 'var(--accent-soft)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
              >
                <Icon size={18} color={isActive ? 'var(--accent)' : 'var(--text-dim)'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Club Indicators telemetry widget */}
      <div
        className="glass-panel"
        style={{
          padding: '14px',
          background: 'rgba(5, 18, 26, 0.7)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {t.indicators.title}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
          {/* Team Morale */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-muted)' }}>{t.indicators.morale}</span>
              <span style={{ fontWeight: 600, color: 'var(--text)' }}>{indicators.team_morale}%</span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${indicators.team_morale}%`,
                  background: 'var(--accent)',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>

          {/* Media Pressure */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-muted)' }}>{t.indicators.media}</span>
              <span style={{ fontWeight: 600, color: 'var(--text)' }}>{indicators.media_pressure}%</span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${indicators.media_pressure}%`,
                  background: indicators.media_pressure > 70 ? 'var(--danger)' : 'var(--warning)',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>

          {/* Board Confidence */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-muted)' }}>{t.indicators.board}</span>
              <span style={{ fontWeight: 600, color: 'var(--text)' }}>{indicators.board_confidence}%</span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${indicators.board_confidence}%`,
                  background: indicators.board_confidence < 40 ? 'var(--danger)' : 'var(--accent)',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '10px', lineHeight: 1.3 }}>
          *{t.indicators.disclaimer}
        </p>
      </div>
    </aside>
  );
};
