const express = require('express');
const { verificarToken } = require('../middleware/auth');
const { obtenerResumen } = require('../controllers/dashboardController');

const router = express.Router();

// GET /api/dashboard  -> resumen del usuario autenticado
router.get('/', verificarToken, obtenerResumen);

module.exports = router;
