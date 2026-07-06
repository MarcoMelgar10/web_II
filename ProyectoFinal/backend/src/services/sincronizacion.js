const cron = require('node-cron');
const { Partido, Pronostico } = require('../models');
const { obtenerTodosLosEventos, transformarEvento } = require('./sportsdbService');
const { calcularPuntos } = require('./puntuacion');

// ═══════════════════════════════════════════════════════════════════════
// Sincronización automática con thesportsdb.com
//
// Cada 20 minutos (y al arrancar el servidor):
//   1. Consulta TODOS los eventos del Mundial 2026 desde la API.
//   2. Crea los partidos que no existen en la BD (partidos nuevos).
//   3. Actualiza goles y estado de los partidos existentes.
//   4. Recalcula los puntos de los pronósticos cuando un partido finaliza.
// ═══════════════════════════════════════════════════════════════════════

// Recalcula los puntos de todos los pronósticos de un partido finalizado.
const recalcularPuntos = async (partido) => {
  const pronosticos = await Pronostico.findAll({ where: { partido_id: partido.id } });
  for (const pron of pronosticos) {
    pron.puntos_obtenidos = calcularPuntos(pron, partido);
    await pron.save();
  }
};

// Importa partidos nuevos y actualiza los existentes desde la API.
const importarYSincronizar = async () => {
  console.log('[sync] Consultando thesportsdb.com...');

  const eventos = await obtenerTodosLosEventos();
  if (eventos.length === 0) {
    console.log('[sync] No se obtuvieron eventos de la API.');
    return;
  }

  let creados = 0;
  let actualizados = 0;
  let sinCambios = 0;

  for (const evento of eventos) {
    const datos = transformarEvento(evento);

    // Buscar si el partido ya existe por su id_api.
    const existente = await Partido.findOne({ where: { id_api: datos.id_api } });

    if (!existente) {
      // ── Partido nuevo: crearlo en la BD ───────────────────────────
      await Partido.create(datos);
      creados++;
    } else {
      // ── Partido existente: verificar si hay cambios ───────────────
      let cambio = false;

      // Actualizar goles si la API trae datos nuevos.
      if (datos.goles_local !== null && existente.goles_local !== datos.goles_local) {
        existente.goles_local = datos.goles_local;
        cambio = true;
      }
      if (datos.goles_visitante !== null && existente.goles_visitante !== datos.goles_visitante) {
        existente.goles_visitante = datos.goles_visitante;
        cambio = true;
      }

      // Actualizar estado (programado → en_curso → finalizado).
      if (existente.estado !== datos.estado) {
        existente.estado = datos.estado;
        cambio = true;
      }

      // Actualizar equipos si cambiaron (ej: correcciones de la API).
      if (existente.equipo_local !== datos.equipo_local) {
        existente.equipo_local = datos.equipo_local;
        cambio = true;
      }
      if (existente.equipo_visitante !== datos.equipo_visitante) {
        existente.equipo_visitante = datos.equipo_visitante;
        cambio = true;
      }

      // Completar datos de sede si estaban vacíos.
      if (!existente.estadio && datos.estadio) {
        existente.estadio = datos.estadio;
        cambio = true;
      }
      if (!existente.ciudad && datos.ciudad) {
        existente.ciudad = datos.ciudad;
        cambio = true;
      }
      if (existente.latitud == null && datos.latitud != null) {
        existente.latitud = datos.latitud;
        existente.longitud = datos.longitud;
        cambio = true;
      }

      if (cambio) {
        await existente.save();
        actualizados++;

        // Si el partido acaba de finalizar, recalcular puntos.
        if (existente.estado === 'finalizado') {
          await recalcularPuntos(existente);
        }
      } else {
        sinCambios++;
      }
    }
  }

  console.log(
    `[sync] Resultado: ${creados} nuevos, ${actualizados} actualizados, ${sinCambios} sin cambios ` +
    `(de ${eventos.length} eventos de la API).`
  );
};

// ── Arranque y programación del cron ──────────────────────────────────

const iniciarSincronizacion = () => {
  // Sincronización inicial al arrancar el servidor.
  importarYSincronizar().catch((e) =>
    console.error('[sync] Error en sincronización inicial:', e.message)
  );

  // Repetir cada 20 minutos.
  cron.schedule('*/20 * * * *', () => {
    console.log('[sync] Ejecutando sincronización programada...');
    importarYSincronizar().catch((e) => console.error('[sync] Error:', e.message));
  });

  console.log('Sincronización automática programada cada 20 minutos.');
};

module.exports = { iniciarSincronizacion, importarYSincronizar, recalcularPuntos };
