const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const TipoCancha = require('./TipoCancha');
const Cancha = require('./Cancha');
const Horario = require('./Horario');
const Reserva = require('./Reserva');
const Resena = require('./Resena');

TipoCancha.hasMany(Cancha, { foreignKey: 'tipo_id', as: 'canchas', onDelete: 'RESTRICT' });
Cancha.belongsTo(TipoCancha, { foreignKey: 'tipo_id', as: 'tipo' });

Cancha.hasMany(Horario, { foreignKey: 'cancha_id', as: 'horarios', onDelete: 'CASCADE' });
Horario.belongsTo(Cancha, { foreignKey: 'cancha_id', as: 'cancha' });

Cancha.hasMany(Resena, { foreignKey: 'cancha_id', as: 'resenas', onDelete: 'CASCADE' });
Resena.belongsTo(Cancha, { foreignKey: 'cancha_id', as: 'cancha' });

Horario.hasOne(Reserva, { foreignKey: 'horario_id', as: 'reserva', onDelete: 'CASCADE' });
Reserva.belongsTo(Horario, { foreignKey: 'horario_id', as: 'horario' });

Usuario.hasMany(Reserva, { foreignKey: 'usuario_id', as: 'reservas', onDelete: 'CASCADE' });
Reserva.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

Usuario.hasMany(Resena, { foreignKey: 'usuario_id', as: 'resenas', onDelete: 'CASCADE' });
Resena.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

module.exports = { sequelize, Usuario, TipoCancha, Cancha, Horario, Reserva, Resena };
