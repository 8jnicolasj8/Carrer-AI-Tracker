/**
 * apps/desktop/src/contracts/index.ts
 * 
 * TypeScript definitions and schemas for Career AI Tracker data inputs.
 */

export interface PlayerMinute {
  playerid: number;
  nombre: string;
  minutos: number;
  nota: number;
}

export interface PlayerSub {
  sale: string;
  playerid_sale: number;
  minuto_cambio: number;
  entra: string;
  playerid_entra: number;
  minutos_jugados: number;
}

export interface PlayerGoalScorer {
  playerid: number;
  nombre: string;
  goles: number;
  fuente?: string;
}

export interface MatchCompetition {
  tipo?: string;
  nombre: string;
  estado?: string;
  fuente?: string;
  nombre_noticia?: string | null;
}

export interface MatchEvent {
  tipo: 'partido' | 'multiples_partidos';
  detectado_en?: string;
  slot_carrera?: string;
  fecha_juego: string;
  competicion?: MatchCompetition;
  rival_id?: number | null;
  rival_nombre: string;
  goles_club?: number;
  goles_boca?: number; // Real reader legacy key
  goles_rival: number;
  resultado: 'G' | 'E' | 'P';
  partidos_en_delta: number;
  local_visitante: 'local' | 'visitante' | null;
  rival_fuente?: string;
  minutos?: PlayerMinute[];
  cambios?: PlayerSub[];
  cambios_estado?: string | null;
  goleadores?: PlayerGoalScorer[];
  goleadores_estado?: string;
  goleadores_confiable?: boolean;
  ajustes_registro?: any[];
  presupuesto_fichajes?: number;
  scouts?: any[];
  tarjetas?: any;
  fecha_simulada: string;
  etapa_competicion?: any[];
  clasificacion_copa?: any;
  no_disponible?: string[];
  validado_ciego?: boolean;
}

export type NewsCategory =
  | 'alineacion'
  | 'rumor'
  | 'lesion'
  | 'expulsion'
  | 'resultado_otros'
  | 'cronica_usuario'
  | 'sin_clasificar';

export interface NewsItem {
  foto: string;
  categoria: NewsCategory;
  subtipo?: string;
  titulo: string;
  cuerpo: string;
  once_probable?: string | null;
  playerid?: number;
  tipo_crudo?: number;
}

export interface SquadPlayer {
  playerid: number;
  nombre: string;
  posicion: string;
  ovr: number;
  camiseta: number;
  partidos: number;
  goles: number;
  goles_confiable: boolean;
}

export interface SquadData {
  schema_version: number;
  generado_en: string;
  club: {
    id: number;
    nombre: string;
  };
  jugadores: SquadPlayer[];
}

export interface ScoutInfo {
  nombre: string;
  nacionalidad: string;
  experiencia: number;
  conocimiento: number;
}

export interface ClubRecord {
  pj: number;
  g: number;
  e: number;
  p: number;
  gf: number;
  gc: number;
  pts: number;
  alcance: 'liga' | 'copa' | 'total';
}

export interface CompetitionProgress {
  nombre: string;
  etapa: string | null;
  fuente: string;
}

export interface CurrentState {
  schema_version: number;
  generado_en: string;
  carrera: {
    identidad: string;
    manager: string;
    club: string;
    liga: string;
  };
  fecha_simulada: string;
  temporada: number;
  presupuesto_fichajes: number;
  ojeador: ScoutInfo;
  competiciones: CompetitionProgress[];
  registro: ClubRecord;
}

// AI stubs for Beta 0.1
export interface AiProviderConfig {
  apiKey?: string;
  model?: string;
  endpoint?: string;
}

export interface AiProvider {
  name: string;
  isAvailable(): boolean;
  generateResponse(prompt: string, context: Record<string, any>): Promise<string>;
}

export interface StaffMessageSource {
  generateMessages(context: Record<string, any>): Promise<any[]>;
}
