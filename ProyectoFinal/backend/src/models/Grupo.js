const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Grupo privado de quiniela. Tiene un código de invitación para que otros se unan.
const Grupo = sequelize.define('Grupo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  codigo_invitacion: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  // Usuario que creó el grupo.
  creador_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id',
    },
  },
}, {
  tableName: 'grupos',
  timestamps: true,
});

module.exports = Grupo;
