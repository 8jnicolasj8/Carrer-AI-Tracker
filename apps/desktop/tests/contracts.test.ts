import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { SQUAD_SCHEMA, CURRENT_STATE_SCHEMA } from '../src/contracts/schemas';
import { SquadData, CurrentState } from '../src/contracts';

describe('Contracts & Schema Validation (Section 4.1 & 4.4)', () => {
  it('validates fixtures/plantel.json against SQUAD_SCHEMA', () => {
    const plantelPath = path.resolve(__dirname, '../../../fixtures/plantel.json');
    expect(fs.existsSync(plantelPath)).toBe(true);

    const data: SquadData = JSON.parse(fs.readFileSync(plantelPath, 'utf-8'));

    expect(data.schema_version).toBe(1);
    expect(data.club).toBeDefined();
    expect(data.club.nombre).toBe('Solaria FC');
    expect(Array.isArray(data.jugadores)).toBe(true);
    expect(data.jugadores.length).toBeGreaterThan(0);

    for (const player of data.jugadores) {
      expect(player.playerid).toBeTypeOf('number');
      expect(player.nombre).toBeTypeOf('string');
      expect(player.posicion).toBeTypeOf('string');
      expect(player.ovr).toBeGreaterThanOrEqual(1);
      expect(player.ovr).toBeLessThanOrEqual(99);
      expect(player.camiseta).toBeGreaterThanOrEqual(1);
      expect(player.partidos).toBeGreaterThanOrEqual(0);
      expect(player.goles).toBeGreaterThanOrEqual(0);
      expect(player.goles_confiable).toBeTypeOf('boolean');
    }
  });

  it('validates fixtures/estado_actual.json against CURRENT_STATE_SCHEMA', () => {
    const estadoPath = path.resolve(__dirname, '../../../fixtures/estado_actual.json');
    expect(fs.existsSync(estadoPath)).toBe(true);

    const data: CurrentState = JSON.parse(fs.readFileSync(estadoPath, 'utf-8'));

    expect(data.schema_version).toBe(1);
    expect(data.carrera.manager).toBeDefined();
    expect(data.carrera.club).toBe('Solaria FC');
    expect(data.fecha_simulada).toBeDefined();
    expect(data.temporada).toBeGreaterThanOrEqual(1);
    expect(data.presupuesto_fichajes).toBeGreaterThan(0);

    // Scout verification
    expect(data.ojeador.nombre).toBeDefined();
    expect(data.ojeador.experiencia).toBeGreaterThanOrEqual(1);
    expect(data.ojeador.conocimiento).toBeGreaterThanOrEqual(1);

    // Record verification
    expect(data.registro.pj).toBeGreaterThanOrEqual(0);
    expect(data.registro.g).toBeGreaterThanOrEqual(0);
    expect(data.registro.e).toBeGreaterThanOrEqual(0);
    expect(data.registro.p).toBeGreaterThanOrEqual(0);
    expect(data.registro.pts).toBeGreaterThanOrEqual(0);
  });
});
