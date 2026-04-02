const express = require('express');
const router = express.Router();
const { Cancha, TipoCancha, Horario, Resena, Usuario } = require('../models');

router.get('/', async (req, res) => {
  const canchas = await Cancha.findAll({
    where: { estado: 'activa' },
    include: [{ model: TipoCancha, as: 'tipo' }],
    order: [['nombre', 'ASC']],
  });
  res.render('canchas/index', { title: 'Canchas', canchas });
});

router.get('/:id', async (req, res) => {
  const fecha = req.query.fecha || new Date().toISOString().split('T')[0];

  const cancha = await Cancha.findByPk(req.params.id, {
    include: [{ model: TipoCancha, as: 'tipo' }],
  });

  const horarios = await Horario.findAll({
    where: { cancha_id: req.params.id, fecha, disponible: true },
    order: [['hora_inicio', 'ASC']],
  });

  const resenas = await Resena.findAll({
    where: { cancha_id: req.params.id },
    include: [{ model: Usuario, as: 'usuario', attributes: ['nombre'] }],
    order: [['createdAt', 'DESC']],
  });

  res.render('canchas/show', { title: cancha.nombre, cancha, horarios, resenas, fechaSeleccionada: fecha });
});

module.exports = router;
