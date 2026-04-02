const express = require('express');
const router = express.Router();
const { Resena, Reserva, Horario, Cancha, TipoCancha } = require('../models');
const { isAuthenticated } = require('../middleware/auth');

router.get('/create/:reservaId', isAuthenticated, async (req, res) => {
  const reserva = await Reserva.findByPk(req.params.reservaId, {
    include: [{
      model: Horario,
      as: 'horario',
      include: [{ model: Cancha, as: 'cancha', include: [{ model: TipoCancha, as: 'tipo' }] }],
    }],
  });
  res.render('resenas/create', { title: 'Dejar Reseña', reserva });
});

router.post('/', isAuthenticated, async (req, res) => {
  const { reserva_id, calificacion, comentario } = req.body;

  const reserva = await Reserva.findByPk(reserva_id, {
    include: [{ model: Horario, as: 'horario' }],
  });

  await Resena.create({
    usuario_id: req.session.usuarioId,
    cancha_id: reserva.horario.cancha_id,
    calificacion: parseInt(calificacion),
    comentario: comentario || null,
  });

  res.redirect('/reservas/mis-reservas');
});

module.exports = router;
