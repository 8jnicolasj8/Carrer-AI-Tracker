import { describe, it, expect } from 'vitest';
import { TemplateEngine, DEFAULT_PERSONALITIES } from '../src/engine/templates';
import { MatchEvent } from '../src/contracts';

describe('Deterministic Staff Template Engine (Section 7.1)', () => {
  const sampleMatchWin: MatchEvent = {
    tipo: 'partido',
    fecha_juego: '2025-01-22',
    fecha_simulada: '2025-01-23',
    rival_nombre: 'Highland Guard',
    goles_club: 3,
    goles_rival: 0,
    resultado: 'G',
    partidos_en_delta: 1,
    local_visitante: 'local',
  };

  const sampleMatchLoss: MatchEvent = {
    tipo: 'partido',
    fecha_juego: '2025-01-18',
    fecha_simulada: '2025-01-19',
    rival_nombre: 'Delta Valley',
    goles_club: 1,
    goles_rival: 2,
    resultado: 'P',
    partidos_en_delta: 1,
    local_visitante: 'local',
  };

  it('guarantees identical output for identical match data and personality dials (Determinism)', () => {
    const engine1 = new TemplateEngine('en', DEFAULT_PERSONALITIES);
    const engine2 = new TemplateEngine('en', DEFAULT_PERSONALITIES);

    const msg1 = engine1.generateAssistantMatchSummary(sampleMatchWin);
    const msg2 = engine2.generateAssistantMatchSummary(sampleMatchWin);

    expect(msg1.text).toBe(msg2.text);
    expect(msg1.id).toBe(msg2.id);
  });

  it('modulates president reaction based on strictness personality slider', () => {
    const losingMatches = [sampleMatchLoss, sampleMatchLoss, sampleMatchLoss];

    const lenientEngine = new TemplateEngine('en', {
      ...DEFAULT_PERSONALITIES,
      presidentStrictness: 2, // Very lenient
    });

    const strictEngine = new TemplateEngine('en', {
      ...DEFAULT_PERSONALITIES,
      presidentStrictness: 9, // Very strict
    });

    const lenientMsg = lenientEngine.generatePresidentStreakMessage(losingMatches);
    const strictMsg = strictEngine.generatePresidentStreakMessage(losingMatches);

    expect(lenientMsg).not.toBeNull();
    expect(strictMsg).not.toBeNull();
    // Strict president warns about non-negotiable standards or summit
    expect(strictMsg?.text).not.toBe(lenientMsg?.text);
  });

  it('generates localized messages in Spanish without changing determinism', () => {
    const engineEs = new TemplateEngine('es', DEFAULT_PERSONALITIES);
    const msg = engineEs.generateAssistantMatchSummary(sampleMatchWin);

    expect(msg.text).toBeDefined();
    expect(msg.senderName).toBe('Marcus Vance');
    // Ensure Spanish content
    expect(msg.text).toMatch(/[¡!áéíóú]/);
  });

  it('responds to quick replies with deterministic templates', () => {
    const engine = new TemplateEngine('en', DEFAULT_PERSONALITIES);
    const reply1 = engine.generateQuickResponse('injury', '2025-01-25');
    const reply2 = engine.generateQuickResponse('injury', '2025-01-25');

    expect(reply1.text).toBe(reply2.text);
    expect(reply1.isQuickResponse).toBe(true);
  });
});
