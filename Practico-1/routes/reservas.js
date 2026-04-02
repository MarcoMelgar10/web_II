const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Reserva, Horario, Cancha, TipoCancha } = require('../models');
const { isAuthenticated } = require('../middleware/auth');

router.get('/mis-reservas', isAuthenticated, async (req, res) => {
  try {
    const reservas = await Reserva.findAll({
      where: { usuario_id: req.session.usuarioId },
      include: [{
        model: Horario,
        as: 'horario',
        include: [{
          model: Cancha,
          as: 'cancha',
          include: [{ model: TipoCancha, as: 'tipo' }],
        }],
      }],
      order: [
        [{ model: Horario, as: 'horario' }, 'fecha', 'DESC'],
        [{ model: Horario, as: 'horario' }, 'hora_inicio', 'DESC'],
      ],
    });

    const hoy = new Date().toISOString().split('T')[0];

    res.render('reservas/mis-reservas', { title: 'Mis Reservas', reservas, hoy });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al cargar tus reservas.');
    res.redirect('/');
  }
});

router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { horario_id } = req.body;

    if (!horario_id) {
      req.flash('error', 'Horario no especificado.');
      return res.redirect('/canchas');
    }

    const horario = await Horario.findByPk(horario_id, {
      include: [{ model: Cancha, as: 'cancha' }],
    });

    if (!horario) {
      req.flash('error', 'El horario no existe.');
      return res.redirect('/canchas');
    }

    if (!horario.disponible) {
      req.flash('error', 'Este horario ya no está disponible.');
      return res.redirect(`/canchas/${horario.cancha_id}?fecha=${horario.fecha}`);
    }

    if (horario.cancha.estado !== 'activa') {
      req.flash('error', 'La cancha no está disponible.');
      return res.redirect('/canchas');
    }

    const reservaExistente = await Reserva.findOne({
      where: { estado: 'confirmada' },
      include: [{
        model: Horario,
        as: 'horario',
        where: {
          cancha_id: horario.cancha_id,
          fecha: horario.fecha,
          hora_inicio: { [Op.lt]: horario.hora_fin },
          hora_fin: { [Op.gt]: horario.hora_inicio },
        },
      }],
    });

    if (reservaExistente) {
      req.flash('error', 'Ya existe una reserva confirmada para esta cancha en ese horario.');
      return res.redirect(`/canchas/${horario.cancha_id}?fecha=${horario.fecha}`);
    }

    await Reserva.create({
      usuario_id: req.session.usuarioId,
      horario_id,
      estado: 'confirmada',
    });

    await horario.update({ disponible: false });

    req.flash('success', 'Reserva creada exitosamente.');
    res.redirect('/reservas/mis-reservas');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al crear la reserva.');
    res.redirect('/canchas');
  }
});

router.post('/:id/cancelar', isAuthenticated, async (req, res) => {
  try {
    const reserva = await Reserva.findOne({
      where: { id: req.params.id, usuario_id: req.session.usuarioId },
      include: [{ model: Horario, as: 'horario' }],
    });

    if (!reserva) {
      req.flash('error', 'Reserva no encontrada.');
      return res.redirect('/reservas/mis-reservas');
    }

    if (reserva.estado === 'cancelada') {
      req.flash('error', 'Esta reserva ya está cancelada.');
      return res.redirect('/reservas/mis-reservas');
    }

    await reserva.update({ estado: 'cancelada' });
    await reserva.horario.update({ disponible: true });

    req.flash('success', 'Reserva cancelada.');
    res.redirect('/reservas/mis-reservas');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al cancelar la reserva.');
    res.redirect('/reservas/mis-reservas');
  }
});

module.exports = router;
