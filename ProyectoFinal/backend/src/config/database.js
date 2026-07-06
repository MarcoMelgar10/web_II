const { Sequelize } = require('sequelize');
const path = require('path');

// Base de datos relacional SQLite (un solo archivo, sin instalar nada).
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', '..', 'database.sqlite'),
  logging: false,
});

module.exports = sequelize;
