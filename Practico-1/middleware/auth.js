const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.usuarioId) {
    return next();
  }
  res.redirect('/auth/login');
};

const isAdmin = (req, res, next) => {
  if (req.session && req.session.usuarioId && req.session.usuarioRol === 'admin') {
    return next();
  }
  if (req.session && req.session.usuarioId) {
    return res.redirect('/canchas');
  }
  res.redirect('/auth/login');
};

module.exports = { isAuthenticated, isAdmin };
