const axios = require('axios');
const sedes = require('../seed/sedes');

// ═══════════════════════════════════════════════════════════════════════
// Servicio que consulta la API gratuita de thesportsdb.com.
// Documentación: https://www.thesportsdb.com/free_sports_api
// ═══════════════════════════════════════════════════════════════════════

const BASE = process.env.API_SPORTSDB_URL || 'https://www.thesportsdb.com/api/v1/json';
const KEY = process.env.API_SPORTSDB_KEY || '123';
const LEAGUE_ID = '4429';   // FIFA World Cup
const SEASON = '2026';

// ── Mapeo de estadios de la API → ciudades de nuestras sedes ──────────
const MAPA_SEDES = {
  'Estadio Azteca': 'Ciudad de México',
  'Estadio Akron': 'Guadalajara',
  'Estadio BBVA': 'Monterrey',
  'Estadio Banorte': 'Monterrey',          
  'BC Place': 'Vancouver',
  'Mercedes-Benz Stadium': 'Atlanta',
  'Gillette Stadium': 'Boston',
  'AT&T Stadium': 'Dallas',
  'NRG Stadium': 'Houston',
  'Arrowhead Stadium': 'Kansas City',
  'GEHA Field at Arrowhead Stadium': 'Kansas City',
  'SoFi Stadium': 'Los Ángeles',
  'Hard Rock Stadium': 'Miami',
  'MetLife Stadium': 'Nueva York / Nueva Jersey',
  'Lincoln Financial Field': 'Filadelfia',
  "Levi's Stadium": 'San Francisco',
  'Lumen Field': 'Seattle',
};

// ── Traducción de nombres de equipos (inglés → español) ───────────────
const EQUIPOS_ES = {
  'Mexico': 'México', 'South Africa': 'Sudáfrica', 'South Korea': 'Corea del Sur',
  'Czech Republic': 'República Checa', 'Canada': 'Canadá',
  'Bosnia-Herzegovina': 'Bosnia-Herzegovina',
  'USA': 'Estados Unidos', 'Brazil': 'Brasil', 'Morocco': 'Marruecos',
  'Qatar': 'Catar', 'Switzerland': 'Suiza', 'Haiti': 'Haití', 'Scotland': 'Escocia',
  'Germany': 'Alemania', 'Curaçao': 'Curazao', 'Ivory Coast': 'Costa de Marfil',
  'Netherlands': 'Países Bajos', 'Japan': 'Japón', 'Turkey': 'Turquía',
  'Belgium': 'Bélgica', 'Egypt': 'Egipto', 'Saudi Arabia': 'Arabia Saudita',
  'Spain': 'España', 'Cape Verde': 'Cabo Verde', 'Sweden': 'Suecia',
  'Tunisia': 'Túnez', 'Iran': 'Irán', 'New Zealand': 'Nueva Zelanda',
  'France': 'Francia', 'Iraq': 'Irak', 'Norway': 'Noruega',
  'Algeria': 'Argelia', 'Jordan': 'Jordania', 'England': 'Inglaterra',
  'Croatia': 'Croacia', 'Panama': 'Panamá',
  'DR Congo': 'RD Congo', 'Uzbekistan': 'Uzbekistán',
  // Los que no necesitan traducción se devuelven tal cual.
};

const traducirEquipo = (nombre) => EQUIPOS_ES[nombre] || nombre;

// ── Mapeo de estado de la API → estado interno ────────────────────────
const mapearEstado = (estadoApi) => {
  if (!estadoApi) return 'programado';
  const t = String(estadoApi).toLowerCase().trim();
  // Finalizado
  if (['ft', 'aet', 'ap'].includes(t) || t.includes('match finished')) return 'finalizado';
  // En curso
  if (['1h', '2h', 'ht', 'et'].includes(t) || t.includes('live')) return 'en_curso';
  // Cualquier otro estado → programado (NS = Not Started, etc.)
  return 'programado';
};

