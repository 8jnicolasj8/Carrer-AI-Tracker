/**
 * apps/desktop/src/engine/compliance.ts
 * 
 * Verifies disciplinary compliance for the "Bench for N matches" sanction.
 * Strictly adheres to Section 7.3 of the specification:
 * - Next N matches inspected:
 *   - Player minutes > 0 in any match -> 'violated'
 *   - N matches completed with 0 minutes -> 'fulfilled'
 *   - Any 'multiples_partidos' event or player absent from data -> 'non_verifiable'
 */

import { MatchEvent } from '../contracts';

export type ComplianceStatus = 'in_progress' | 'fulfilled' | 'violated' | 'non_verifiable';

export interface SanctionRecord {
  id: string;
  playerid: number;
  playerName: string;
  requiredMatches: number;
  startDate: string;
  appliedAfterMatchDate?: string;
  status: ComplianceStatus;
  checkedMatches: number;
  verdictDate?: string;
  reason?: string;
}

export interface VerificationResult {
  status: ComplianceStatus;
  checkedMatches: number;
  requiredMatches: number;
  reason: string;
  effectOnIndicators?: {
    team_morale: number;
    board_confidence: number;
    media_pressure: number;
  };
}

export function verifyBenchCompliance(
  sanction: SanctionRecord,
  subsequentMatches: MatchEvent[]
): VerificationResult {
  const { playerid, playerName, requiredMatches } = sanction;

  let matchesCounted = 0;

  for (let i = 0; i < subsequentMatches.length; i++) {
    const match = subsequentMatches[i];

    // If a multi-match delta is encountered, compliance cannot be verified
    if (match.tipo === 'multiples_partidos') {
      return {
        status: 'non_verifiable',
        checkedMatches: matchesCounted,
        requiredMatches,
        reason: 'A multi-match save was encountered; individual match minutes cannot be verified.',
        effectOnIndicators: {
          team_morale: 0,
          board_confidence: -5,
          media_pressure: 5,
        },
      };
    }

    // Single match: check if minutes data exists
    if (!match.minutos || !Array.isArray(match.minutos)) {
      return {
        status: 'non_verifiable',
        checkedMatches: matchesCounted,
        requiredMatches,
        reason: `Player data absent for match on ${match.fecha_juego}.`,
        effectOnIndicators: {
          team_morale: 0,
          board_confidence: -5,
          media_pressure: 5,
        },
      };
    }

    const playerEntry = match.minutos.find((p) => p.playerid === playerid);

    // If player is absent from the minutes roster altogether
    // (In FIFA 16 saves, if benched/not called up, they have 0 minutes or may not be listed)
    // If they have minutes > 0: VIOLATED immediately
    if (playerEntry && playerEntry.minutos > 0) {
      return {
        status: 'violated',
        checkedMatches: matchesCounted + 1,
        requiredMatches,
        reason: `${playerName} played ${playerEntry.minutos} minutes in match on ${match.fecha_juego} against ${match.rival_nombre}.`,
        effectOnIndicators: {
          team_morale: -10,
          board_confidence: -15,
          media_pressure: 15,
        },
      };
    }

    // Player did not play (0 minutes or not on pitch)
    matchesCounted++;

    if (matchesCounted >= requiredMatches) {
      return {
        status: 'fulfilled',
        checkedMatches: matchesCounted,
        requiredMatches,
        reason: `Sanction completed: ${playerName} was kept benched for all ${requiredMatches} designated matches.`,
        effectOnIndicators: {
          team_morale: 5,
          board_confidence: 10,
          media_pressure: -5,
        },
      };
    }
  }

  return {
    status: 'in_progress',
    checkedMatches: matchesCounted,
    requiredMatches,
    reason: `In progress: ${matchesCounted}/${requiredMatches} matches benched.`,
  };
}
