const express = require('express');
const router = express.Router();
const { Cancha, TipoCancha, Horario, Reserva, Resena, Usuario } = require('../models');
const { isAdmin } = require('../middleware/auth');

router.use(isAdmin);

router.get('/', async (req, res) => {
  const totalCanchas = await Cancha.count();
  const totalUsuarios = await Usuario.count({ where: { rol: 'cliente' } });
  const totalReservas = await Reserva.count();
  const reservasConfirmadas = await Reserva.count({ where: { estado: 'confirmada' } });

  res.render('admin/dashboard', {
    title: 'Admin',
    stats: { totalCanchas, totalUsuarios, totalReservas, reservasConfirmadas },
  });
});

router.get('/tipos', async (req, res) => {
  const tipos = await TipoCancha.findAll({
    include: [{ model: Cancha, as: 'canchas' }],
    order: [['nombre', 'ASC']],
  });
  res.render('admin/tipos/index', { title: 'Tipos de Cancha', tipos });
});

router.get('/tipos/create', (req, res) => {
  res.render('admin/tipos/create', { title: 'Nuevo Tipo' });
});

router.post('/tipos', async (req, res) => {
  await TipoCancha.create({ nombre: req.body.nombre });
  res.redirect('/admin/tipos');
});

router.get('/tipos/:id/edit', async (req, res) => {
  const tipo = await TipoCancha.findByPk(req.params.id);
  res.render('admin/tipos/edit', { title: 'Editar Tipo', tipo });
});

router.put('/tipos/:id', async (req, res) => {
  await TipoCancha.update({ nombre: req.body.nombre }, { where: { id: req.params.id } });
  res.redirect('/admin/tipos');
});

router.delete('/tipos/:id', async (req, res) => {
  await TipoCancha.destroy({ where: { id: req.params.id } });
  res.redirect('/admin/tipos');
});

router.get('/canchas', async (req, res) => {
  const canchas = await Cancha.findAll({
    include: [{ model: TipoCancha, as: 'tipo' }],
    order: [['nombre', 'ASC']],
  });
  res.render('admin/canchas/index', { title: 'Canchas', canchas });
});

router.get('/canchas/create', async (req, res) => {
  const tipos = await TipoCancha.findAll({ order: [['nombre', 'ASC']] });
  res.render('admin/canchas/create', { title: 'Nueva Cancha', tipos });
});

router.post('/canchas', async (req, res) => {
  const { nombre, tipo_id, precio_por_hora, estado } = req.body;
  await Cancha.create({
    nombre,
    tipo_id,
    precio_por_hora: parseFloat(precio_por_hora),
    estado: estado || 'activa',
  });
  res.redirect('/admin/canchas');
});

router.get('/canchas/:id/edit', async (req, res) => {
  const cancha = await Cancha.findByPk(req.params.id);
  const tipos = await TipoCancha.findAll({ order: [['nombre', 'ASC']] });
  res.render('admin/canchas/edit', { title: 'Editar Cancha', cancha, tipos });
});

router.put('/canchas/:id', async (req, res) => {
  const { nombre, tipo_id, precio_por_hora, estado } = req.body;
  await Cancha.update(
    { nombre, tipo_id, precio_por_hora: parseFloat(precio_por_hora), estado: estado || 'activa' },
    { where: { id: req.params.id } }
  );
  res.redirect('/admin/canchas');
});

router.delete('/canchas/:id', async (req, res) => {
  await Cancha.destroy({ where: { id: req.params.id } });
  res.redirect('/admin/canchas');
});

router.get('/horarios', async (req, res) => {
  const { cancha_id, fecha } = req.query;
  const where = {};
  if (cancha_id) where.cancha_id = cancha_id;
  if (fecha) where.fecha = fecha;

  const horarios = await Horario.findAll({
    where,
    include: [{ model: Cancha, as: 'cancha', include: [{ model: TipoCancha, as: 'tipo' }] }],
    order: [['fecha', 'DESC'], ['hora_inicio', 'ASC']],
  });

  const canchas = await Cancha.findAll({ order: [['nombre', 'ASC']] });

  res.render('admin/horarios/index', {
    title: 'Horarios',
    horarios,
    canchas,
    filtros: { cancha_id: cancha_id || '', fecha: fecha || '' },
  });
});

router.get('/horarios/create', async (req, res) => {
  const canchas = await Cancha.findAll({ where: { estado: 'activa' }, order: [['nombre', 'ASC']] });
  res.render('admin/horarios/create', { title: 'Nuevo Horario', canchas });
});

router.post('/horarios', async (req, res) => {
  const { cancha_id, fecha, hora_inicio, hora_fin } = req.body;
  await Horario.create({ cancha_id, fecha, hora_inicio, hora_fin, disponible: true });
  res.redirect('/admin/horarios');
});

router.delete('/horarios/:id', async (req, res) => {
  await Horario.destroy({ where: { id: req.params.id } });
  res.redirect('/admin/horarios');
});

router.get('/reservas', async (req, res) => {
  const reservas = await Reserva.findAll({
    include: [
      { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] },
      {
        model: Horario,
        as: 'horario',
        include: [{ model: Cancha, as: 'cancha', include: [{ model: TipoCancha, as: 'tipo' }] }],
      },
    ],
    order: [['createdAt', 'DESC']],
  });
  res.render('admin/reservas/index', { title: 'Reservas', reservas });
});

router.put('/reservas/:id/estado', async (req, res) => {
  const { estado } = req.body;
  const reserva = await Reserva.findByPk(req.params.id, {
    include: [{ model: Horario, as: 'horario' }],
  });

  await reserva.update({ estado });

  if (estado === 'cancelada') {
    await reserva.horario.update({ disponible: true });
  } else if (estado === 'confirmada') {
    await reserva.horario.update({ disponible: false });
  }

  res.redirect('/admin/reservas');
});

router.get('/resenas', async (req, res) => {
  const resenas = await Resena.findAll({
    include: [
      { model: Usuario, as: 'usuario', attributes: ['nombre', 'email'] },
      { model: Cancha, as: 'cancha', include: [{ model: TipoCancha, as: 'tipo' }] },
    ],
    order: [['createdAt', 'DESC']],
  });
  res.render('admin/resenas/index', { title: 'Reseñas', resenas });
});

module.exports = router;
