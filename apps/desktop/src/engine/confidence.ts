/**
 * apps/desktop/src/engine/confidence.ts
 * 
 * Logic for interpreting confidence flags, estimated badges, and absent fields
 * strictly adhering to Section 4.2 of the specification.
 */

import { MatchEvent } from '../contracts';

export interface ConfidenceAssessment {
  scorersAvailable: boolean;
  scorersNotice?: string;
  isMultiMatch: boolean;
  multiMatchNotice?: string;
  isCompetitionEstimated: boolean;
  competitionTooltip?: string;
  isRivalEstimated: boolean;
  isSubstitutionsEstimated: boolean;
  hiddenFields: Set<string>;
}

export function assessMatchConfidence(match: MatchEvent, lang: 'en' | 'es' = 'en'): ConfidenceAssessment {
  const isEn = lang === 'en';
  const hiddenFields = new Set<string>(match.no_disponible || []);

  // Scorers reliability check
  const scorersAvailable = match.goleadores_confiable === true && !hiddenFields.has('goleadores');
  const scorersNotice = scorersAvailable
    ? undefined
    : isEn
    ? 'Scorers unavailable for this match'
    : 'Goleadores no disponibles para este partido';

  // Multi-match check
  const isMultiMatch = match.tipo === 'multiples_partidos';
  const multiMatchNotice = isMultiMatch
    ? isEn
      ? 'Several matches were saved together'
      : 'Varios partidos se guardaron juntos'
    : undefined;

  // Competition estimation badge check
  const comp = match.competicion;
  const isCompetitionEstimated = Boolean(
    comp && (comp.fuente === 'heuristica' || comp.estado === 'HIPÓTESIS')
  );
  const competitionTooltip = isCompetitionEstimated
    ? isEn
      ? 'Estimated competition based on calendar heuristics'
      : 'Competición estimada basada en heurística de calendario'
    : undefined;

  // Rival estimation
  const isRivalEstimated = match.rival_fuente === 'heuristica' || match.rival_fuente === 'hipotesis';

  // Subs estimation
  const isSubstitutionsEstimated = match.cambios_estado === 'HIPÓTESIS';

  return {
    scorersAvailable,
    scorersNotice,
    isMultiMatch,
    multiMatchNotice,
    isCompetitionEstimated,
    competitionTooltip,
    isRivalEstimated,
    isSubstitutionsEstimated,
    hiddenFields,
  };
}

export function isFieldAvailable(match: MatchEvent, fieldName: string): boolean {
  if (match.no_disponible && match.no_disponible.includes(fieldName)) {
    return false;
  }
  return true;
}
