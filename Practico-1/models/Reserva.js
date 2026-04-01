const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reserva = sequelize.define('Reserva', {
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
  horario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'horarios',
      key: 'id',
    },
  },
  estado: {
    type: DataTypes.ENUM('confirmada', 'cancelada'),
    defaultValue: 'confirmada',
    allowNull: false,
  },
}, {
  tableName: 'reservas',
  timestamps: true,
});

module.exports = Reserva;
