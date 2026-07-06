import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { misPronosticos } from '../api/pronosticos';
import Loader from '../components/Loader';
import Mensaje from '../components/Mensaje';
import { formatearFecha, etiquetaEstado } from '../utils/formato';

// Lista de todos mis pronósticos con los puntos obtenidos.
const MisPronosticos = () => {
  const [pronosticos, setPronosticos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    misPronosticos()
      .then(({ data }) => setPronosticos(data))
      .catch(() => setError('No se pudieron cargar tus pronósticos'))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <Loader />;
  if (error) return <Mensaje texto={error} />;

  return (
    <div>
      <h1 className="pagina-titulo">Mis pronósticos</h1>

      {pronosticos.length === 0 ? (
        <p className="texto-suave">
          Todavía no has hecho pronósticos. <Link to="/partidos">Ve al calendario</Link>.
        </p>
      ) : (
        <table className="tabla">
          <thead>
            <tr>
              <th>Partido</th>
              <th>Fecha</th>
              <th>Mi pronóstico</th>
              <th>Resultado</th>
              <th>Estado</th>
              <th>Puntos</th>
            </tr>
          </thead>
          <tbody>
            {pronosticos.map((p) => (
              <tr key={p.id}>
                <td>
                  <Link to={`/partidos/${p.partido_id}`}>
                    {p.partido.equipo_local} vs {p.partido.equipo_visitante}
                  </Link>
                </td>
                <td>{formatearFecha(p.partido.fecha)}</td>
                <td>{p.goles_local} - {p.goles_visitante}</td>
                <td>
                  {p.partido.estado === 'finalizado'
                    ? `${p.partido.goles_local} - ${p.partido.goles_visitante}`
                    : '—'}
                </td>
                <td>{etiquetaEstado(p.partido.estado)}</td>
                <td><strong>{p.puntos_obtenidos}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MisPronosticos;
