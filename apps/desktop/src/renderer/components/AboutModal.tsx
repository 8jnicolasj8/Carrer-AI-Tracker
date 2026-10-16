/**
 * apps/desktop/src/renderer/components/AboutModal.tsx
 * 
 * About & Privacy Guarantee Modal.
 */

import React from 'react';
import { useApp } from '../state/AppContext';
import { Shield, X, CheckCircle2 } from 'lucide-react';

export const AboutModal: React.FC = () => {
  const { aboutOpen, setAboutOpen, t } = useApp();

  if (!aboutOpen) return null;

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
      onClick={() => setAboutOpen(false)}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '28px',
          background: 'rgba(7, 28, 38, 0.95)',
          border: '1px solid var(--border-strong)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--bg-3) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Shield size={20} color="var(--accent-ink)" />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
                {t.aboutModal.title}
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--accent)' }}>
                {t.aboutModal.version}
              </span>
            </div>
          </div>
          <button
            onClick={() => setAboutOpen(false)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px', lineHeight: 1.5, color: 'var(--text-muted)' }}>
          <div style={{ background: 'var(--surface-solid)', padding: '14px', borderRadius: 'var(--r-card)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontWeight: 700, marginBottom: '6px' }}>
              <CheckCircle2 size={16} />
              <span>{t.aboutModal.guaranteeTitle}</span>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text)' }}>
              {t.aboutModal.guaranteeBody}
            </p>
          </div>

          <div style={{ fontSize: '12px' }}>
            <strong>{t.aboutModal.license}</strong>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-dim)' }}>
              Copyright © 2026 Career AI Tracker Contributors. Free and open source software.
            </p>
          </div>

          <p style={{ fontSize: '11px', color: 'var(--text-dim)', margin: 0, fontStyle: 'italic', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
            {t.aboutModal.disclaimer}
          </p>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button onClick={() => setAboutOpen(false)} className="btn-primary">
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
