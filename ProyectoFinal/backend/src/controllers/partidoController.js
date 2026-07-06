const { Op } = require('sequelize');
const { Partido } = require('../models');

// GET /api/partidos  -> calendario con filtros opcionales por fase, fecha y estado.
const listarPartidos = async (req, res, next) => {
  try {
    const { fase, estado, fecha } = req.query;
    const where = {};

    if (fase) where.fase = fase;
    if (estado) where.estado = estado;

    // Filtro por día completo (desde 00:00 hasta 23:59 de esa fecha).
    if (fecha) {
      const inicio = new Date(`${fecha}T00:00:00`);
      const fin = new Date(`${fecha}T23:59:59`);
      where.fecha = { [Op.between]: [inicio, fin] };
    }

    const partidos = await Partido.findAll({ where, order: [['fecha', 'ASC']] });
    res.json(partidos);
  } catch (error) {
    next(error);
  }
};

// GET /api/partidos/:id  -> detalle de un partido (incluye estadio y ciudad).
const detallePartido = async (req, res, next) => {
  try {
    const partido = await Partido.findByPk(req.params.id);
    if (!partido) {
      return res.status(404).json({ mensaje: 'Partido no encontrado' });
    }
    res.json(partido);
  } catch (error) {
    next(error);
  }
};

// POST /api/partidos  (admin)  -> registra un nuevo partido.
const crearPartido = async (req, res, next) => {
  try {
    const {
      equipo_local, equipo_visitante, fecha, fase,
      estadio, ciudad, latitud, longitud, id_api,
    } = req.body;

    const partido = await Partido.create({
      equipo_local,
      equipo_visitante,
      fecha,
      fase,
      estadio,
      ciudad,
      latitud,
      longitud,
      id_api,
      estado: 'programado',
    });

    res.status(201).json(partido);
  } catch (error) {
    next(error);
  }
};

// PUT /api/partidos/:id  (admin)  -> edita la info del partido.
// IMPORTANTE: no se permite modificar el resultado (goles ni estado);
// el marcador se obtiene únicamente de la API de thesportsdb.
const actualizarPartido = async (req, res, next) => {
  try {
    const partido = await Partido.findByPk(req.params.id);
    if (!partido) {
      return res.status(404).json({ mensaje: 'Partido no encontrado' });
    }

    const {
      equipo_local, equipo_visitante, fecha, fase,
      estadio, ciudad, latitud, longitud, id_api,
    } = req.body;

    // Solo se actualizan los campos de información (nunca goles ni estado).
    if (equipo_local !== undefined) partido.equipo_local = equipo_local;
    if (equipo_visitante !== undefined) partido.equipo_visitante = equipo_visitante;
    if (fecha !== undefined) partido.fecha = fecha;
    if (fase !== undefined) partido.fase = fase;
    if (estadio !== undefined) partido.estadio = estadio;
    if (ciudad !== undefined) partido.ciudad = ciudad;
    if (latitud !== undefined) partido.latitud = latitud;
    if (longitud !== undefined) partido.longitud = longitud;
    if (id_api !== undefined) partido.id_api = id_api;

    await partido.save();
    res.json(partido);
  } catch (error) {
    next(error);
  }
};

module.exports = { listarPartidos, detallePartido, crearPartido, actualizarPartido };
