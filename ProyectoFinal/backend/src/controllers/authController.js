const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

// Crea el token JWT con el id y el rol del usuario.
const generarToken = (usuario) => {
  return jwt.sign(
    { id: usuario.id, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || '7d' }
  );
};

// Devuelve los datos públicos del usuario (sin la contraseña).
const datosPublicos = (usuario) => ({
  id: usuario.id,
  nombre: usuario.nombre,
  email: usuario.email,
  rol: usuario.rol,
});

// POST /api/auth/register  -> registra un visitante como usuario.
const register = async (req, res, next) => {
  try {
    const { nombre, email, contrasena } = req.body;

    const existe = await Usuario.findOne({ where: { email } });
    if (existe) {
      return res.status(409).json({ mensaje: 'Ya existe una cuenta con ese correo' });
    }

    const hash = await bcrypt.hash(contrasena, 10);
    const usuario = await Usuario.create({ nombre, email, contrasena: hash });

    const token = generarToken(usuario);
    res.status(201).json({ token, usuario: datosPublicos(usuario) });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login  -> inicia sesión con email y contraseña.
const login = async (req, res, next) => {
  try {
    const { email, contrasena } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
    }

    const coincide = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!coincide) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
    }

    const token = generarToken(usuario);
    res.json({ token, usuario: datosPublicos(usuario) });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, datosPublicos };
