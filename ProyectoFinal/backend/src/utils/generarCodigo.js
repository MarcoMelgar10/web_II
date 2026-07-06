// Genera un código de invitación corto y legible, ej: "MUN-7K2QX".
const generarCodigo = () => {
  const caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sin letras/números confusos
  let codigo = '';
  for (let i = 0; i < 5; i++) {
    codigo += caracteres[Math.floor(Math.random() * caracteres.length)];
  }
  return `MUN-${codigo}`;
};

module.exports = generarCodigo;
