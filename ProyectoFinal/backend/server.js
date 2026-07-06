require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { sequelize } = require('./src/models');
const seedData = require('./src/seed/seed');
const { iniciarSincronizacion } = require('./src/services/sincronizacion');
const manejadorErrores = require('./src/middleware/manejadorErrores');

// Rutas
const authRoutes = require('./src/routes/auth.routes');
const perfilRoutes = require('./src/routes/perfil.routes');
const grupoRoutes = require('./src/routes/grupo.routes');
const partidoRoutes = require('./src/routes/partido.routes');
const pronosticoRoutes = require('./src/routes/pronostico.routes');
const dashboardRoutes = require('./src/routes/dashboard.routes');
const sedeRoutes = require('./src/routes/sede.routes');

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares globales
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

// Ruta de salud para comprobar que el servidor responde.
app.get('/api', (req, res) => {
  res.json({ mensaje: 'API Quiniela Mundial 2026 funcionando' });
});

// Montaje de rutas REST
app.use('/api/auth', authRoutes);
app.use('/api/perfil', perfilRoutes);
app.use('/api/grupos', grupoRoutes);
app.use('/api/partidos', partidoRoutes);
app.use('/api/pronosticos', pronosticoRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/sedes', sedeRoutes);

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

// Manejador central de errores (siempre al final)
app.use(manejadorErrores);

// Arranque del servidor
const iniciar = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    await seedData();
    iniciarSincronizacion();

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar el servidor:', error.message);
  }
};

iniciar();
