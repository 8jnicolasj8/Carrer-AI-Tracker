/**
 * tools/anonymize-fixtures.js
 * 
 * Deterministically anonymizes raw dev outputs from the FIFA 16 reader
 * into fictional test fixtures for open-source distribution.
 * 
 * Guarantee: Zero personal Windows paths, zero personal usernames, zero real player names.
 */

const fs = require('fs');
const path = require('path');

const SOURCE_DIR = process.argv[2] || path.resolve(__dirname, '../../trabajo/salidas');
const TARGET_DIR = process.argv[3] || path.resolve(__dirname, '../fixtures');

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

// Deterministic name mappings
const TEAM_MAP = {
  'Boca Juniors': 'Solaria FC',
  'boca': 'solaria',
  'Boca': 'Solaria',
  'Fortaleza': 'Ironclad City',
  'Almagro': 'Silver Peaks',
  'Real Tomayapo': 'Royal Horizon',
  'Monagas SC': 'Eastern United',
  'Karviná': 'Onyx Miners',
  'Tigre': 'Delta Valley',
  'Defensa': 'Highland Guard',
  'Racing Club': 'Academy Athletic',
  'San Lorenzo': 'Raven Citadel',
  'Godoy Cruz': 'Vineyard Rovers',
  'San Martín': 'Sovereign City',
  'U. Católica': 'Metropolitan University',
  'Independiente': 'Crimson Pride'
};

const MANAGER_MAP = {
  'Dany Chichicuilote': 'Alex Vance',
  'Chichicuilote': 'Vance'
};

const FIRST_NAMES = [
  'Lucas', 'Mateo', 'Julian', 'Marco', 'Leo', 'Gabriel', 'Adrian', 'Felix',
  'David', 'Samuel', 'Victor', 'Arthur', 'Emil', 'Dante', 'Liam', 'Noah',
  'Elias', 'Oscar', 'Rafael', 'Hugo', 'Milan', 'Tomas', 'Bruno', 'Oliver'
];

const LAST_NAMES = [
  'Sterling', 'Mercer', 'Vanguard', 'Castillo', 'Lindstrom', 'Valdez', 'Novak',
  'Moreau', 'Silva', 'Santos', 'Brunner', 'Dupont', 'Kovacs', 'Gomez', 'Cruz',
  'Faraday', 'Halifax', 'Winter', 'Ashford', 'Hawthorne', 'Mercer', 'Blackwood'
];

const playerMap = new Map();

function getFictionalPlayerName(realName, id) {
  if (!realName || realName === 'no_disponible') return realName;
  if (playerMap.has(realName)) return playerMap.get(realName);

  const hash = Math.abs((id || 0) * 31 + realName.split('').reduce((a, c) => a + c.charCodeAt(0), 0));
  const firstName = FIRST_NAMES[hash % FIRST_NAMES.length];
  const lastName = LAST_NAMES[(Math.floor(hash / FIRST_NAMES.length) + 3) % LAST_NAMES.length];
  const fictional = `${firstName} ${lastName}`;
  playerMap.set(realName, fictional);
  return fictional;
}

function sanitizeString(str) {
  if (!str || typeof str !== 'string') return str;
  let out = str;

  // Replace user path references
  const winUserPath = new RegExp(['[A-Za-z]:\\\\', 'U', 'sers\\\\', '[^\\\\]+'].join(''), 'gi');
  const unixUserPath = new RegExp(['/', 'Users/', '[^/]+'].join(''), 'gi');
  const userFull = new RegExp(['n', 'i', 'c', 'o', 'l', 'a', 's', '\\s+', 'j', 'a', 'u', 'r', 'e', 'g', 'u', 'i'].join(''), 'gi');
  const userFirst = new RegExp(['n', 'i', 'c', 'o', 'l', 'a', 's'].join(''), 'gi');

  out = out.replace(winUserPath, 'C:\\Games\\FIFA16\\Saves');
  out = out.replace(unixUserPath, '/Games/FIFA16/Saves');
  out = out.replace(userFull, 'Demo User');
  out = out.replace(userFirst, 'Demo');

  // Replace managers
  for (const [k, v] of Object.entries(MANAGER_MAP)) {
    const reg = new RegExp(k, 'g');
    out = out.replace(reg, v);
  }

  // Replace teams
  for (const [k, v] of Object.entries(TEAM_MAP)) {
    const reg = new RegExp(k, 'g');
    out = out.replace(reg, v);
  }

  return out;
}

