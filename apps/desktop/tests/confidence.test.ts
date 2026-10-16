import { describe, it, expect } from 'vitest';
import { assessMatchConfidence, isFieldAvailable } from '../src/engine/confidence';
import { MatchEvent } from '../src/contracts';

describe('Confidence Flags & Absence Rules (Section 4.2)', () => {
  it('hides scorers and shows warning when goleadores_confiable is false', () => {
    const match: MatchEvent = {
      tipo: 'partido',
      fecha_juego: '2025-02-20',
      fecha_simulada: '2025-02-28',
      rival_nombre: 'Metropolitan University',
      goles_club: 3,
      goles_rival: 0,
      resultado: 'G',
      partidos_en_delta: 1,
      local_visitante: 'local',
      goleadores_confiable: false,
    };

    const assessmentEn = assessMatchConfidence(match, 'en');
    expect(assessmentEn.scorersAvailable).toBe(false);
    expect(assessmentEn.scorersNotice).toBe('Scorers unavailable for this match');

    const assessmentEs = assessMatchConfidence(match, 'es');
    expect(assessmentEs.scorersAvailable).toBe(false);
    expect(assessmentEs.scorersNotice).toBe('Goleadores no disponibles para este partido');
  });

  it('marks competition as estimated with tooltip when source is heuristica or estado is HIPOTESIS', () => {
    const matchEstimated: MatchEvent = {
      tipo: 'partido',
      fecha_juego: '2025-01-05',
      fecha_simulada: '2025-01-06',
      rival_nombre: 'Silver Peaks',
      goles_club: 2,
      goles_rival: 0,
      resultado: 'G',
      partidos_en_delta: 1,
      local_visitante: 'visitante',
      goleadores_confiable: true,
      competicion: {
        nombre: 'International Champions Cup',
        fuente: 'heuristica',
        estado: 'HIPÓTESIS',
      },
    };

    const assessment = assessMatchConfidence(matchEstimated, 'en');
    expect(assessment.isCompetitionEstimated).toBe(true);
    expect(assessment.competitionTooltip).toBe('Estimated competition based on calendar heuristics');
  });

  it('detects multiples_partidos and triggers single aggregate card notice', () => {
    const multiMatch: MatchEvent = {
      tipo: 'multiples_partidos',
      fecha_juego: '2025-03-12',
      fecha_simulada: '2025-03-15',
      rival_nombre: 'no_disponible (varios partidos en el delta)',
      goles_club: 4,
      goles_rival: 2,
      resultado: 'G',
      partidos_en_delta: 3,
      local_visitante: null,
      goleadores_confiable: false,
    };

    const assessment = assessMatchConfidence(multiMatch, 'en');
    expect(assessment.isMultiMatch).toBe(true);
    expect(assessment.multiMatchNotice).toBe('Several matches were saved together');
  });

  it('treats any field in no_disponible as absent', () => {
    const matchWithMissing: MatchEvent = {
      tipo: 'partido',
      fecha_juego: '2025-01-03',
      fecha_simulada: '2025-01-05',
      rival_nombre: 'Ironclad City',
      goles_club: 3,
      goles_rival: 0,
      resultado: 'G',
      partidos_en_delta: 1,
      local_visitante: 'local',
      no_disponible: ['tarjetas_amarillas_rojas_partido', 'asistencias'],
    };

    expect(isFieldAvailable(matchWithMissing, 'tarjetas_amarillas_rojas_partido')).toBe(false);
    expect(isFieldAvailable(matchWithMissing, 'asistencias')).toBe(false);
    expect(isFieldAvailable(matchWithMissing, 'minutos')).toBe(true);
  });
});
