const express = require('express');
const { body } = require('express-validator');
const validar = require('../middleware/validar');
const { verificarToken } = require('../middleware/auth');
const {
  crearPronostico, actualizarPronostico, misPronosticos,
} = require('../controllers/pronosticoController');

const router = express.Router();

router.use(verificarToken);

// Reglas: los goles deben ser enteros >= 0.
const reglasPronostico = [
  body('goles_local').isInt({ min: 0 }).withMessage('Los goles locales deben ser un número >= 0'),
  body('goles_visitante').isInt({ min: 0 }).withMessage('Los goles visitantes deben ser un número >= 0'),
];

// GET /api/pronosticos  -> mis pronósticos
router.get('/', misPronosticos);

// POST /api/pronosticos
router.post(
  '/',
  [body('partido_id').isInt().withMessage('Partido inválido'), ...reglasPronostico],
  validar,
  crearPronostico
);

// PUT /api/pronosticos/:id
router.put('/:id', reglasPronostico, validar, actualizarPronostico);

module.exports = router;
