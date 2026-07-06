const express = require('express');
const { verificarToken } = require('../middleware/auth');
const sedes = require('../seed/sedes');

const router = express.Router();

// GET /api/sedes  -> lista de sedes oficiales del Mundial 2026 (para el mapa).
router.get('/', verificarToken, (req, res) => {
  res.json(sedes);
});

module.exports = router;
