const { Pronostico, Partido } = require('../models');

// Un partido se puede pronosticar solo si todavía no comenzó.
const partidoNoComenzado = (partido) => {
  return partido.estado === 'programado' && new Date(partido.fecha) > new Date();
};

// POST /api/pronosticos  -> registra un pronóstico antes del inicio del partido.
const crearPronostico = async (req, res, next) => {
  try {
    const { partido_id, goles_local, goles_visitante } = req.body;

    const partido = await Partido.findByPk(partido_id);
    if (!partido) {
      return res.status(404).json({ mensaje: 'Partido no encontrado' });
    }
    if (!partidoNoComenzado(partido)) {
      return res.status(400).json({ mensaje: 'El partido ya comenzó, no se puede pronosticar' });
    }

    // No permitir dos pronósticos del mismo usuario para el mismo partido.
    const yaExiste = await Pronostico.findOne({
      where: { usuario_id: req.usuario.id, partido_id },
    });
    if (yaExiste) {
      return res.status(409).json({ mensaje: 'Ya tienes un pronóstico para este partido' });
    }

    const pronostico = await Pronostico.create({
      usuario_id: req.usuario.id,
      partido_id,
      goles_local,
      goles_visitante,
    });

    res.status(201).json(pronostico);
  } catch (error) {
    next(error);
  }
};

// PUT /api/pronosticos/:id  -> modifica un pronóstico (solo si el partido no comenzó).
const actualizarPronostico = async (req, res, next) => {
  try {
    const { goles_local, goles_visitante } = req.body;

    const pronostico = await Pronostico.findByPk(req.params.id, {
      include: [{ model: Partido, as: 'partido' }],
    });
    if (!pronostico) {
      return res.status(404).json({ mensaje: 'Pronóstico no encontrado' });
    }
    // Solo el dueño puede modificarlo.
    if (pronostico.usuario_id !== req.usuario.id) {
      return res.status(403).json({ mensaje: 'No puedes modificar este pronóstico' });
    }
    if (!partidoNoComenzado(pronostico.partido)) {
      return res.status(400).json({ mensaje: 'El partido ya comenzó, no se puede modificar' });
    }

    pronostico.goles_local = goles_local;
    pronostico.goles_visitante = goles_visitante;
    await pronostico.save();

    res.json(pronostico);
  } catch (error) {
    next(error);
  }
};

// GET /api/pronosticos  -> todos mis pronósticos con los puntos obtenidos.
const misPronosticos = async (req, res, next) => {
  try {
    const pronosticos = await Pronostico.findAll({
      where: { usuario_id: req.usuario.id },
      include: [{ model: Partido, as: 'partido' }],
      order: [[{ model: Partido, as: 'partido' }, 'fecha', 'ASC']],
    });
    res.json(pronosticos);
  } catch (error) {
    next(error);
  }
};

module.exports = { crearPronostico, actualizarPronostico, misPronosticos };
