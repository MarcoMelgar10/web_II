const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cancha = sequelize.define('Cancha', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tipos_cancha',
      key: 'id',
    },
  },
  precio_por_hora: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('activa', 'inactiva'),
    defaultValue: 'activa',
    allowNull: false,
  },
}, {
  tableName: 'canchas',
  timestamps: true,
});

module.exports = Cancha;
