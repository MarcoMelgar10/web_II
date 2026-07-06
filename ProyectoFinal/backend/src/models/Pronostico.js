const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Pronóstico de un usuario para un partido (marcador que cree que terminará).
const Pronostico = sequelize.define('Pronostico', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id',
    },
  },
  partido_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'partidos',
      key: 'id',
    },
  },
  goles_local: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  goles_visitante: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // Puntos ganados una vez finalizado el partido (se calculan automáticamente).
  puntos_obtenidos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'pronosticos',
  timestamps: true,
  // Un usuario solo puede tener un pronóstico por partido.
  indexes: [
    { unique: true, fields: ['usuario_id', 'partido_id'] },
  ],
});

module.exports = Pronostico;
