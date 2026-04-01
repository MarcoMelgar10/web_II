const express = require('express');
const router = express.Router();
const { Resena, Reserva, Horario, Cancha, TipoCancha } = require('../models');
const { isAuthenticated } = require('../middleware/auth');

router.get('/create/:reservaId', isAuthenticated, async (req, res) => {
  try {
    const reserva = await Reserva.findOne({
      where: { id: req.params.reservaId, usuario_id: req.session.usuarioId },
      include: [{
        model: Horario,
        as: 'horario',
        include: [{ model: Cancha, as: 'cancha', include: [{ model: TipoCancha, as: 'tipo' }] }],
      }],
    });

    if (!reserva) {
      req.flash('error', 'Reserva no encontrada.');
      return res.redirect('/reservas/mis-reservas');
    }

    if (reserva.estado !== 'confirmada') {
      req.flash('error', 'Solo podés dejar reseñas de reservas confirmadas.');
      return res.redirect('/reservas/mis-reservas');
    }

    const hoy = new Date().toISOString().split('T')[0];
    if (reserva.horario.fecha >= hoy) {
      req.flash('error', 'Solo podés dejar reseñas de reservas pasadas.');
      return res.redirect('/reservas/mis-reservas');
    }

    const resenaExistente = await Resena.findOne({
      where: { usuario_id: req.session.usuarioId, cancha_id: reserva.horario.cancha_id },
    });

    if (resenaExistente) {
      req.flash('error', 'Ya dejaste una reseña para esta cancha.');
      return res.redirect('/reservas/mis-reservas');
    }

    res.render('resenas/create', { title: 'Dejar Reseña', reserva });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al cargar el formulario.');
    res.redirect('/reservas/mis-reservas');
  }
});

router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { reserva_id, calificacion, comentario } = req.body;

    const reserva = await Reserva.findOne({
      where: { id: reserva_id, usuario_id: req.session.usuarioId },
      include: [{ model: Horario, as: 'horario' }],
    });

    if (!reserva) {
      req.flash('error', 'Reserva no encontrada.');
      return res.redirect('/reservas/mis-reservas');
    }

    if (reserva.estado !== 'confirmada') {
      req.flash('error', 'Solo podés dejar reseñas de reservas confirmadas.');
      return res.redirect('/reservas/mis-reservas');
    }

    const hoy = new Date().toISOString().split('T')[0];
    if (reserva.horario.fecha >= hoy) {
      req.flash('error', 'Solo podés dejar reseñas de reservas pasadas.');
      return res.redirect('/reservas/mis-reservas');
    }

    const calificacionNum = parseInt(calificacion);
    if (isNaN(calificacionNum) || calificacionNum < 1 || calificacionNum > 5) {
      req.flash('error', 'La calificación debe estar entre 1 y 5.');
      return res.redirect(`/resenas/create/${reserva_id}`);
    }

    await Resena.create({
      usuario_id: req.session.usuarioId,
      cancha_id: reserva.horario.cancha_id,
      calificacion: calificacionNum,
      comentario: comentario || null,
    });

    req.flash('success', 'Reseña enviada.');
    res.redirect('/reservas/mis-reservas');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al enviar la reseña.');
    res.redirect('/reservas/mis-reservas');
  }
});

module.exports = router;
