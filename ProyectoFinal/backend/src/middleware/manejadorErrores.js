// Middleware central de errores. Captura cualquier error no controlado y responde JSON.
const manejadorErrores = (err, req, res, next) => {
  console.error('Error:', err.message);
  const status = err.status || 500;
  res.status(status).json({
    mensaje: err.mensaje || err.message || 'Error interno del servidor',
  });
};

module.exports = manejadorErrores;
