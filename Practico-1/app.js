require('dotenv').config();

const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');

const { sequelize, Usuario, TipoCancha, Cancha } = require('./models');

const authRoutes = require('./routes/auth');
const canchasRoutes = require('./routes/canchas');
const reservasRoutes = require('./routes/reservas');
const resenasRoutes = require('./routes/resenas');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'clave-secreta',
  resave: false,
  saveUninitialized: false,
}));

app.use((req, res, next) => {
  res.locals.usuario = req.session.usuarioId
    ? { id: req.session.usuarioId, nombre: req.session.usuarioNombre, rol: req.session.usuarioRol }
    : null;
  next();
});

app.get('/', (req, res) => {
  if (req.session.usuarioId) {
    if (req.session.usuarioRol === 'admin') return res.redirect('/admin');
    return res.redirect('/canchas');
  }
  res.redirect('/auth/login');
});

app.use('/auth', authRoutes);
app.use('/canchas', canchasRoutes);
app.use('/reservas', reservasRoutes);
app.use('/resenas', resenasRoutes);
app.use('/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});

const startServer = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: false });

  await seedData();

  app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
  });
};

const seedData = async () => {
  const adminExiste = await Usuario.findOne({ where: { rol: 'admin' } });
  if (!adminExiste) {
    await Usuario.create({
      nombre: 'Administrador',
      email: 'admin@admin.com',
      contrasena: 'admin123',
      rol: 'admin',
    });
  }

  const tiposExisten = await TipoCancha.count();
  if (tiposExisten === 0) {
    const tipos = await TipoCancha.bulkCreate([
      { nombre: 'Fútbol 5' },
      { nombre: 'Fútbol 7' },
      { nombre: 'Tenis' },
      { nombre: 'Pádel' },
      { nombre: 'Básquet' },
      { nombre: 'Vóley' },
    ]);

    await Cancha.bulkCreate([
      { nombre: 'Cancha Fútbol 5 - A', tipo_id: tipos[0].id, precio_por_hora: 1500, estado: 'activa' },
      { nombre: 'Cancha Fútbol 5 - B', tipo_id: tipos[0].id, precio_por_hora: 1500, estado: 'activa' },
      { nombre: 'Cancha Fútbol 7 - Principal', tipo_id: tipos[1].id, precio_por_hora: 2500, estado: 'activa' },
      { nombre: 'Cancha de Tenis - 1', tipo_id: tipos[2].id, precio_por_hora: 800, estado: 'activa' },
      { nombre: 'Cancha de Pádel - 1', tipo_id: tipos[3].id, precio_por_hora: 1000, estado: 'activa' },
    ]);
  }
};

startServer();
