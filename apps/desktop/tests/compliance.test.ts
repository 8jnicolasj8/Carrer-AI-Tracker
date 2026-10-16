import { describe, it, expect } from 'vitest';
import { verifyBenchCompliance, SanctionRecord } from '../src/engine/compliance';
import { MatchEvent } from '../src/contracts';

describe('Disciplinary Bench Compliance Verification (Section 7.3)', () => {
  const baseSanction: SanctionRecord = {
    id: 'sanc_01',
    playerid: 10008,
    playerName: 'Emil Novak',
    requiredMatches: 2,
    startDate: '2025-02-01',
    status: 'in_progress',
    checkedMatches: 0,
  };

  it('Case 1: VIOLATED when player plays minutes > 0 during the sanction period', () => {
    const subsequentMatches: MatchEvent[] = [
      {
        tipo: 'partido',
        fecha_juego: '2025-02-05',
        fecha_simulada: '2025-02-06',
        rival_nombre: 'Highland Guard',
        goles_club: 1,
        goles_rival: 0,
        resultado: 'G',
        partidos_en_delta: 1,
        local_visitante: 'local',
        minutos: [
          { playerid: 10008, nombre: 'Emil Novak', minutos: 45, nota: 7 }, // Played 45 mins!
          { playerid: 10001, nombre: 'Felix Lindstrom', minutos: 90, nota: 8 },
        ],
      },
    ];

    const result = verifyBenchCompliance(baseSanction, subsequentMatches);
    expect(result.status).toBe('violated');
    expect(result.checkedMatches).toBe(1);
    expect(result.reason).toContain('played 45 minutes');
    expect(result.effectOnIndicators?.team_morale).toBeLessThan(0);
    expect(result.effectOnIndicators?.board_confidence).toBeLessThan(0);
  });

  it('Case 2: FULFILLED when N consecutive matches pass with 0 minutes', () => {
    const subsequentMatches: MatchEvent[] = [
      {
        tipo: 'partido',
        fecha_juego: '2025-02-05',
        fecha_simulada: '2025-02-06',
        rival_nombre: 'Highland Guard',
        goles_club: 1,
        goles_rival: 0,
        resultado: 'G',
        partidos_en_delta: 1,
        local_visitante: 'local',
        minutos: [
          { playerid: 10008, nombre: 'Emil Novak', minutos: 0, nota: 0 }, // 0 minutes
          { playerid: 10001, nombre: 'Felix Lindstrom', minutos: 90, nota: 8 },
        ],
      },
      {
        tipo: 'partido',
        fecha_juego: '2025-02-09',
        fecha_simulada: '2025-02-10',
        rival_nombre: 'Raven Citadel',
        goles_club: 2,
        goles_rival: 1,
        resultado: 'G',
        partidos_en_delta: 1,
        local_visitante: 'visitante',
        minutos: [
          { playerid: 10008, nombre: 'Emil Novak', minutos: 0, nota: 0 }, // 0 minutes
          { playerid: 10001, nombre: 'Felix Lindstrom', minutos: 90, nota: 7 },
        ],
      },
    ];

    const result = verifyBenchCompliance(baseSanction, subsequentMatches);
    expect(result.status).toBe('fulfilled');
    expect(result.checkedMatches).toBe(2);
    expect(result.reason).toContain('Sanction completed');
    expect(result.effectOnIndicators?.board_confidence).toBeGreaterThan(0);
  });

  it('Case 3A: NON-VERIFIABLE when a multiples_partidos delta is encountered', () => {
    const subsequentMatches: MatchEvent[] = [
      {
        tipo: 'multiples_partidos',
        fecha_juego: '2025-02-08',
        fecha_simulada: '2025-02-10',
        rival_nombre: 'no_disponible (varios partidos en el delta)',
        goles_club: 3,
        goles_rival: 1,
        resultado: 'G',
        partidos_en_delta: 2,
        local_visitante: null,
      },
    ];

    const result = verifyBenchCompliance(baseSanction, subsequentMatches);
    expect(result.status).toBe('non_verifiable');
    expect(result.reason).toContain('multi-match save was encountered');
  });

  it('Case 3B: NON-VERIFIABLE when player minutes data is absent or empty', () => {
    const subsequentMatches: MatchEvent[] = [
      {
        tipo: 'partido',
        fecha_juego: '2025-02-05',
        fecha_simulada: '2025-02-06',
        rival_nombre: 'Highland Guard',
        goles_club: 1,
        goles_rival: 0,
        resultado: 'G',
        partidos_en_delta: 1,
        local_visitante: 'local',
        minutos: undefined as any, // Missing minutes array
      },
    ];

    const result = verifyBenchCompliance(baseSanction, subsequentMatches);
    expect(result.status).toBe('non_verifiable');
    expect(result.reason).toContain('Player data absent');
  });
});
