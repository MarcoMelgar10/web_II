const express = require('express');
const router = express.Router();
const { Cancha, TipoCancha, Horario, Reserva, Resena, Usuario } = require('../models');
const { isAdmin } = require('../middleware/auth');

router.use(isAdmin);

router.get('/', async (req, res) => {
  try {
    const totalCanchas = await Cancha.count();
    const totalUsuarios = await Usuario.count({ where: { rol: 'cliente' } });
    const totalReservas = await Reserva.count();
    const reservasConfirmadas = await Reserva.count({ where: { estado: 'confirmada' } });

    res.render('admin/dashboard', {
      title: 'Panel de Administración',
      stats: { totalCanchas, totalUsuarios, totalReservas, reservasConfirmadas },
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al cargar el dashboard.');
    res.redirect('/');
  }
});

router.get('/tipos', async (req, res) => {
  try {
    const tipos = await TipoCancha.findAll({
      include: [{ model: Cancha, as: 'canchas' }],
      order: [['nombre', 'ASC']],
    });

    res.render('admin/tipos/index', { title: 'Tipos de Cancha', tipos });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al cargar los tipos.');
    res.redirect('/admin');
  }
});

router.get('/tipos/create', (req, res) => {
  res.render('admin/tipos/create', { title: 'Nuevo Tipo de Cancha' });
});

router.post('/tipos', async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre || nombre.trim() === '') {
      req.flash('error', 'El nombre es requerido.');
      return res.redirect('/admin/tipos/create');
    }

    await TipoCancha.create({ nombre: nombre.trim() });
    req.flash('success', 'Tipo de cancha creado.');
    res.redirect('/admin/tipos');
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      req.flash('error', 'Ya existe un tipo con ese nombre.');
    } else {
      req.flash('error', 'Error al crear el tipo.');
    }
    res.redirect('/admin/tipos/create');
  }
});

router.delete('/tipos/:id', async (req, res) => {
  try {
    const tipo = await TipoCancha.findByPk(req.params.id);

    if (!tipo) {
      req.flash('error', 'Tipo no encontrado.');
      return res.redirect('/admin/tipos');
    }

    const canchasAsociadas = await Cancha.count({ where: { tipo_id: req.params.id } });
    if (canchasAsociadas > 0) {
      req.flash('error', 'No se puede eliminar un tipo que tiene canchas asociadas.');
      return res.redirect('/admin/tipos');
    }

    await tipo.destroy();
    req.flash('success', 'Tipo eliminado.');
    res.redirect('/admin/tipos');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al eliminar el tipo.');
    res.redirect('/admin/tipos');
  }
});

router.get('/canchas', async (req, res) => {
  try {
    const canchas = await Cancha.findAll({
      include: [{ model: TipoCancha, as: 'tipo' }],
      order: [['nombre', 'ASC']],
    });

    res.render('admin/canchas/index', { title: 'Gestión de Canchas', canchas });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al cargar las canchas.');
    res.redirect('/admin');
  }
});

router.get('/canchas/create', async (req, res) => {
  try {
    const tipos = await TipoCancha.findAll({ order: [['nombre', 'ASC']] });
    res.render('admin/canchas/create', { title: 'Nueva Cancha', tipos });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al cargar el formulario.');
    res.redirect('/admin/canchas');
  }
});

router.post('/canchas', async (req, res) => {
  try {
    const { nombre, tipo_id, precio_por_hora, estado } = req.body;

    if (!nombre || !tipo_id || !precio_por_hora) {
      req.flash('error', 'Todos los campos son requeridos.');
      return res.redirect('/admin/canchas/create');
    }

    await Cancha.create({
      nombre: nombre.trim(),
      tipo_id,
      precio_por_hora: parseFloat(precio_por_hora),
      estado: estado || 'activa',
    });

    req.flash('success', 'Cancha creada.');
    res.redirect('/admin/canchas');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al crear la cancha.');
    res.redirect('/admin/canchas/create');
  }
});

router.get('/canchas/:id/edit', async (req, res) => {
  try {
    const cancha = await Cancha.findByPk(req.params.id, {
      include: [{ model: TipoCancha, as: 'tipo' }],
    });

    if (!cancha) {
      req.flash('error', 'Cancha no encontrada.');
      return res.redirect('/admin/canchas');
    }

    const tipos = await TipoCancha.findAll({ order: [['nombre', 'ASC']] });
    res.render('admin/canchas/edit', { title: 'Editar Cancha', cancha, tipos });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al cargar la cancha.');
    res.redirect('/admin/canchas');
  }
});

router.put('/canchas/:id', async (req, res) => {
  try {
    const cancha = await Cancha.findByPk(req.params.id);

    if (!cancha) {
      req.flash('error', 'Cancha no encontrada.');
      return res.redirect('/admin/canchas');
    }

    const { nombre, tipo_id, precio_por_hora, estado } = req.body;

    if (!nombre || !tipo_id || !precio_por_hora) {
      req.flash('error', 'Todos los campos son requeridos.');
      return res.redirect(`/admin/canchas/${req.params.id}/edit`);
    }

    await cancha.update({
      nombre: nombre.trim(),
      tipo_id,
      precio_por_hora: parseFloat(precio_por_hora),
      estado: estado || 'activa',
    });

    req.flash('success', 'Cancha actualizada.');
    res.redirect('/admin/canchas');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al actualizar la cancha.');
    res.redirect(`/admin/canchas/${req.params.id}/edit`);
  }
});

