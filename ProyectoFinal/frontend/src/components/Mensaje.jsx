// Mensaje reutilizable de error o éxito.
// tipo: 'error' | 'exito'
const Mensaje = ({ texto, tipo = 'error' }) => {
  if (!texto) return null;
  return <div className={`mensaje mensaje-${tipo}`}>{texto}</div>;
};

export default Mensaje;
