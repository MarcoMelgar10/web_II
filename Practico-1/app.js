require('dotenv').config();

const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
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
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    secure: false,
  },
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.successMessages = req.flash('success');
  res.locals.errorMessages = req.flash('error');
  res.locals.usuario = req.session.usuarioId
    ? {
        id: req.session.usuarioId,
        nombre: req.session.usuarioNombre,
        rol: req.session.usuarioRol,
      }
    : null;
  next();
});

app.get('/', async (req, res) => {
  try {
    const { literal } = require('sequelize');

    const canchas = await Cancha.findAll({
      where: { estado: 'activa' },
      include: [{ model: TipoCancha, as: 'tipo' }],
      attributes: {
        include: [
          [literal('(SELECT AVG(calificacion) FROM resenas WHERE resenas.cancha_id = Cancha.id)'), 'promedio_calificacion'],
          [literal('(SELECT COUNT(*) FROM resenas WHERE resenas.cancha_id = Cancha.id)'), 'total_resenas'],
        ],
      },
      order: [['nombre', 'ASC']],
      limit: 6,
    });

    res.render('index', { title: 'Inicio', canchas });
  } catch (error) {
    console.error(error);
    res.render('index', { title: 'Inicio', canchas: [] });
  }
});

app.use('/auth', authRoutes);
app.use('/canchas', canchasRoutes);
app.use('/reservas', reservasRoutes);
app.use('/resenas', resenasRoutes);
app.use('/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).render('404', { title: 'Página no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err);
  req.flash('error', 'Ocurrió un error inesperado.');
  res.redirect('/');
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida.');

    await sequelize.sync({ force: false });
    console.log('Modelos sincronizados.');

    await seedData();

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    const adminExiste = await Usuario.findOne({ where: { rol: 'admin' } });
    if (!adminExiste) {
      await Usuario.create({
        nombre: 'Administrador',
        email: 'admin@admin.com',
        contrasena: 'admin123',
        rol: 'admin',
      });
      console.log('Usuario admin creado: admin@admin.com / admin123');
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

      const canchasExisten = await Cancha.count();
      if (canchasExisten === 0) {
        await Cancha.bulkCreate([
          { nombre: 'Cancha Fútbol 5 - A', tipo_id: tipos[0].id, precio_por_hora: 1500, estado: 'activa' },
          { nombre: 'Cancha Fútbol 5 - B', tipo_id: tipos[0].id, precio_por_hora: 1500, estado: 'activa' },
          { nombre: 'Cancha Fútbol 7 - Principal', tipo_id: tipos[1].id, precio_por_hora: 2500, estado: 'activa' },
          { nombre: 'Cancha de Tenis - 1', tipo_id: tipos[2].id, precio_por_hora: 800, estado: 'activa' },
          { nombre: 'Cancha de Pádel - 1', tipo_id: tipos[3].id, precio_por_hora: 1000, estado: 'activa' },
        ]);
      }
    }
  } catch (error) {
    console.error('Error en seed:', error);
  }
};

startServer();
