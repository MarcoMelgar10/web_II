const express = require('express');
const router = express.Router();
const { Cancha, TipoCancha, Horario, Resena, Usuario } = require('../models');
const { literal } = require('sequelize');

router.get('/', async (req, res) => {
  try {
    const canchas = await Cancha.findAll({
      where: { estado: 'activa' },
      include: [{ model: TipoCancha, as: 'tipo' }],
      attributes: {
        include: [
          [literal('(SELECT AVG(calificacion) FROM resenas WHERE resenas.cancha_id = Cancha.id)'), 'promedio_calificacion'],
          [literal('(SELECT COUNT(*) FROM resenas WHERE resenas.cancha_id = Cancha.id)'), 'total_resenas'],
        ],
      },
      order: [['nombre', 'ASC']],
    });

    res.render('canchas/index', { title: 'Canchas Disponibles', canchas });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al cargar las canchas.');
    res.redirect('/');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const fecha = req.query.fecha || new Date().toISOString().split('T')[0];

    const cancha = await Cancha.findOne({
      where: { id, estado: 'activa' },
      include: [{ model: TipoCancha, as: 'tipo' }],
    });

    if (!cancha) {
      req.flash('error', 'Cancha no encontrada.');
      return res.redirect('/canchas');
    }

    const horarios = await Horario.findAll({
      where: { cancha_id: id, fecha, disponible: true },
      order: [['hora_inicio', 'ASC']],
    });

    const resenas = await Resena.findAll({
      where: { cancha_id: id },
      include: [{ model: Usuario, as: 'usuario', attributes: ['nombre'] }],
      order: [['createdAt', 'DESC']],
    });

    const promedioCalificacion = resenas.length > 0
      ? (resenas.reduce((sum, r) => sum + r.calificacion, 0) / resenas.length).toFixed(1)
      : null;

    res.render('canchas/show', {
      title: cancha.nombre,
      cancha,
      horarios,
      resenas,
      promedioCalificacion,
      fechaSeleccionada: fecha,
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al cargar la cancha.');
    res.redirect('/canchas');
  }
});

module.exports = router;