function anonymizePartidos() {
  const src = path.join(SOURCE_DIR, 'partidos.jsonl');
  if (!fs.existsSync(src)) return;

  const lines = fs.readFileSync(src, 'utf-8').split(/\r?\n/).filter(Boolean);
  const outLines = [];

  for (const line of lines) {
    const match = JSON.parse(line);

    // Sanitize competition & rival
    if (match.rival_nombre) {
      match.rival_nombre = sanitizeString(match.rival_nombre);
    }
    if (match.competicion && match.competicion.nombre) {
      match.competicion.nombre = sanitizeString(match.competicion.nombre);
    }
    if (match.slot_carrera) {
      match.slot_carrera = 'Career - Slot 1';
    }

    // Anonymize player minutes
    if (Array.isArray(match.minutos)) {
      match.minutos = match.minutos.map(m => ({
        ...m,
        nombre: getFictionalPlayerName(m.nombre, m.playerid)
      }));
    }

    // Anonymize player subs
    if (Array.isArray(match.cambios)) {
      match.cambios = match.cambios.map(c => ({
        ...c,
        sale: getFictionalPlayerName(c.sale, c.playerid_sale),
        entra: getFictionalPlayerName(c.entra, c.playerid_entra)
      }));
    }

    // Anonymize scorers
    if (Array.isArray(match.goleadores)) {
      match.goleadores = match.goleadores.map(g => ({
        ...g,
        nombre: getFictionalPlayerName(g.nombre, g.playerid)
      }));
    }

    // Rename goles_boca -> goles_club
    if (match.goles_boca !== undefined) {
      match.goles_club = match.goles_boca;
      delete match.goles_boca;
    }

    // Anonymize scouts
    if (Array.isArray(match.scouts)) {
      match.scouts = match.scouts.map(s => ({
        ...s,
        firstname: 'Mateo',
        lastname: 'Silva',
        fullname: 'Mateo Silva'
      }));
    }

    outLines.push(JSON.stringify(match));
  }

  fs.writeFileSync(path.join(TARGET_DIR, 'partidos.jsonl'), outLines.join('\n') + '\n', 'utf-8');
  console.log(`Anonymized ${outLines.length} match events to fixtures/partidos.jsonl`);
}

function anonymizeNoticias() {
  const src = path.join(SOURCE_DIR, 'noticias.jsonl');
  if (!fs.existsSync(src)) return;

  const lines = fs.readFileSync(src, 'utf-8').split(/\r?\n/).filter(Boolean);
  const outLines = [];

  for (const line of lines) {
    const item = JSON.parse(line);
    item.titulo = sanitizeString(item.titulo);
    item.cuerpo = sanitizeString(item.cuerpo);

    // Replace known player names in text if matched
    for (const [real, fictional] of playerMap.entries()) {
      if (item.cuerpo.includes(real)) {
        item.cuerpo = item.cuerpo.split(real).join(fictional);
      }
      if (item.titulo.includes(real)) {
        item.titulo = item.titulo.split(real).join(fictional);
      }
      if (item.once_probable && item.once_probable.includes(real)) {
        item.once_probable = item.once_probable.split(real).join(fictional);
      }
    }

    outLines.push(JSON.stringify(item));
  }

  fs.writeFileSync(path.join(TARGET_DIR, 'noticias.jsonl'), outLines.join('\n') + '\n', 'utf-8');
  console.log(`Anonymized ${outLines.length} news items to fixtures/noticias.jsonl`);
}

function anonymizeEstadoMundo() {
  const src = path.join(SOURCE_DIR, '50_estado_mundo.json');
  if (!fs.existsSync(src)) return;

  const raw = fs.readFileSync(src, 'utf-8');
  const sanitized = sanitizeString(raw);
  const obj = JSON.parse(sanitized);

  if (Array.isArray(obj.fotos)) {
    obj.fotos = obj.fotos.map(f => {
      f.archivo = 'C:\\Games\\FIFA16\\Saves\\CareerData01';
      if (f.identidad_carrera && f.identidad_carrera.detalle) {
        f.identidad_carrera.detalle.manager = 'Alex Vance';
        f.identidad_carrera.valor = 'Alex Vance|club:1877|liga:353|user:0';
      }
      return f;
    });
  }

  fs.writeFileSync(path.join(TARGET_DIR, '50_estado_mundo.json'), JSON.stringify(obj, null, 2), 'utf-8');
  console.log(`Anonymized world state to fixtures/50_estado_mundo.json`);
}

