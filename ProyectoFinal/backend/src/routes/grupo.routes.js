const express = require('express');
const { body } = require('express-validator');
const validar = require('../middleware/validar');
const { verificarToken } = require('../middleware/auth');
const {
  crearGrupo, misGrupos, detalleGrupo,
  participantes, clasificacion, unirse,
} = require('../controllers/grupoController');

const router = express.Router();

// Todas las rutas de grupos requieren autenticación.
router.use(verificarToken);

// POST /api/grupos  -> crear grupo
router.post(
  '/',
  [body('nombre').trim().notEmpty().withMessage('El nombre del grupo es obligatorio')],
  validar,
  crearGrupo
);

// POST /api/grupos/unirse  -> unirse con código (antes de las rutas con :id)
router.post(
  '/unirse',
  [body('codigo').trim().notEmpty().withMessage('El código es obligatorio')],
  validar,
  unirse
);

// GET /api/grupos  -> mis grupos
router.get('/', misGrupos);

// GET /api/grupos/:id  -> detalle
router.get('/:id', detalleGrupo);

// GET /api/grupos/:id/participantes
router.get('/:id/participantes', participantes);

// GET /api/grupos/:id/clasificacion
router.get('/:id/clasificacion', clasificacion);

module.exports = router;
