const { Op } = require('sequelize');
const { Usuario, Grupo, Partido, Pronostico } = require('../models');
const { puntosDeUsuario } = require('./grupoController');

// GET /api/dashboard  -> resumen para el usuario autenticado.
const obtenerResumen = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;

    // 1) Grupos a los que pertenece (con sus miembros para calcular posiciones).
    const usuario = await Usuario.findByPk(usuarioId, {
      include: [{
        model: Grupo,
        as: 'grupos',
        through: { attributes: [] },
        include: [{ model: Usuario, as: 'miembros', attributes: ['id'], through: { attributes: [] } }],
      }],
    });
    const grupos = usuario.grupos || [];

    // 2) Puntaje acumulado total del usuario.
    const puntajeAcumulado = await puntosDeUsuario(usuarioId);

    // 3) Posición del usuario dentro de cada grupo.
    const posiciones = [];
    for (const grupo of grupos) {
      const tabla = [];
      for (const miembro of grupo.miembros) {
        tabla.push({ id: miembro.id, puntos: await puntosDeUsuario(miembro.id) });
      }
      tabla.sort((a, b) => b.puntos - a.puntos);
      const indice = tabla.findIndex((m) => m.id === usuarioId);
      posiciones.push({
        grupo_id: grupo.id,
        nombre: grupo.nombre,
        posicion: indice + 1,
        totalMiembros: tabla.length,
        puntos: puntajeAcumulado,
      });
    }

    // 4) Próximos partidos pendientes de pronóstico.
    const idsPronosticados = (
      await Pronostico.findAll({ where: { usuario_id: usuarioId }, attributes: ['partido_id'] })
    ).map((p) => p.partido_id);

    const proximosSinPronostico = await Partido.findAll({
      where: {
        estado: 'programado',
        fecha: { [Op.gt]: new Date() },
        id: { [Op.notIn]: idsPronosticados.length ? idsPronosticados : [0] },
      },
      order: [['fecha', 'ASC']],
      limit: 5,
    });

    res.json({
      cantidadGrupos: grupos.length,
      puntajeAcumulado,
      posiciones,
      proximosSinPronostico,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { obtenerResumen };