router.delete('/canchas/:id', async (req, res) => {
  try {
    const cancha = await Cancha.findByPk(req.params.id);

    if (!cancha) {
      req.flash('error', 'Cancha no encontrada.');
      return res.redirect('/admin/canchas');
    }

    await cancha.destroy();
    req.flash('success', 'Cancha eliminada.');
    res.redirect('/admin/canchas');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al eliminar la cancha.');
    res.redirect('/admin/canchas');
  }
});

router.get('/horarios', async (req, res) => {
  try {
    const { cancha_id, fecha } = req.query;
    const where = {};

    if (cancha_id) where.cancha_id = cancha_id;
    if (fecha) where.fecha = fecha;

    const horarios = await Horario.findAll({
      where,
      include: [{
        model: Cancha,
        as: 'cancha',
        include: [{ model: TipoCancha, as: 'tipo' }],
      }],
      order: [['fecha', 'DESC'], ['hora_inicio', 'ASC']],
    });

    const canchas = await Cancha.findAll({ order: [['nombre', 'ASC']] });

    res.render('admin/horarios/index', {
      title: 'Gestión de Horarios',
      horarios,
      canchas,
      filtros: { cancha_id: cancha_id || '', fecha: fecha || '' },
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al cargar los horarios.');
    res.redirect('/admin');
  }
});

router.get('/horarios/create', async (req, res) => {
  try {
    const canchas = await Cancha.findAll({
      where: { estado: 'activa' },
      order: [['nombre', 'ASC']],
    });

    res.render('admin/horarios/create', { title: 'Nuevo Horario', canchas });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al cargar el formulario.');
    res.redirect('/admin/horarios');
  }
});

router.post('/horarios', async (req, res) => {
  try {
    const { cancha_id, fecha, hora_inicio, hora_fin } = req.body;

    if (!cancha_id || !fecha || !hora_inicio || !hora_fin) {
      req.flash('error', 'Todos los campos son requeridos.');
      return res.redirect('/admin/horarios/create');
    }

    if (hora_inicio >= hora_fin) {
      req.flash('error', 'La hora de inicio debe ser anterior a la hora de fin.');
      return res.redirect('/admin/horarios/create');
    }

    const existente = await Horario.findOne({
      where: { cancha_id, fecha, hora_inicio },
    });

    if (existente) {
      req.flash('error', 'Ya existe un horario para esa cancha, fecha y hora.');
      return res.redirect('/admin/horarios/create');
    }

    await Horario.create({ cancha_id, fecha, hora_inicio, hora_fin, disponible: true });

    req.flash('success', 'Horario creado.');
    res.redirect('/admin/horarios');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al crear el horario.');
    res.redirect('/admin/horarios/create');
  }
});

router.delete('/horarios/:id', async (req, res) => {
  try {
    const horario = await Horario.findByPk(req.params.id);

    if (!horario) {
      req.flash('error', 'Horario no encontrado.');
      return res.redirect('/admin/horarios');
    }

    await horario.destroy();
    req.flash('success', 'Horario eliminado.');
    res.redirect('/admin/horarios');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al eliminar el horario.');
    res.redirect('/admin/horarios');
  }
});

router.get('/reservas', async (req, res) => {
  try {
    const reservas = await Reserva.findAll({
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] },
        {
          model: Horario,
          as: 'horario',
          include: [{
            model: Cancha,
            as: 'cancha',
            include: [{ model: TipoCancha, as: 'tipo' }],
          }],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.render('admin/reservas/index', { title: 'Gestión de Reservas', reservas });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al cargar las reservas.');
    res.redirect('/admin');
  }
});

router.put('/reservas/:id/estado', async (req, res) => {
  try {
    const reserva = await Reserva.findByPk(req.params.id, {
      include: [{ model: Horario, as: 'horario' }],
    });

    if (!reserva) {
      req.flash('error', 'Reserva no encontrada.');
      return res.redirect('/admin/reservas');
    }

    const { estado } = req.body;

    if (!['confirmada', 'cancelada'].includes(estado)) {
      req.flash('error', 'Estado inválido.');
      return res.redirect('/admin/reservas');
    }

    const estadoAnterior = reserva.estado;
    await reserva.update({ estado });

    if (estadoAnterior === 'confirmada' && estado === 'cancelada') {
      await reserva.horario.update({ disponible: true });
    } else if (estadoAnterior === 'cancelada' && estado === 'confirmada') {
      await reserva.horario.update({ disponible: false });
    }

    req.flash('success', `Estado actualizado a "${estado}".`);
    res.redirect('/admin/reservas');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al actualizar el estado.');
    res.redirect('/admin/reservas');
  }
});

module.exports = router;
