const express = require('express');
const router = express.Router();
const { Usuario } = require('../models');

router.get('/login', (req, res) => {
  if (req.session.usuarioId) return res.redirect('/');
  res.render('auth/login', { title: 'Iniciar Sesión' });
});

router.post('/login', async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
      req.flash('error', 'Completá todos los campos.');
      return res.redirect('/auth/login');
    }

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      req.flash('error', 'Email o contraseña incorrectos.');
      return res.redirect('/auth/login');
    }

    const valido = await usuario.validarContrasena(contrasena);
    if (!valido) {
      req.flash('error', 'Email o contraseña incorrectos.');
      return res.redirect('/auth/login');
    }

    req.session.usuarioId = usuario.id;
    req.session.usuarioNombre = usuario.nombre;
    req.session.usuarioRol = usuario.rol;

    req.flash('success', `Bienvenido/a, ${usuario.nombre}!`);

    if (usuario.rol === 'admin') return res.redirect('/admin');
    res.redirect('/');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al iniciar sesión.');
    res.redirect('/auth/login');
  }
});

router.get('/register', (req, res) => {
  if (req.session.usuarioId) return res.redirect('/');
  res.render('auth/register', { title: 'Registrarse' });
});

router.post('/register', async (req, res) => {
  try {
    const { nombre, email, contrasena, confirmar_contrasena } = req.body;

    if (!nombre || !email || !contrasena || !confirmar_contrasena) {
      req.flash('error', 'Completá todos los campos.');
      return res.redirect('/auth/register');
    }

    if (contrasena !== confirmar_contrasena) {
      req.flash('error', 'Las contraseñas no coinciden.');
      return res.redirect('/auth/register');
    }

    if (contrasena.length < 6) {
      req.flash('error', 'La contraseña debe tener al menos 6 caracteres.');
      return res.redirect('/auth/register');
    }

    const existente = await Usuario.findOne({ where: { email } });
    if (existente) {
      req.flash('error', 'Ya existe una cuenta con ese email.');
      return res.redirect('/auth/register');
    }

    const usuario = await Usuario.create({
      nombre,
      email,
      contrasena,
      rol: 'cliente',
    });

    req.session.usuarioId = usuario.id;
    req.session.usuarioNombre = usuario.nombre;
    req.session.usuarioRol = usuario.rol;

    req.flash('success', 'Cuenta creada exitosamente.');
    res.redirect('/');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al crear la cuenta.');
    res.redirect('/auth/register');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

module.exports = router;
