/**
 * apps/desktop/src/engine/templates.ts
 * 
 * Deterministic template generator for staff messages.
 * Modulated by staff personality settings and recent team form.
 */

import messagesEn from './messages.en.json';
import messagesEs from './messages.es.json';
import { MatchEvent, ScoutInfo } from '../contracts';

export interface StaffPersonalities {
  presidentStrictness: number; // 1-10
  assistantAggression: number; // 1-10
  scoutRiskTolerance: number; // 1-10
  mediaConfidence: number; // 1-10
  youthFocus: number; // 1-10
}

export const DEFAULT_PERSONALITIES: StaffPersonalities = {
  presidentStrictness: 6,
  assistantAggression: 5,
  scoutRiskTolerance: 5,
  mediaConfidence: 6,
  youthFocus: 7,
};

export type StaffRole = 'assistant_manager' | 'youth_scout' | 'president' | 'press_officer';

export interface StaffMessage {
  id: string;
  senderRole: StaffRole;
  senderName: string;
  avatarSeed: string;
  text: string;
  timestamp: string;
  category: string;
  isQuickResponse?: boolean;
}

export function deterministicHash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
  }
  return Math.abs(hash);
}

export class TemplateEngine {
  private lang: 'en' | 'es';
  private catalog: typeof messagesEn;
  private personalities: StaffPersonalities;

  constructor(lang: 'en' | 'es' = 'en', personalities: StaffPersonalities = DEFAULT_PERSONALITIES) {
    this.lang = lang;
    this.catalog = lang === 'es' ? messagesEs : messagesEn;
    this.personalities = personalities;
  }

  public setLanguage(lang: 'en' | 'es') {
    this.lang = lang;
    this.catalog = lang === 'es' ? messagesEs : messagesEn;
  }

  public setPersonalities(p: StaffPersonalities) {
    this.personalities = p;
  }

  private pickDeterministic(options: string[], seed: string, dialOffset: number = 0): string {
    if (!options || options.length === 0) return '';
    const hash = deterministicHash(seed) + dialOffset;
    const index = hash % options.length;
    return options[index];
  }

  public generateAssistantMatchSummary(lastMatch: MatchEvent): StaffMessage {
    const isWin = lastMatch.resultado === 'G';
    const isLoss = lastMatch.resultado === 'P';
    const options = isWin
      ? this.catalog.assistant_manager.match_summary_win
      : isLoss
      ? this.catalog.assistant_manager.match_summary_loss
      : this.catalog.assistant_manager.match_summary_draw;

    const seed = `${lastMatch.fecha_juego}_${lastMatch.rival_nombre}_${lastMatch.resultado}`;
    const text = this.pickDeterministic(options, seed, this.personalities.assistantAggression);

    return {
      id: `msg_asst_${deterministicHash(seed)}`,
      senderRole: 'assistant_manager',
      senderName: this.catalog.assistant_manager.name,
      avatarSeed: 'assistant',
      text,
      timestamp: lastMatch.fecha_juego,
      category: 'match_summary',
    };
  }

  public generatePresidentStreakMessage(recentMatches: MatchEvent[]): StaffMessage | null {
    if (recentMatches.length < 3) return null;
    const last3 = recentMatches.slice(0, 3);
    const allWins = last3.every((m) => m.resultado === 'G');
    const allLosses = last3.every((m) => m.resultado === 'P');

    if (!allWins && !allLosses) return null;

    const latest = last3[0];
    const seed = `president_streak_${latest.fecha_juego}_${allWins ? 'W' : 'L'}`;

    let text: string;
    if (allWins) {
      text = this.pickDeterministic(this.catalog.president.winning_streak, seed);
    } else {
      const isStrict = this.personalities.presidentStrictness >= 6;
      const options = isStrict
        ? this.catalog.president.losing_streak_strict
        : this.catalog.president.losing_streak_lenient;
      text = this.pickDeterministic(options, seed, this.personalities.presidentStrictness);
    }

    return {
      id: `msg_pres_${deterministicHash(seed)}`,
      senderRole: 'president',
      senderName: this.catalog.president.name,
      avatarSeed: 'president',
      text,
      timestamp: latest.fecha_juego,
      category: 'streak_report',
    };
  }

  public generateScoutTalentMessage(date: string, realScout?: ScoutInfo): StaffMessage {
    const isHighRisk = this.personalities.scoutRiskTolerance > 6;
    const options = isHighRisk
      ? this.catalog.youth_scout.high_risk_prospect
      : this.catalog.youth_scout.talent_report;

    const seed = `scout_talent_${date}`;
    const text = this.pickDeterministic(options, seed, this.personalities.youthFocus);
    const scoutName = realScout?.nombre || this.catalog.youth_scout.name;

    return {
      id: `msg_scout_${deterministicHash(seed)}`,
      senderRole: 'youth_scout',
      senderName: scoutName,
      avatarSeed: 'scout',
      text,
      timestamp: date,
      category: 'talent_report',
    };
  }

  public generatePressCupMessage(match: MatchEvent): StaffMessage | null {
    if (match.competicion?.tipo !== 'copa' && !match.competicion?.nombre.toLowerCase().includes('copa') && !match.competicion?.nombre.toLowerCase().includes('cup')) {
      return null;
    }

    const seed = `press_cup_${match.fecha_juego}_${match.rival_nombre}`;
    const text = this.pickDeterministic(
      this.catalog.press_officer.cup_match_preview,
      seed,
      this.personalities.mediaConfidence
    );

    return {
      id: `msg_press_${deterministicHash(seed)}`,
      senderRole: 'press_officer',
      senderName: this.catalog.press_officer.name,
      avatarSeed: 'press',
      text,
      timestamp: match.fecha_juego,
      category: 'cup_preview',
    };
  }

  public generateQuickResponse(topic: 'injury' | 'next_match', date: string): StaffMessage {
    const isInjury = topic === 'injury';
    const options = isInjury
      ? this.catalog.assistant_manager.injury_concern
      : this.catalog.assistant_manager.quick_next_match;

    const seed = `quick_${topic}_${date}`;
    const text = this.pickDeterministic(options, seed, this.personalities.assistantAggression);

    return {
      id: `quick_${topic}_${deterministicHash(seed)}`,
      senderRole: 'assistant_manager',
      senderName: this.catalog.assistant_manager.name,
      avatarSeed: 'assistant',
      text,
      timestamp: date,
      category: 'quick_reply',
      isQuickResponse: true,
    };
  }
}
