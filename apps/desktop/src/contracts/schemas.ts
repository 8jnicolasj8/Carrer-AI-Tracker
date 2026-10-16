/**
 * apps/desktop/src/contracts/schemas.ts
 * 
 * JSON Schema specifications for runtime validation.
 */

export const SQUAD_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'SquadData',
  type: 'object',
  required: ['schema_version', 'generado_en', 'club', 'jugadores'],
  properties: {
    schema_version: { type: 'integer', minimum: 1 },
    generado_en: { type: 'string' },
    club: {
      type: 'object',
      required: ['id', 'nombre'],
      properties: {
        id: { type: 'integer' },
        nombre: { type: 'string' }
      }
    },
    jugadores: {
      type: 'array',
      items: {
        type: 'object',
        required: ['playerid', 'nombre', 'posicion', 'ovr', 'camiseta', 'partidos', 'goles'],
        properties: {
          playerid: { type: 'integer' },
          nombre: { type: 'string' },
          posicion: { type: 'string' },
          ovr: { type: 'integer', minimum: 1, maximum: 99 },
          camiseta: { type: 'integer', minimum: 1, maximum: 99 },
          partidos: { type: 'integer', minimum: 0 },
          goles: { type: 'integer', minimum: 0 },
          goles_confiable: { type: 'boolean' }
        }
      }
    }
  }
};

export const CURRENT_STATE_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'CurrentState',
  type: 'object',
  required: ['schema_version', 'generado_en', 'carrera', 'fecha_simulada', 'temporada', 'presupuesto_fichajes', 'ojeador', 'registro'],
  properties: {
    schema_version: { type: 'integer', minimum: 1 },
    generado_en: { type: 'string' },
    carrera: {
      type: 'object',
      required: ['identidad', 'manager', 'club', 'liga'],
      properties: {
        identidad: { type: 'string' },
        manager: { type: 'string' },
        club: { type: 'string' },
        liga: { type: 'string' }
      }
    },
    fecha_simulada: { type: 'string' },
    temporada: { type: 'integer', minimum: 1 },
    presupuesto_fichajes: { type: 'number' },
    ojeador: {
      type: 'object',
      required: ['nombre', 'nacionalidad', 'experiencia', 'conocimiento'],
      properties: {
        nombre: { type: 'string' },
        nacionalidad: { type: 'string' },
        experiencia: { type: 'integer', minimum: 1, maximum: 5 },
        conocimiento: { type: 'integer', minimum: 1, maximum: 5 }
      }
    },
    competiciones: {
      type: 'array',
      items: {
        type: 'object',
        required: ['nombre', 'fuente'],
        properties: {
          nombre: { type: 'string' },
          etapa: { type: ['string', 'null'] },
          fuente: { type: 'string' }
        }
      }
    },
    registro: {
      type: 'object',
      required: ['pj', 'g', 'e', 'p', 'gf', 'gc', 'pts'],
      properties: {
        pj: { type: 'integer', minimum: 0 },
        g: { type: 'integer', minimum: 0 },
        e: { type: 'integer', minimum: 0 },
        p: { type: 'integer', minimum: 0 },
        gf: { type: 'integer', minimum: 0 },
        gc: { type: 'integer', minimum: 0 },
        pts: { type: 'integer', minimum: 0 },
        alcance: { type: 'string' }
      }
    }
  }
};
