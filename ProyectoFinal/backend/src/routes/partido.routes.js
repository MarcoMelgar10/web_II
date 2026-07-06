const express = require('express');
const { body } = require('express-validator');
const validar = require('../middleware/validar');
const { verificarToken, esAdmin } = require('../middleware/auth');
const {
  listarPartidos, detallePartido, crearPartido, actualizarPartido,
} = require('../controllers/partidoController');

const router = express.Router();

// Consultar partidos: cualquier usuario autenticado.
router.use(verificarToken);

// GET /api/partidos  (filtros ?fase= &fecha= &estado=)
router.get('/', listarPartidos);

// GET /api/partidos/:id
router.get('/:id', detallePartido);

// Reglas de validación para crear/editar (las usan admin).
const reglasPartido = [
  body('equipo_local').trim().notEmpty().withMessage('El equipo local es obligatorio'),
  body('equipo_visitante').trim().notEmpty().withMessage('El equipo visitante es obligatorio'),
  body('fecha').notEmpty().withMessage('La fecha es obligatoria'),
  body('fase').optional().isIn(
    ['grupos', 'dieciseisavos', 'octavos', 'cuartos', 'semifinal', 'tercer_puesto', 'final']
  ).withMessage('Fase inválida'),
];

// POST /api/partidos  (solo admin)
router.post('/', esAdmin, reglasPartido, validar, crearPartido);

// PUT /api/partidos/:id  (solo admin)
router.put('/:id', esAdmin, actualizarPartido);

module.exports = router;
