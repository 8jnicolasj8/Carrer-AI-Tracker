/**
 * apps/desktop/src/engine/events.ts
 * 
 * Club events engine with indicators management (team_morale, media_pressure, board_confidence).
 * Strictly driven by definitions in events.json.
 */

import eventsConfig from './events.json';
import { NewsItem, MatchEvent } from '../contracts';

export interface ClubIndicators {
  team_morale: number; // 0-100
  media_pressure: number; // 0-100
  board_confidence: number; // 0-100
}

export interface EventDecision {
  id: string;
  label: { en: string; es: string };
  required_benched_matches?: number;
  effects: Partial<ClubIndicators>;
}

export interface ClubEventDefinition {
  id: string;
  type: 'disciplinary' | 'injury_update' | 'press_conference' | 'board_message';
  title: { en: string; es: string };
  description: { en: string; es: string };
  decisions: EventDecision[];
}

export interface ActiveClubEvent {
  instanceId: string;
  definitionId: string;
  type: 'disciplinary' | 'injury_update' | 'press_conference' | 'board_message';
  title: string;
  description: string;
  contextData?: {
    playerName?: string;
    playerid?: number;
    matchScore?: string;
    injuryDuration?: string;
    month?: string;
  };
  decisions: Array<{
    id: string;
    label: string;
    required_benched_matches?: number;
    effects: Partial<ClubIndicators>;
  }>;
  createdAt: string;
}

export class ClubEventsEngine {
  private indicators: ClubIndicators;
  private eventDefinitions: ClubEventDefinition[];

  constructor(initialIndicators?: Partial<ClubIndicators>) {
    this.indicators = {
      team_morale: initialIndicators?.team_morale ?? eventsConfig.initial_indicators.team_morale,
      media_pressure: initialIndicators?.media_pressure ?? eventsConfig.initial_indicators.media_pressure,
      board_confidence: initialIndicators?.board_confidence ?? eventsConfig.initial_indicators.board_confidence,
    };
    this.eventDefinitions = eventsConfig.events as ClubEventDefinition[];
  }

  public getIndicators(): ClubIndicators {
    return { ...this.indicators };
  }

  public applyEffects(effects: Partial<ClubIndicators>): ClubIndicators {
    if (effects.team_morale !== undefined) {
      this.indicators.team_morale = Math.max(0, Math.min(100, this.indicators.team_morale + effects.team_morale));
    }
    if (effects.media_pressure !== undefined) {
      this.indicators.media_pressure = Math.max(0, Math.min(100, this.indicators.media_pressure + effects.media_pressure));
    }
    if (effects.board_confidence !== undefined) {
      this.indicators.board_confidence = Math.max(0, Math.min(100, this.indicators.board_confidence + effects.board_confidence));
    }
    return this.getIndicators();
  }

  public createEventFromDefinition(
    defId: string,
    lang: 'en' | 'es',
    context?: Record<string, any>
  ): ActiveClubEvent | null {
    const def = this.eventDefinitions.find((d) => d.id === defId);
    if (!def) return null;

    let desc = def.description[lang];
    let title = def.title[lang];

    if (context?.playerName) {
      title = `${title}: ${context.playerName}`;
    }
    if (context?.customDescription) {
      desc = context.customDescription;
    }

    return {
      instanceId: `event_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      definitionId: def.id,
      type: def.type,
      title,
      description: desc,
      contextData: context,
      decisions: def.decisions.map((d) => ({
        id: d.id,
        label: d.label[lang],
        required_benched_matches: d.required_benched_matches,
        effects: d.effects,
      })),
      createdAt: new Date().toISOString(),
    };
  }

  public evaluateNewsForEvents(news: NewsItem[], lang: 'en' | 'es'): ActiveClubEvent[] {
    const generated: ActiveClubEvent[] = [];

    for (const item of news) {
      // Disciplinary event check
      if (item.categoria === 'expulsion' || (item.categoria === 'alineacion' && item.cuerpo.includes('expulsado'))) {
        const event = this.createEventFromDefinition('disciplinary_red_card', lang, {
          customDescription: item.cuerpo,
          playerName: item.titulo,
        });
        if (event) generated.push(event);
      }

      // Injury event check
      if (item.categoria === 'lesion' || item.cuerpo.includes('lesión') || item.cuerpo.includes('injury')) {
        const event = this.createEventFromDefinition('injury_medical_report', lang, {
          customDescription: item.cuerpo,
          playerName: item.titulo,
        });
        if (event) generated.push(event);
      }
    }

    return generated;
  }

  public createPressConferenceEvent(match: MatchEvent, lang: 'en' | 'es'): ActiveClubEvent | null {
    const score = `${match.goles_club ?? match.goles_boca ?? 0} - ${match.goles_rival}`;
    const desc =
      lang === 'en'
        ? `Press asks your assessment after the ${match.resultado === 'G' ? 'victory' : match.resultado === 'P' ? 'defeat' : 'draw'} against ${match.rival_nombre} (${score}).`
        : `La prensa pide tu balance tras el ${match.resultado === 'G' ? 'triunfo' : match.resultado === 'P' ? 'tropiezo' : 'empate'} frente a ${match.rival_nombre} (${score}).`;

    return this.createEventFromDefinition('press_conference_post_match', lang, {
      matchScore: score,
      customDescription: desc,
    });
  }

  public createBoardMonthlyReviewEvent(monthName: string, lang: 'en' | 'es'): ActiveClubEvent | null {
    const desc =
      lang === 'en'
        ? `The board of directors reviews squad performance and budget adherence for the month of ${monthName}.`
        : `La junta directiva evalúa el desempeño de la plantilla y el equilibrio presupuestario de ${monthName}.`;

    return this.createEventFromDefinition('board_monthly_review', lang, {
      month: monthName,
      customDescription: desc,
    });
  }
}
