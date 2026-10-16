/**
 * apps/desktop/src/renderer/components/DiagnosticsModal.tsx
 * 
 * Diagnostic warnings modal displaying skipped lines and file status.
 */

import React from 'react';
import { useApp } from '../state/AppContext';
import { AlertCircle, X, CheckCircle } from 'lucide-react';

export const DiagnosticsModal: React.FC = () => {
  const { diagnosticsOpen, setDiagnosticsOpen, data, t } = useApp();

  if (!diagnosticsOpen) return null;

  const warnings = data?.diagnostics?.warnings || [];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '20px',
      }}
      onClick={() => setDiagnosticsOpen(false)}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
          background: 'rgba(7, 28, 38, 0.95)',
          border: '1px solid var(--border-strong)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} color="var(--warning)" />
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
              Reader Diagnostics & Warnings
            </h3>
          </div>
          <button
            onClick={() => setDiagnosticsOpen(false)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
          {warnings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              <CheckCircle size={32} color="var(--accent)" style={{ margin: '0 auto 10px auto' }} />
              <div style={{ fontWeight: 600 }}>All files parsed cleanly.</div>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Zero syntax or serialization errors.</div>
            </div>
          ) : (
            warnings.map((w, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--surface-solid)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-sm)',
                  padding: '10px 14px',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--warning)',
                  lineHeight: 1.4,
                }}
              >
                {w}
              </div>
            ))
          )}
        </div>

        <div style={{ marginTop: '16px', textAlign: 'right', borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
          <button onClick={() => setDiagnosticsOpen(false)} className="btn-secondary">
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
