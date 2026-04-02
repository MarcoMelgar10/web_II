const express = require('express');
const router = express.Router();
const { Usuario } = require('../models');

router.get('/login', (req, res) => {
  if (req.session.usuarioId) {
    if (req.session.usuarioRol === 'admin') return res.redirect('/admin');
    return res.redirect('/canchas');
  }
  res.render('auth/login', { title: 'Login' });
});

router.post('/login', async (req, res) => {
  const { email, contrasena } = req.body;
  const usuario = await Usuario.findOne({ where: { email } });

  if (!usuario || usuario.contrasena !== contrasena) {
    return res.redirect('/auth/login');
  }

  req.session.usuarioId = usuario.id;
  req.session.usuarioNombre = usuario.nombre;
  req.session.usuarioRol = usuario.rol;

  if (usuario.rol === 'admin') return res.redirect('/admin');
  res.redirect('/canchas');
});

router.get('/register', (req, res) => {
  if (req.session.usuarioId) return res.redirect('/canchas');
  res.render('auth/register', { title: 'Registro' });
});

router.post('/register', async (req, res) => {
  const { nombre, email, contrasena } = req.body;

  await Usuario.create({ nombre, email, contrasena, rol: 'cliente' });

  const usuario = await Usuario.findOne({ where: { email } });
  req.session.usuarioId = usuario.id;
  req.session.usuarioNombre = usuario.nombre;
  req.session.usuarioRol = usuario.rol;

  res.redirect('/canchas');
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

module.exports = router;
