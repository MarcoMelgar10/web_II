const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Partido del Mundial. El resultado (goles) se obtiene de la API, no se edita a mano.
const Partido = sequelize.define('Partido', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  equipo_local: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  equipo_visitante: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  // Fase del torneo: grupos, dieciseisavos, octavos, cuartos, semifinal, tercer_puesto, final.
  fase: {
    type: DataTypes.ENUM(
      'grupos',
      'dieciseisavos',
      'octavos',
      'cuartos',
      'semifinal',
      'tercer_puesto',
      'final'
    ),
    allowNull: false,
    defaultValue: 'grupos',
  },
  estado: {
    type: DataTypes.ENUM('programado', 'en_curso', 'finalizado'),
    allowNull: false,
    defaultValue: 'programado',
  },
  estadio: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ciudad: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  latitud: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  longitud: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  goles_local: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  goles_visitante: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  // Id del evento en thesportsdb para poder sincronizar el marcador.
  id_api: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'partidos',
  timestamps: true,
});

module.exports = Partido;