// ── Mapeo de ronda de la API → fase del torneo ────────────────────────
// thesportsdb usa: 1,2,3 para grupos; 32 para dieciseisavos; 16 para
// octavos; 8 para cuartos; 4 para semifinales; etc.
const mapearFase = (ronda) => {
  const r = Number(ronda);
  if (r >= 1 && r <= 3) return 'grupos';
  if (r === 32) return 'dieciseisavos';
  if (r === 16) return 'octavos';
  if (r === 8)  return 'cuartos';
  if (r === 4)  return 'semifinal';
  // Para rondas desconocidas, inferir por número:
  // 5 → tercer puesto, 6+ → final (el admin puede corregirlo).
  if (r === 5)  return 'tercer_puesto';
  return 'final';
};

// Parseo seguro de goles (puede venir null, "null", "", etc.)
const parseGoles = (val) => {
  if (val === null || val === undefined || val === '' || val === 'null') return null;
  const n = Number(val);
  return isNaN(n) ? null : n;
};

// Busca la sede en nuestro catálogo para obtener coordenadas.
const buscarSede = (estadioApi) => {
  if (!estadioApi) return null;
  const ciudad = MAPA_SEDES[estadioApi];
  if (!ciudad) return null;
  return sedes.find((s) => s.ciudad === ciudad) || null;
};

// ═══════════════════════════════════════════════════════════════════════
// Funciones de consulta a la API
// ═══════════════════════════════════════════════════════════════════════

// Busca un evento por su id y devuelve marcador + estado.
const obtenerEventoPorId = async (idEvento) => {
  try {
    const url = `${BASE}/${KEY}/lookupevent.php?id=${idEvento}`;
    const { data } = await axios.get(url, { timeout: 8000 });
    if (!data?.events?.length) return null;
    const e = data.events[0];
    return {
      goles_local: parseGoles(e.intHomeScore),
      goles_visitante: parseGoles(e.intAwayScore),
      estado: mapearEstado(e.strStatus),
    };
  } catch (error) {
    console.warn(`[sportsdb] Error evento ${idEvento}: ${error.message}`);
    return null;
  }
};

// Obtiene TODOS los eventos del Mundial 2026, ronda por ronda.
// Consulta fases de grupo (1-3) y fases eliminatorias (32, 16, 8, 4, 5, 6, 7).
const obtenerTodosLosEventos = async () => {
  const todos = [];
  const rondas = [1, 2, 3, 32, 16, 8, 4, 5, 6, 7];

  for (const r of rondas) {
    try {
      const url = `${BASE}/${KEY}/eventsround.php?id=${LEAGUE_ID}&r=${r}&s=${SEASON}`;
      const { data } = await axios.get(url, { timeout: 10000 });
      if (data?.events?.length) {
        todos.push(...data.events);
        console.log(`[sportsdb] Ronda ${r}: ${data.events.length} eventos obtenidos.`);
      }
    } catch (error) {
      console.warn(`[sportsdb] Error ronda ${r}: ${error.message}`);
    }
  }

  console.log(`[sportsdb] Total de eventos obtenidos: ${todos.length}`);
  return todos;
};

// Transforma un evento crudo de la API al formato de nuestro modelo Partido.
const transformarEvento = (evento) => {
  const sede = buscarSede(evento.strVenue);
  return {
    id_api: evento.idEvent,
    equipo_local: traducirEquipo(evento.strHomeTeam),
    equipo_visitante: traducirEquipo(evento.strAwayTeam),
    fecha: new Date(evento.strTimestamp + (evento.strTimestamp.includes('Z') ? '' : 'Z')),
    fase: mapearFase(evento.intRound),
    estado: mapearEstado(evento.strStatus),
    estadio: evento.strVenue || null,
    ciudad: sede ? sede.ciudad : (evento.strCountry || null),
    latitud: sede ? sede.latitud : null,
    longitud: sede ? sede.longitud : null,
    goles_local: parseGoles(evento.intHomeScore),
    goles_visitante: parseGoles(evento.intAwayScore),
  };
};

module.exports = {
  obtenerEventoPorId,
  obtenerTodosLosEventos,
  transformarEvento,
};
