const { validationResult } = require('express-validator');

// Middleware que revisa el resultado de las validaciones de express-validator.
// Si hay errores, responde 400 con la lista de mensajes.
const validar = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      mensaje: 'Datos inválidos',
      errores: errores.array().map((e) => ({ campo: e.path, mensaje: e.msg })),
    });
  }
  next();
};

module.exports = validar;
