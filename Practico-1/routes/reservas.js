const express = require('express');
const router = express.Router();
const { Reserva, Horario, Cancha, TipoCancha } = require('../models');
const { isAuthenticated } = require('../middleware/auth');

router.get('/mis-reservas', isAuthenticated, async (req, res) => {
  const reservas = await Reserva.findAll({
    where: { usuario_id: req.session.usuarioId },
    include: [{
      model: Horario,
      as: 'horario',
      include: [{ model: Cancha, as: 'cancha', include: [{ model: TipoCancha, as: 'tipo' }] }],
    }],
    order: [['createdAt', 'DESC']],
  });

  res.render('reservas/mis-reservas', { title: 'Mis Reservas', reservas });
});

router.post('/', isAuthenticated, async (req, res) => {
  const { horario_id } = req.body;

  const horario = await Horario.findByPk(horario_id);

  await Reserva.create({
    usuario_id: req.session.usuarioId,
    horario_id,
    estado: 'confirmada',
  });

  await horario.update({ disponible: false });

  res.redirect('/reservas/mis-reservas');
});

router.post('/:id/cancelar', isAuthenticated, async (req, res) => {
  const reserva = await Reserva.findByPk(req.params.id, {
    include: [{ model: Horario, as: 'horario' }],
  });

  await reserva.update({ estado: 'cancelada' });
  await reserva.horario.update({ disponible: true });

  res.redirect('/reservas/mis-reservas');
});

module.exports = router;
