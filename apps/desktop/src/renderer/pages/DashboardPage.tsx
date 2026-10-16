/**
 * apps/desktop/src/renderer/pages/DashboardPage.tsx
 * 
 * Dashboard Screen conforming strictly to Section 6.2:
 * - Club header with generic SVG crest, record tile, transfer budget with delta. No "Position".
 * - Next match card ONLY if preview news exists, otherwise hidden.
 * - News ticker with pause on hover.
 * - Match feed with expandable minutes and substitutions, reliable scorers, multi-match totals.
 * - Quick stats with squad count. No injury counters.
 */

import React, { useState } from 'react';
import { useApp } from '../state/AppContext';
import { assessMatchConfidence } from '../../engine/confidence';
import { NewsItem } from '../../contracts';
import { ChevronDown, ChevronUp, Calendar, AlertTriangle, TrendingUp, Users } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { data, t, lang, showNews } = useApp();
  const [expandedMatchIndex, setExpandedMatchIndex] = useState<number | null>(null);
  const [isTickerPaused, setIsTickerPaused] = useState<boolean>(false);

  const clubName = data?.state?.carrera?.club || data?.squad?.club?.nombre || 'Solaria FC';
  const managerName = data?.state?.carrera?.manager || 'Alex Vance';
  const budget = data?.state?.presupuesto_fichajes ?? (data?.matches && data.matches[0]?.presupuesto_fichajes) ?? 24822800;
  const squadCount = data?.squad?.jugadores?.length ?? 16;
  const matches = data?.matches || [];
  const news = data?.news || [];

  // Calculate budget delta if previous match has budget
  let budgetDelta = 0;
  if (matches.length >= 2 && matches[0].presupuesto_fichajes && matches[1].presupuesto_fichajes) {
    budgetDelta = matches[0].presupuesto_fichajes - matches[1].presupuesto_fichajes;
  }

  // Club record from state or derived from matches
  const record = data?.state?.registro || {
    pj: matches.length,
    g: matches.filter((m) => m.resultado === 'G').length,
    e: matches.filter((m) => m.resultado === 'E').length,
    p: matches.filter((m) => m.resultado === 'P').length,
    gf: matches.reduce((acc, m) => acc + (m.goles_club ?? m.goles_boca ?? 0), 0),
    gc: matches.reduce((acc, m) => acc + m.goles_rival, 0),
    pts: matches.filter((m) => m.resultado === 'G').length * 3 + matches.filter((m) => m.resultado === 'E').length,
    alcance: 'liga' as const,
  };

  // Find next match preview in news (subtipo 'vista_previa' or title containing 'Avance')
  const previewNews: NewsItem | undefined = news.find(
    (n) => n.subtipo === 'vista_previa' || n.titulo.toLowerCase().includes('avance')
  );

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'es-ES', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px', overflowY: 'auto' }}>
      {/* 1. Club Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          background: 'linear-gradient(135deg, rgba(10,38,50,0.85) 0%, rgba(5,18,26,0.95) 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          {/* Generic SVG Crest with initials */}
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #0a2632 0%, #071c26 100%)',
              border: '2px solid var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px var(--accent-soft)',
            }}
          >
            <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent)', letterSpacing: '1px' }}>
              {clubName.slice(0, 2).toUpperCase()}
            </span>
          </div>

          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text)', margin: 0, letterSpacing: '-0.02em' }}>
              {clubName}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {managerName}
              </span>
              <span style={{ color: 'var(--text-dim)' }}>•</span>
              <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 600 }}>
                {data?.state?.carrera?.liga || 'Torneo Apertura'}
              </span>
            </div>
          </div>
        </div>

        {/* Telemetry tiles */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {/* Record Tile */}
          <div
            style={{
              background: 'var(--surface-solid)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-card)',
              padding: '12px 20px',
              minWidth: '220px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700 }}>
                {t.dashboard.clubRecord} ({record.alcance})
              </span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)' }}>
                {record.pts} PTS
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
                {record.pj} <small style={{ fontSize: '11px', color: 'var(--text-dim)' }}>PJ</small>
              </span>
              <span style={{ color: 'var(--text-dim)' }}>|</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--success)' }}>{record.g}W</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--warning)' }}>{record.e}D</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--danger)' }}>{record.p}L</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>
              GF: {record.gf} / GC: {record.gc} ({(record.gf - record.gc) >= 0 ? `+${record.gf - record.gc}` : record.gf - record.gc})
            </div>
          </div>

          {/* Transfer Budget Tile with Delta */}
          <div
            style={{
              background: 'var(--surface-solid)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-card)',
              padding: '12px 20px',
              minWidth: '200px',
            }}
          >
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700 }}>
              {t.dashboard.transferBudget}
            </span>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
              {formatCurrency(budget)}
            </div>
            {budgetDelta !== 0 && (
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: budgetDelta > 0 ? 'var(--success)' : 'var(--warning)',
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <TrendingUp size={12} />
                <span>
                  {budgetDelta > 0 ? `+${formatCurrency(budgetDelta)}` : formatCurrency(budgetDelta)} {t.dashboard.budgetDelta}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. News Ticker (Horizontal carousel with pause on hover) */}
      {showNews && news.length > 0 && (
        <div
          className="glass-panel"
          style={{
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            overflow: 'hidden',
          }}
          onMouseEnter={() => setIsTickerPaused(true)}
          onMouseLeave={() => setIsTickerPaused(false)}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--accent)',
              fontWeight: 700,
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              flexShrink: 0,
            }}
          >
            <Calendar size={13} />
            <span>{t.dashboard.newsTicker}:</span>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '30px',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              animation: isTickerPaused ? 'none' : 'ticker 30s linear infinite',
              scrollBehavior: 'smooth',
            }}
          >
            {news.slice(0, 10).map((item, idx) => (
              <span key={idx} style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--text)', marginRight: '6px' }}>[{item.categoria.toUpperCase()}]</strong>
                {item.titulo}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 3. Next Match (Only displayed if preview news exists per Section 5 & 6.2) */}
      {previewNews && (
        <div
          className="glass-panel"
          style={{
            padding: '18px 24px',
            background: 'linear-gradient(90deg, rgba(52,227,180,0.08) 0%, rgba(10,32,42,0.6) 100%)',
            borderLeft: '4px solid var(--accent)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge-verified">{t.dashboard.nextMatch}</span>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>
              {previewNews.titulo}
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
            {previewNews.cuerpo.slice(0, 240)}...
          </p>
          {previewNews.once_probable && (
            <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-dim)' }}>
              <strong style={{ color: 'var(--text-muted)' }}>Probable Lineup:</strong> {previewNews.once_probable}
            </div>
          )}
        </div>
      )}

      {/* 4. Main Body: Match Feed & Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
        {/* Match Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
              {t.dashboard.matchFeed}
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
              {matches.length} matches
            </span>
          </div>

          {matches.length === 0 ? (
            <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-dim)' }}>
              {t.dashboard.emptyMatches}
            </div>
          ) : (
            matches.map((match, idx) => {
              const confidence = assessMatchConfidence(match, lang);
              const isExpanded = expandedMatchIndex === idx;
              const isWin = match.resultado === 'G';
              const isDraw = match.resultado === 'E';
              const goalsClub = match.goles_club ?? match.goles_boca ?? 0;

              // Multi-match card handling per Section 4.2
              if (confidence.isMultiMatch) {
                return (
                  <div
                    key={idx}
                    className="glass-panel"
                    style={{
                      padding: '16px 20px',
                      borderLeft: '4px solid var(--warning)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="badge-estimated">{match.partidos_en_delta} Matches Delta</span>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                            {match.competicion?.nombre || 'Multiple Tournaments'}
                          </span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--warning)', marginTop: '4px', margin: 0 }}>
                          <AlertTriangle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                          {confidence.multiMatchNotice}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                          {goalsClub} - {match.goles_rival}
                        </span>
                        <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                          {match.fecha_juego}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // Normal single match card
              return (
                <div
                  key={idx}
                  className="glass-panel"
                  style={{
                    padding: '16px 20px',
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      {/* Result Pill */}
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '12px',
                          backgroundColor: isWin
                            ? 'rgba(52, 227, 180, 0.15)'
                            : isDraw
                            ? 'rgba(255, 183, 77, 0.15)'
                            : 'rgba(255, 82, 82, 0.15)',
                          color: isWin ? 'var(--success)' : isDraw ? 'var(--warning)' : 'var(--danger)',
                          border: `1px solid ${isWin ? 'rgba(52, 227, 180, 0.3)' : isDraw ? 'rgba(255, 183, 77, 0.3)' : 'rgba(255, 82, 82, 0.3)'}`,
                        }}
                      >
                        {match.resultado}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>
                            {match.local_visitante === 'local' ? `${clubName} vs ${match.rival_nombre}` : `${match.rival_nombre} vs ${clubName}`}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'capitalize' }}>
                            ({match.local_visitante === 'local' ? t.dashboard.home : t.dashboard.away})
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {match.competicion?.nombre || 'Friendly'}
                          </span>
                          {confidence.isCompetitionEstimated && (
                            <span className="badge-estimated" title={confidence.competitionTooltip}>
                              {t.dashboard.estimated}
                            </span>
                          )}
                          <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                            {match.fecha_juego}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>
                        {match.local_visitante === 'local' ? `${goalsClub} - ${match.goles_rival}` : `${match.goles_rival} - ${goalsClub}`}
                      </span>

                      <button
                        onClick={() => setExpandedMatchIndex(isExpanded ? null : idx)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-dim)',
                          cursor: 'pointer',
                          padding: '4px',
                        }}
                        aria-label="Toggle match details"
                      >
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Scorers info */}
                  <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    {confidence.scorersAvailable && match.goleadores && match.goleadores.length > 0 ? (
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Scorers:</span>
                        {match.goleadores.map((g, gi) => (
                          <span key={gi} style={{ color: 'var(--accent)' }}>
                            ⚽ {g.nombre} {g.goles > 1 ? `(${g.goles})` : ''}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>
                        {confidence.scorersNotice}
                      </span>
                    )}
                  </div>

                  {/* Expandable Match Minutes & Subs */}
                  {isExpanded && (
                    <div
                      style={{
                        marginTop: '14px',
                        paddingTop: '14px',
                        borderTop: '1px solid var(--border)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      {/* Player ratings / minutes */}
                      {match.minutos && match.minutos.length > 0 && (
                        <div>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                            Squad Performance (Minutes & Ratings)
                          </span>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px', marginTop: '6px' }}>
                            {match.minutos.map((m, mi) => (
                              <div
                                key={mi}
                                style={{
                                  background: 'var(--surface-solid)',
                                  padding: '6px 10px',
                                  borderRadius: 'var(--r-sm)',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  fontSize: '11px',
                                }}
                              >
                                <span style={{ color: 'var(--text)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {m.nombre}
                                </span>
                                <div style={{ display: 'flex', gap: '6px', fontFamily: 'var(--font-mono)' }}>
                                  <span style={{ color: 'var(--text-dim)' }}>{m.minutos}'</span>
                                  <span style={{ color: 'var(--accent)', fontWeight: 700 }}>★{m.nota}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Substitutions */}
                      {match.cambios && match.cambios.length > 0 && (
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                              {t.dashboard.substitutions}
                            </span>
                            {confidence.isSubstitutionsEstimated && (
                              <span className="badge-estimated">{t.dashboard.hypothesis}</span>
                            )}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                            {match.cambios.map((c, ci) => (
                              <div key={ci} style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{c.minuto_cambio}'</span> In: {c.entra} ({c.minutos_jugados} mins) ⇄ Out: {c.sale}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Quick Stats & Financial Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Quick Stats Tile */}
          <div className="glass-panel" style={{ padding: '18px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              {t.dashboard.quickStats}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'var(--surface-solid)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border)',
                }}
              >
                <Users size={18} color="var(--accent)" />
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
                  {squadCount}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {t.dashboard.squadSize}
                </div>
              </div>
            </div>
          </div>

          {/* Financial Breakdown (Coming Soon in Beta 0.2/0.3 per Section 6.2) */}
          <div className="glass-panel" style={{ padding: '18px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Financial Telemetry
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Transfer Budget</span>
                <span style={{ fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{formatCurrency(budget)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-dim)' }}>
                <span>Wage Budget</span>
                <span style={{ fontStyle: 'italic' }}>{t.dashboard.comingSoon}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-dim)' }}>
                <span>Club Balance</span>
                <span style={{ fontStyle: 'italic' }}>{t.dashboard.comingSoon}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-dim)' }}>
                <span>Board Expectations</span>
                <span style={{ fontStyle: 'italic' }}>{t.dashboard.comingSoon}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
