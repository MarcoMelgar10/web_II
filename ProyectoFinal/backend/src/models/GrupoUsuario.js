const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Tabla intermedia: relaciona qué usuarios pertenecen a qué grupos (muchos a muchos).
const GrupoUsuario = sequelize.define('GrupoUsuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  grupo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'grupos',
      key: 'id',
    },
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id',
    },
  },
}, {
  tableName: 'grupo_usuarios',
  timestamps: true,
  // Un usuario no puede estar dos veces en el mismo grupo.
  indexes: [
    { unique: true, fields: ['grupo_id', 'usuario_id'] },
  ],
});

module.exports = GrupoUsuario;
