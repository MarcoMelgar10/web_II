const bcrypt = require('bcryptjs');
const { Usuario } = require('../models');

// ═══════════════════════════════════════════════════════════════════════
// Seed: solo crea el usuario administrador por defecto.
// Los partidos se importan automáticamente desde thesportsdb.com
// mediante el servicio de sincronización (sincronizacion.js).
// ═══════════════════════════════════════════════════════════════════════

const seedData = async () => {
  const adminExiste = await Usuario.findOne({ where: { rol: 'admin' } });
  if (!adminExiste) {
    const hash = await bcrypt.hash('admin123', 10);
    await Usuario.create({
      nombre: 'Administrador',
      email: 'admin@admin.com',
      contrasena: hash,
      rol: 'admin',
    });
    console.log('Admin creado: admin@admin.com / admin123');
  }
};

module.exports = seedData;
