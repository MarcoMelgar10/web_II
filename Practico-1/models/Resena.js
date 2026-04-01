const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Resena = sequelize.define('Resena', {
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
  cancha_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'canchas',
      key: 'id',
    },
  },
  calificacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  comentario: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'resenas',
  timestamps: true,
});

module.exports = Resena;
