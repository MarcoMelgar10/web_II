import { Link } from 'react-router-dom';
import { formatearFecha, etiquetaFase, etiquetaEstado } from '../utils/formato';

// Tarjeta reutilizable que muestra el resumen de un partido.
const PartidoCard = ({ partido }) => {
  const finalizado = partido.estado === 'finalizado';

  return (
    <Link to={`/partidos/${partido.id}`} className="partido-card">
      <div className="partido-card-cabecera">
        <span className={`etiqueta etiqueta-${partido.estado}`}>
          {etiquetaEstado(partido.estado)}
        </span>
        <span className="partido-card-fase">{etiquetaFase(partido.fase)}</span>
      </div>

      <div className="partido-card-equipos">
        <span className="equipo">{partido.equipo_local}</span>
        <span className="marcador">
          {finalizado ? `${partido.goles_local} - ${partido.goles_visitante}` : 'vs'}
        </span>
        <span className="equipo">{partido.equipo_visitante}</span>
      </div>

      <div className="partido-card-pie">
        <span>{formatearFecha(partido.fecha)}</span>
        {partido.ciudad && <span> {partido.ciudad}</span>}
      </div>
    </Link>
  );
};

export default PartidoCard;
