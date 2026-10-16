/**
 * apps/desktop/src/renderer/components/Topbar.tsx
 * 
 * Top bar displaying sync state, game simulated date, and About modal trigger.
 * Note: Never displays "Live" badge, never displays real-world clock.
 */

import React from 'react';
import { useApp } from '../state/AppContext';
import { RefreshCw, Info, Database, AlertCircle } from 'lucide-react';

export const Topbar: React.FC = () => {
  const { data, loading, refreshData, t, lang, setAboutOpen, setDiagnosticsOpen } = useApp();

  const simulatedDate = data?.state?.fecha_simulada || (data?.matches && data.matches.length > 0 ? data.matches[0].fecha_simulada : '2025-01-01');
  const isDemo = data?.diagnostics?.isDemoMode ?? true;
  const warningsCount = data?.diagnostics?.warnings?.length ?? 0;

  return (
    <header
      style={{
        height: '56px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        backgroundColor: 'rgba(5, 18, 26, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 50,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent)',
              boxShadow: '0 0 8px var(--accent)',
            }}
          />
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>
            {t.syncedStatus}{' '}
            <strong style={{ color: 'var(--text)' }}>
              {isDemo ? t.demoModeNotice : t.liveDataNotice}
            </strong>
          </span>
        </div>

        {warningsCount > 0 && (
          <button
            onClick={() => setDiagnosticsOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 183, 77, 0.15)',
              color: 'var(--warning)',
              border: '1px solid rgba(255, 183, 77, 0.3)',
              borderRadius: 'var(--r-pill)',
              padding: '2px 10px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="View reader diagnostic warnings"
          >
            <AlertCircle size={12} />
            <span>{warningsCount} warning{warningsCount > 1 ? 's' : ''}</span>
          </button>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* In-game simulated calendar date */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--surface-solid)',
            padding: '4px 14px',
            borderRadius: 'var(--r-pill)',
            border: '1px solid var(--border)',
          }}
        >
          <Database size={13} color="var(--accent)" />
          <span style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {lang === 'en' ? 'Game Date' : 'Fecha Juego'}
          </span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
            {simulatedDate}
          </span>
        </div>

        {/* Reload button */}
        <button
          onClick={refreshData}
          disabled={loading}
          style={{
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-pill)',
            padding: '6px 12px',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
          title={t.reload}
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          <span>{t.reload}</span>
        </button>

        {/* About trigger */}
        <button
          onClick={() => setAboutOpen(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '6px',
            borderRadius: '50%',
          }}
          title={t.about}
        >
          <Info size={17} />
        </button>
      </div>
    </header>
  );
};
