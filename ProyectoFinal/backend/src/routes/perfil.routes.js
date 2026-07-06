const express = require('express');
const { body } = require('express-validator');
const validar = require('../middleware/validar');
const { verificarToken } = require('../middleware/auth');
const { obtenerPerfil, actualizarPerfil } = require('../controllers/perfilController');

const router = express.Router();

// Todas las rutas de perfil requieren estar autenticado.
router.use(verificarToken);

// GET /api/perfil
router.get('/', obtenerPerfil);

// PUT /api/perfil
router.put(
  '/',
  [
    body('nombre').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío'),
    body('email').optional().isEmail().withMessage('Correo inválido'),
    body('contrasena').optional().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  ],
  validar,
  actualizarPerfil
);

module.exports = router;
