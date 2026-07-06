const bcrypt = require('bcryptjs');
const { Usuario } = require('../models');
const { datosPublicos } = require('./authController');

// GET /api/perfil  -> datos del usuario autenticado.
const obtenerPerfil = async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json(datosPublicos(usuario));
  } catch (error) {
    next(error);
  }
};

// PUT /api/perfil  -> actualiza nombre, email y/o contraseña.
const actualizarPerfil = async (req, res, next) => {
  try {
    const { nombre, email, contrasena } = req.body;
    const usuario = await Usuario.findByPk(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Si cambia el email, verificar que no esté usado por otra cuenta.
    if (email && email !== usuario.email) {
      const existe = await Usuario.findOne({ where: { email } });
      if (existe) {
        return res.status(409).json({ mensaje: 'Ese correo ya está en uso' });
      }
      usuario.email = email;
    }

    if (nombre) usuario.nombre = nombre;
    if (contrasena) usuario.contrasena = await bcrypt.hash(contrasena, 10);

    await usuario.save();
    res.json(datosPublicos(usuario));
  } catch (error) {
    next(error);
  }
};

module.exports = { obtenerPerfil, actualizarPerfil };
