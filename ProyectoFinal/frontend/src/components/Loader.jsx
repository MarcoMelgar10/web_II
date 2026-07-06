// Indicador simple de carga (estado de carga durante las operaciones).
const Loader = ({ texto = 'Cargando...' }) => {
  return (
    <div className="loader">
      <div className="loader-spinner" />
      <span>{texto}</span>
    </div>
  );
};

export default Loader;
