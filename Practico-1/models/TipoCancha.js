const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TipoCancha = sequelize.define('TipoCancha', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'tipos_cancha',
  timestamps: true,
});

module.exports = TipoCancha;
