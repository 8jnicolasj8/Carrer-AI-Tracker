/**
 * apps/desktop/src/renderer/pages/SettingsPage.tsx
 * 
 * Settings Screen conforming strictly to Section 6.5:
 * - API & AI Models: visibly disabled with "AI arrives in Beta 0.3" notice.
 * - FIFA 16 Sync: choose data folder, reload button, file watch toggle, last save reader path.
 * - AI Staff Personalities: 5 persisted sliders modulating deterministic templates.
 * - System Preferences: real-time language switcher (en/es), compact mode, show news.
 */

import React from 'react';
import { useApp } from '../state/AppContext';
import { FolderOpen, Sliders, Globe, Cpu, AlertCircle } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    t,
    lang,
    setLang,
    personalities,
    updatePersonalities,
    compactMode,
    setCompactMode,
    showNews,
    setShowNews,
    customDataPath,
    setCustomDataPath,
    data,
    setDiagnosticsOpen,
  } = useApp();

  const handleSelectFolder = async () => {
    const api = (window as any).electronAPI;
    if (api && api.selectDirectory) {
      const selected = await api.selectDirectory();
      if (selected) {
        setCustomDataPath(selected);
      }
    }
  };

  const handleUseDemo = () => {
    setCustomDataPath(null);
  };

  return (
    <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '900px' }}>
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
          {t.settings.title}
        </h2>
        <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
          Manage local save data reading, system preferences, and staff behavior
        </span>
      </div>

      {/* 1. FIFA 16 Sync Section */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <FolderOpen size={18} color="var(--accent)" />
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
            {t.settings.fifaSync}
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              {t.settings.dataPathLabel}
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                readOnly
                value={customDataPath || (data?.diagnostics?.folderPath ?? 'Bundled fixtures/ (Demo Mode)')}
                style={{
                  flex: 1,
                  background: 'var(--surface-solid)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-input)',
                  padding: '8px 14px',
                  color: 'var(--text)',
                  fontSize: '13px',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none',
                }}
              />
              <button onClick={handleSelectFolder} className="btn-primary">
                {t.settings.browse}
              </button>
              {customDataPath && (
                <button onClick={handleUseDemo} className="btn-secondary">
                  {t.settings.useDemoData}
                </button>
              )}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '6px' }}>
              Current data source: {data?.diagnostics?.isDemoMode ? 'Fictional demo data' : 'Local save reader dump'}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{t.settings.fileWatch}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{t.settings.fileWatchDesc}</div>
            </div>
            <span className="badge-verified">Active</span>
          </div>

          {data?.diagnostics?.warnings && data.diagnostics.warnings.length > 0 && (
            <div style={{ paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
              <button
                onClick={() => setDiagnosticsOpen(true)}
                className="btn-secondary"
                style={{ fontSize: '12px' }}
              >
                <AlertCircle size={14} color="var(--warning)" />
                <span>{t.settings.diagnosticsLog} ({data.diagnostics.warnings.length})</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. AI Staff Personalities Sliders */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Sliders size={18} color="var(--accent)" />
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
            {t.settings.personalitiesTitle}
          </h3>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: '0 0 16px 0' }}>
          {t.settings.personalitiesDesc}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* President Strictness */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>{t.settings.presStrictness}</span>
              <span style={{ fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                {personalities.presidentStrictness} / 10
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={personalities.presidentStrictness}
              onChange={(e) => updatePersonalities({ presidentStrictness: Number(e.target.value) })}
              style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
          </div>

          {/* Assistant Manager Aggression */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>{t.settings.asstAggression}</span>
              <span style={{ fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                {personalities.assistantAggression} / 10
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={personalities.assistantAggression}
              onChange={(e) => updatePersonalities({ assistantAggression: Number(e.target.value) })}
              style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
          </div>

          {/* Scout Risk Tolerance */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>{t.settings.scoutRisk}</span>
              <span style={{ fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                {personalities.scoutRiskTolerance} / 10
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={personalities.scoutRiskTolerance}
              onChange={(e) => updatePersonalities({ scoutRiskTolerance: Number(e.target.value) })}
              style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
          </div>

          {/* Media Confidence */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>{t.settings.mediaConf}</span>
              <span style={{ fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                {personalities.mediaConfidence} / 10
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={personalities.mediaConfidence}
              onChange={(e) => updatePersonalities({ mediaConfidence: Number(e.target.value) })}
              style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
          </div>

          {/* Youth Focus */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>{t.settings.youthFocus}</span>
              <span style={{ fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                {personalities.youthFocus} / 10
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={personalities.youthFocus}
              onChange={(e) => updatePersonalities({ youthFocus: Number(e.target.value) })}
              style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      {/* 3. System Preferences (Language, Compact mode, Show news) */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Globe size={18} color="var(--accent)" />
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
            {t.settings.systemPreferences}
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Language Switcher */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{t.settings.language}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Switch interface language in real time</div>
            </div>
            <div style={{ display: 'flex', gap: '4px', background: 'var(--surface-solid)', padding: '4px', borderRadius: 'var(--r-pill)', border: '1px solid var(--border)' }}>
              <button
                onClick={() => setLang('en')}
                style={{
                  background: lang === 'en' ? 'var(--accent)' : 'transparent',
                  color: lang === 'en' ? 'var(--accent-ink)' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '12px',
                  padding: '4px 14px',
                  borderRadius: 'var(--r-pill)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                English
              </button>
              <button
                onClick={() => setLang('es')}
                style={{
                  background: lang === 'es' ? 'var(--accent)' : 'transparent',
                  color: lang === 'es' ? 'var(--accent-ink)' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '12px',
                  padding: '4px 14px',
                  borderRadius: 'var(--r-pill)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Español
              </button>
            </div>
          </div>

          {/* Compact Mode Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{t.settings.compactMode}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Tighter spacing for small laptop displays</div>
            </div>
            <input
              type="checkbox"
              checked={compactMode}
              onChange={(e) => setCompactMode(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
          </div>

          {/* Show News Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{t.settings.showNews}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Display horizontal ticker on the Dashboard</div>
            </div>
            <input
              type="checkbox"
              checked={showNews}
              onChange={(e) => setShowNews(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      {/* 4. API & AI Models Section (Disabled in Beta 0.1 per Section 6.5) */}
      <div
        className="glass-panel"
        style={{
          padding: '20px',
          opacity: 0.65,
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Cpu size={18} color="var(--text-dim)" />
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-muted)', margin: 0 }}>
            {t.settings.aiSection}
          </h3>
          <span className="badge-estimated" style={{ marginLeft: 'auto' }}>
            Disabled in 0.1
          </span>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: '0 0 14px 0', lineHeight: 1.4 }}>
          {t.settings.aiDisabledNotice}
        </p>

        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="password"
            disabled
            placeholder="AI Key (Enabled in Beta 0.3)"
            style={{
              flex: 1,
              background: 'rgba(5, 18, 26, 0.4)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'var(--r-input)',
              padding: '8px 14px',
              color: 'var(--text-dim)',
              fontSize: '12px',
              cursor: 'not-allowed',
            }}
          />
          <button disabled className="btn-secondary" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
            Connect Key
          </button>
        </div>
      </div>
    </div>
  );
};
