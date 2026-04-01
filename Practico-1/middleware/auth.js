const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.usuarioId) {
    return next();
  }
  req.flash('error', 'Debes iniciar sesión para acceder a esta página.');
  res.redirect('/auth/login');
};

const isAdmin = (req, res, next) => {
  if (req.session && req.session.usuarioId && req.session.usuarioRol === 'admin') {
    return next();
  }
  req.flash('error', 'No tienes permiso para acceder a esta sección.');
  res.redirect('/');
};

const isCliente = (req, res, next) => {
  if (req.session && req.session.usuarioId && req.session.usuarioRol === 'cliente') {
    return next();
  }
  req.flash('error', 'Esta sección es solo para clientes.');
  res.redirect('/');
};

module.exports = { isAuthenticated, isAdmin, isCliente };
