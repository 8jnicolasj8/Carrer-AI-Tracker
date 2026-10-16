/**
 * apps/desktop/src/renderer/pages/SquadPage.tsx
 * 
 * Squad Screen conforming strictly to Section 6.3:
 * - Table of players from plantel.json: name, position, OVR, kit, matches, goals with confidence flag.
 * - Sortable columns, position filter, search bar.
 * - Player detail drawer with match performance history and injury badge (only if mentioned in news).
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../state/AppContext';
import { SquadPlayer } from '../../contracts';
import { Search, ArrowUpDown, X, ShieldAlert } from 'lucide-react';

export const SquadPage: React.FC = () => {
  const { data, t } = useApp();
  const [search, setSearch] = useState<string>('');
  const [selectedPos, setSelectedPos] = useState<string>('ALL');
  const [sortField, setSortField] = useState<keyof SquadPlayer>('ovr');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [selectedPlayer, setSelectedPlayer] = useState<SquadPlayer | null>(null);

  const players = data?.squad?.jugadores || [];
  const matches = data?.matches || [];
  const news = data?.news || [];
  const sanctions = useApp().sanctions;

  // Filter and sort players
  const filteredPlayers = useMemo(() => {
    return players
      .filter((p) => {
        const matchesSearch = p.nombre.toLowerCase().includes(search.toLowerCase());
        const matchesPos =
          selectedPos === 'ALL'
            ? true
            : selectedPos === 'GK'
            ? p.posicion === 'PO' || p.posicion === 'GK'
            : selectedPos === 'DEF'
            ? ['DFC', 'LI', 'LD', 'CB', 'LB', 'RB'].includes(p.posicion)
            : selectedPos === 'MID'
            ? ['MC', 'MCD', 'MCO', 'MD', 'MI', 'CM', 'CDM', 'CAM', 'RM', 'LM'].includes(p.posicion)
            : ['DC', 'ED', 'EI', 'ST', 'RW', 'LW', 'CF'].includes(p.posicion);
        return matchesSearch && matchesPos;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') {
          return sortAsc ? (valA as string).localeCompare(valB as string) : (valB as string).localeCompare(valA as string);
        }
        return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      });
  }, [players, search, selectedPos, sortField, sortAsc]);

  const handleSort = (field: keyof SquadPlayer) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Check if player has injury reported in news per Section 5 & 6.3
  const isPlayerInjured = (playerName: string) => {
    return news.some(
      (n) => (n.categoria === 'lesion' || n.cuerpo.includes('lesión') || n.cuerpo.includes('injury')) && n.cuerpo.includes(playerName)
    );
  };

  // Find recent minutes & ratings for selected player in match history
  const playerMatchHistory = useMemo(() => {
    if (!selectedPlayer) return [];
    const history: Array<{ date: string; rival: string; minutes: number; rating: number }> = [];

    for (const m of matches) {
      if (m.minutos) {
        const entry = m.minutos.find((p) => p.playerid === selectedPlayer.playerid || p.nombre === selectedPlayer.nombre);
        if (entry) {
          history.push({
            date: m.fecha_juego,
            rival: m.rival_nombre,
            minutes: entry.minutos,
            rating: entry.nota,
          });
        }
      }
    }
    return history.slice(0, 8);
  }, [selectedPlayer, matches]);

  const playerSanction = selectedPlayer ? sanctions.find((s) => s.playerid === selectedPlayer.playerid && s.status === 'in_progress') : null;

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Table Main Section */}
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
              {t.squad.title}
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
              {filteredPlayers.length} / {players.length} players registered
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--surface-solid)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-input)',
                padding: '6px 12px',
                width: '220px',
              }}
            >
              <Search size={14} color="var(--text-dim)" />
              <input
                type="text"
                placeholder={t.squad.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text)',
                  fontSize: '12px',
                  width: '100%',
                  outline: 'none',
                }}
              />
            </div>

            {/* Position filter */}
            <div style={{ display: 'flex', gap: '4px', background: 'var(--surface-solid)', padding: '3px', borderRadius: 'var(--r-pill)', border: '1px solid var(--border)' }}>
              {['ALL', 'GK', 'DEF', 'MID', 'FWD'].map((pos) => (
                <button
                  key={pos}
                  onClick={() => setSelectedPos(pos)}
                  style={{
                    background: selectedPos === pos ? 'var(--accent)' : 'transparent',
                    color: selectedPos === pos ? 'var(--accent-ink)' : 'var(--text-muted)',
                    fontWeight: selectedPos === pos ? 700 : 500,
                    fontSize: '11px',
                    padding: '4px 10px',
                    borderRadius: 'var(--r-pill)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Squad Table */}
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(5, 18, 26, 0.4)' }}>
                <th style={{ padding: '12px 16px', color: 'var(--text-dim)', fontWeight: 600 }}>{t.squad.kit}</th>
                <th onClick={() => handleSort('nombre')} style={{ padding: '12px 16px', color: 'var(--text-dim)', fontWeight: 600, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{t.squad.name}</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th onClick={() => handleSort('posicion')} style={{ padding: '12px 16px', color: 'var(--text-dim)', fontWeight: 600, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{t.squad.position}</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th onClick={() => handleSort('ovr')} style={{ padding: '12px 16px', color: 'var(--text-dim)', fontWeight: 600, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{t.squad.ovr}</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th onClick={() => handleSort('partidos')} style={{ padding: '12px 16px', color: 'var(--text-dim)', fontWeight: 600, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{t.squad.matches}</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th onClick={() => handleSort('goles')} style={{ padding: '12px 16px', color: 'var(--text-dim)', fontWeight: 600, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{t.squad.goals}</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th style={{ padding: '12px 16px', color: 'var(--text-dim)', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-dim)' }}>
                    {t.squad.noData}
                  </td>
                </tr>
              ) : (
                filteredPlayers.map((player) => {
                  const injured = isPlayerInjured(player.nombre);
                  const isSelected = selectedPlayer?.playerid === player.playerid;
                  return (
                    <tr
                      key={player.playerid}
                      onClick={() => setSelectedPlayer(player)}
                      style={{
                        borderBottom: '1px solid rgba(120, 224, 208, 0.08)',
                        backgroundColor: isSelected ? 'var(--accent-soft)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                        #{player.camiseta}
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text)' }}>
                        {player.nombre}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span
                          style={{
                            background: 'var(--surface-solid)',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: 'var(--text-muted)',
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          {player.posicion}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span
                          style={{
                            fontSize: '14px',
                            fontWeight: 800,
                            fontFamily: 'var(--font-mono)',
                            color: player.ovr >= 80 ? 'var(--accent)' : 'var(--text)',
                          }}
                        >
                          {player.ovr}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)' }}>
                        {player.partidos}
                      </td>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)' }}>
                        <span style={{ color: player.goles > 0 ? 'var(--accent)' : 'var(--text-dim)', fontWeight: 600 }}>
                          {player.goles}
                        </span>
                        {!player.goles_confiable && (
                          <span style={{ fontSize: '10px', color: 'var(--warning)', marginLeft: '4px' }}>*</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {injured && (
                          <span className="badge-estimated" style={{ background: 'rgba(255, 82, 82, 0.15)', color: 'var(--danger)', borderColor: 'rgba(255, 82, 82, 0.3)' }}>
                            {t.squad.injuredBadge}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Player Detail Drawer */}
      {selectedPlayer && (
        <aside
          style={{
            width: '320px',
            borderLeft: '1px solid var(--border)',
            backgroundColor: 'var(--bg-2)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            overflowY: 'auto',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700 }}>
              Player Dossier
            </span>
            <button
              onClick={() => setSelectedPlayer(null)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Profile Card */}
          <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--surface-solid)',
                border: '2px solid var(--accent)',
                margin: '0 auto 12px auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                fontWeight: 800,
                color: 'var(--accent)',
              }}
            >
              {selectedPlayer.camiseta}
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
              {selectedPlayer.nombre}
            </h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{selectedPlayer.posicion}</span>
              <span style={{ color: 'var(--text-dim)' }}>•</span>
              <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 700 }}>{selectedPlayer.ovr} OVR</span>
            </div>

            {/* Badges */}
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {isPlayerInjured(selectedPlayer.nombre) && (
                <div className="badge-estimated" style={{ justifyContent: 'center', background: 'rgba(255, 82, 82, 0.15)', color: 'var(--danger)', borderColor: 'rgba(255, 82, 82, 0.3)' }}>
                  <ShieldAlert size={12} />
                  <span>{t.squad.injuredBadge}</span>
                </div>
              )}
              {playerSanction && (
                <div className="badge-estimated" style={{ justifyContent: 'center' }}>
                  <span>{t.squad.benchSanction} ({playerSanction.checkedMatches}/{playerSanction.requiredMatches})</span>
                </div>
              )}
            </div>
          </div>

          {/* Performance Telemetry */}
          <div className="glass-panel" style={{ padding: '16px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, display: 'block', marginBottom: '10px' }}>
              {t.squad.recentForm}
            </span>

            {playerMatchHistory.length === 0 ? (
              <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>No match minutes recorded.</span>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {playerMatchHistory.map((h, hi) => (
                  <div
                    key={hi}
                    style={{
                      background: 'var(--surface-solid)',
                      padding: '8px 12px',
                      borderRadius: 'var(--r-sm)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '12px',
                    }}
                  >
                    <div>
                      <div style={{ color: 'var(--text)', fontWeight: 600 }}>vs {h.rival}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{h.date}</div>
                    </div>
                    <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{h.minutes}'</span>
                      <span style={{ color: 'var(--accent)', fontWeight: 700, marginLeft: '8px' }}>★{h.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      )}
    </div>
  );
};
