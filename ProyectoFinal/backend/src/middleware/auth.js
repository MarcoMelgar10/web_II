const jwt = require('jsonwebtoken');

// Verifica el token JWT que llega en el header "Authorization: Bearer <token>".
// Si es válido, guarda los datos del usuario en req.usuario y deja continuar.
const verificarToken = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'No autorizado: falta el token' });
  }

  const token = header.split(' ')[1];

  try {
    const datos = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = { id: datos.id, rol: datos.rol };
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'No autorizado: token inválido o expirado' });
  }
};

// Solo deja pasar a los administradores. Se usa después de verificarToken.
const esAdmin = (req, res, next) => {
  if (req.usuario && req.usuario.rol === 'admin') {
    return next();
  }
  return res.status(403).json({ mensaje: 'Acceso denegado: se requiere rol de administrador' });
};

module.exports = { verificarToken, esAdmin };
