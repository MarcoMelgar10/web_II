const { Grupo, Usuario, GrupoUsuario, Pronostico } = require('../models');
const generarCodigo = require('../utils/generarCodigo');

// Suma los puntos totales de un usuario (de todos sus pronósticos).
const puntosDeUsuario = async (usuarioId) => {
  const total = await Pronostico.sum('puntos_obtenidos', { where: { usuario_id: usuarioId } });
  return total || 0;
};

// Genera un código de invitación único (reintenta si por azar ya existe).
const generarCodigoUnico = async () => {
  let codigo;
  let existe;
  do {
    codigo = generarCodigo();
    existe = await Grupo.findOne({ where: { codigo_invitacion: codigo } });
  } while (existe);
  return codigo;
};

// Verifica que el usuario pertenezca al grupo.
const esMiembro = async (grupoId, usuarioId) => {
  const membresia = await GrupoUsuario.findOne({
    where: { grupo_id: grupoId, usuario_id: usuarioId },
  });
  return Boolean(membresia);
};

// POST /api/grupos  -> crea un grupo y agrega al creador como miembro.
const crearGrupo = async (req, res, next) => {
  try {
    const { nombre } = req.body;
    const codigo = await generarCodigoUnico();

    const grupo = await Grupo.create({
      nombre,
      codigo_invitacion: codigo,
      creador_id: req.usuario.id,
    });

    // El creador queda automáticamente como miembro.
    await GrupoUsuario.create({ grupo_id: grupo.id, usuario_id: req.usuario.id });

    res.status(201).json(grupo);
  } catch (error) {
    next(error);
  }
};

// GET /api/grupos  -> grupos a los que pertenece el usuario.
const misGrupos = async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      include: [{
        model: Grupo,
        as: 'grupos',
        through: { attributes: [] },
        include: [{ model: Usuario, as: 'miembros', attributes: ['id'], through: { attributes: [] } }],
      }],
    });

    const grupos = (usuario.grupos || []).map((g) => ({
      id: g.id,
      nombre: g.nombre,
      codigo_invitacion: g.codigo_invitacion,
      creador_id: g.creador_id,
      cantidadMiembros: g.miembros ? g.miembros.length : 0,
    }));

    res.json(grupos);
  } catch (error) {
    next(error);
  }
};

// GET /api/grupos/:id  -> detalle del grupo (solo miembros).
const detalleGrupo = async (req, res, next) => {
  try {
    const grupo = await Grupo.findByPk(req.params.id, {
      include: [{ model: Usuario, as: 'creador', attributes: ['id', 'nombre'] }],
    });
    if (!grupo) {
      return res.status(404).json({ mensaje: 'Grupo no encontrado' });
    }
    if (!(await esMiembro(grupo.id, req.usuario.id))) {
      return res.status(403).json({ mensaje: 'No perteneces a este grupo' });
    }
    res.json(grupo);
  } catch (error) {
    next(error);
  }
};

// GET /api/grupos/:id/participantes  -> lista de miembros (solo miembros).
const participantes = async (req, res, next) => {
  try {
    const grupo = await Grupo.findByPk(req.params.id, {
      include: [{
        model: Usuario,
        as: 'miembros',
        attributes: ['id', 'nombre', 'email'],
        through: { attributes: [] },
      }],
    });
    if (!grupo) {
      return res.status(404).json({ mensaje: 'Grupo no encontrado' });
    }
    if (!(await esMiembro(grupo.id, req.usuario.id))) {
      return res.status(403).json({ mensaje: 'No perteneces a este grupo' });
    }
    res.json(grupo.miembros || []);
  } catch (error) {
    next(error);
  }
};

// GET /api/grupos/:id/clasificacion  -> miembros ordenados por puntaje.
const clasificacion = async (req, res, next) => {
  try {
    const grupo = await Grupo.findByPk(req.params.id, {
      include: [{
        model: Usuario,
        as: 'miembros',
        attributes: ['id', 'nombre'],
        through: { attributes: [] },
      }],
    });
    if (!grupo) {
      return res.status(404).json({ mensaje: 'Grupo no encontrado' });
    }
    if (!(await esMiembro(grupo.id, req.usuario.id))) {
      return res.status(403).json({ mensaje: 'No perteneces a este grupo' });
    }

    // Calcular el puntaje de cada miembro y ordenar de mayor a menor.
    const tabla = [];
    for (const miembro of grupo.miembros) {
      const puntos = await puntosDeUsuario(miembro.id);
      tabla.push({ usuario_id: miembro.id, nombre: miembro.nombre, puntos });
    }
    tabla.sort((a, b) => b.puntos - a.puntos);

    // Asignar la posición (1, 2, 3, ...).
    const clasificacionFinal = tabla.map((fila, indice) => ({
      posicion: indice + 1,
      ...fila,
    }));

    res.json(clasificacionFinal);
  } catch (error) {
    next(error);
  }
};

// POST /api/grupos/unirse  -> une al usuario usando un código de invitación.
const unirse = async (req, res, next) => {
  try {
    const { codigo } = req.body;
    const grupo = await Grupo.findOne({ where: { codigo_invitacion: codigo } });
    if (!grupo) {
      return res.status(404).json({ mensaje: 'Código de invitación inválido' });
    }

    if (await esMiembro(grupo.id, req.usuario.id)) {
      return res.status(409).json({ mensaje: 'Ya perteneces a este grupo' });
    }

    await GrupoUsuario.create({ grupo_id: grupo.id, usuario_id: req.usuario.id });
    res.status(201).json({ mensaje: 'Te uniste al grupo', grupo });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  crearGrupo,
  misGrupos,
  detalleGrupo,
  participantes,
  clasificacion,
  unirse,
  puntosDeUsuario,
  esMiembro,
};
