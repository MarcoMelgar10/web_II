const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Grupo = require('./Grupo');
const GrupoUsuario = require('./GrupoUsuario');
const Partido = require('./Partido');
const Pronostico = require('./Pronostico');

// --- Relaciones entre los modelos ---

// Un usuario crea muchos grupos (es el dueño/creador).
Usuario.hasMany(Grupo, { foreignKey: 'creador_id', as: 'gruposCreados' });
Grupo.belongsTo(Usuario, { foreignKey: 'creador_id', as: 'creador' });

// Muchos a muchos: un usuario pertenece a muchos grupos y un grupo tiene muchos miembros.
Usuario.belongsToMany(Grupo, {
  through: GrupoUsuario,
  foreignKey: 'usuario_id',
  otherKey: 'grupo_id',
  as: 'grupos',
});
Grupo.belongsToMany(Usuario, {
  through: GrupoUsuario,
  foreignKey: 'grupo_id',
  otherKey: 'usuario_id',
  as: 'miembros',
});

// Un usuario hace muchos pronósticos.
Usuario.hasMany(Pronostico, { foreignKey: 'usuario_id', as: 'pronosticos', onDelete: 'CASCADE' });
Pronostico.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

// Un partido tiene muchos pronósticos.
Partido.hasMany(Pronostico, { foreignKey: 'partido_id', as: 'pronosticos', onDelete: 'CASCADE' });
Pronostico.belongsTo(Partido, { foreignKey: 'partido_id', as: 'partido' });

module.exports = { sequelize, Usuario, Grupo, GrupoUsuario, Partido, Pronostico };