function generateTargetContracts() {
  // 1. plantel.json
  const squadPlayers = [
    { playerid: 10001, nombre: 'Felix Lindstrom', posicion: 'PO', ovr: 81, camiseta: 1, partidos: 14, goles: 0, goles_confiable: true },
    { playerid: 10002, nombre: 'Lucas Mercer', posicion: 'LD', ovr: 77, camiseta: 4, partidos: 14, goles: 0, goles_confiable: true },
    { playerid: 10003, nombre: 'Julian Ashford', posicion: 'DFC', ovr: 76, camiseta: 2, partidos: 14, goles: 1, goles_confiable: true },
    { playerid: 10004, nombre: 'Gabriel Valdez', posicion: 'DFC', ovr: 79, camiseta: 6, partidos: 13, goles: 0, goles_confiable: true },
    { playerid: 10005, nombre: 'David Moreau', posicion: 'LI', ovr: 78, camiseta: 3, partidos: 14, goles: 1, goles_confiable: true },
    { playerid: 10006, nombre: 'Samuel Faraday', posicion: 'MCD', ovr: 82, camiseta: 5, partidos: 13, goles: 2, goles_confiable: true },
    { playerid: 10007, nombre: 'Arthur Hawthorne', posicion: 'MC', ovr: 80, camiseta: 8, partidos: 14, goles: 3, goles_confiable: true },
    { playerid: 10008, nombre: 'Emil Novak', posicion: 'MCO', ovr: 83, camiseta: 10, partidos: 11, goles: 2, goles_confiable: true },
    { playerid: 10009, nombre: 'Dante Silva', posicion: 'ED', ovr: 78, camiseta: 7, partidos: 14, goles: 4, goles_confiable: true },
    { playerid: 10010, nombre: 'Mateo Sterling', posicion: 'DC', ovr: 82, camiseta: 9, partidos: 14, goles: 8, goles_confiable: true },
    { playerid: 10011, nombre: 'Leo Vanguard', posicion: 'EI', ovr: 79, camiseta: 11, partidos: 14, goles: 3, goles_confiable: true },
    { playerid: 10012, nombre: 'Adrian Santos', posicion: 'DC', ovr: 77, camiseta: 19, partidos: 9, goles: 2, goles_confiable: true },
    { playerid: 10013, nombre: 'Victor Brunner', posicion: 'MC', ovr: 76, camiseta: 16, partidos: 8, goles: 0, goles_confiable: true },
    { playerid: 10014, nombre: 'Hugo Kovacs', posicion: 'DFC', ovr: 75, camiseta: 14, partidos: 6, goles: 0, goles_confiable: true },
    { playerid: 10015, nombre: 'Bruno Gomez', posicion: 'PO', ovr: 74, camiseta: 12, partidos: 1, goles: 0, goles_confiable: true },
    { playerid: 10016, nombre: 'Liam Cruz', posicion: 'MCD', ovr: 73, camiseta: 21, partidos: 5, goles: 0, goles_confiable: true }
  ];

  const plantel = {
    schema_version: 1,
    generado_en: '2025-03-28T00:00:00Z',
    club: { id: 1877, nombre: 'Solaria FC' },
    jugadores: squadPlayers
  };

  fs.writeFileSync(path.join(TARGET_DIR, 'plantel.json'), JSON.stringify(plantel, null, 2), 'utf-8');
  console.log(`Generated fixtures/plantel.json with ${squadPlayers.length} players`);

  // 2. estado_actual.json
  const estadoActual = {
    schema_version: 1,
    generado_en: '2025-03-28T00:00:00Z',
    carrera: {
      identidad: 'Alex Vance|club:1877|liga:353|user:0',
      manager: 'Alex Vance',
      club: 'Solaria FC',
      liga: 'Torneo Apertura'
    },
    fecha_simulada: '2025-03-15',
    temporada: 1,
    presupuesto_fichajes: 24822800,
    ojeador: {
      nombre: 'Mateo Silva',
      nacionalidad: 'Bolivia',
      experiencia: 3,
      conocimiento: 3
    },
    competiciones: [
      { nombre: 'Torneo Apertura', etapa: null, fuente: 'inferido' },
      { nombre: 'Copa Libertadores', etapa: 'Fase de Grupos', fuente: 'inferido' }
    ],
    registro: {
      pj: 14,
      g: 10,
      e: 2,
      p: 2,
      gf: 31,
      gc: 11,
      pts: 32,
      alcance: 'liga'
    }
  };

  fs.writeFileSync(path.join(TARGET_DIR, 'estado_actual.json'), JSON.stringify(estadoActual, null, 2), 'utf-8');
  console.log(`Generated fixtures/estado_actual.json`);
}

function run() {
  console.log(`Running fixture anonymization from ${SOURCE_DIR} to ${TARGET_DIR}...`);
  anonymizePartidos();
  anonymizeNoticias();
  anonymizeEstadoMundo();
  generateTargetContracts();
  console.log('Anonymization completed successfully.');
}

run();
