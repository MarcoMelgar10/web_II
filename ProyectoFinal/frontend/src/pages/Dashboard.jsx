import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerResumen } from '../api/dashboard';
import { useAuth } from '../context/AuthContext';
import PartidoCard from '../components/PartidoCard';
import Loader from '../components/Loader';
import Mensaje from '../components/Mensaje';

// Página de inicio con el resumen del usuario.
const Dashboard = () => {
  const { usuario } = useAuth();
  const [resumen, setResumen] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerResumen()
      .then(({ data }) => setResumen(data))
      .catch(() => setError('No se pudo cargar el resumen'))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <Loader />;
  if (error) return <Mensaje texto={error} />;

  return (
    <div>
      <h1 className="pagina-titulo">Hola, {usuario?.nombre} </h1>

      {/* Tarjetas con números clave */}
      <div className="tarjetas-resumen">
        <div className="tarjeta-stat">
          <span className="stat-numero">{resumen.cantidadGrupos}</span>
          <span className="stat-texto">Grupos</span>
        </div>
        <div className="tarjeta-stat">
          <span className="stat-numero">{resumen.puntajeAcumulado}</span>
          <span className="stat-texto">Puntos acumulados</span>
        </div>
        <div className="tarjeta-stat">
          <span className="stat-numero">{resumen.proximosSinPronostico.length}</span>
          <span className="stat-texto">Partidos sin pronosticar</span>
        </div>
      </div>

      {/* Posición en cada grupo */}
      <section className="seccion">
        <h2 className="seccion-titulo">Mi posición en cada grupo</h2>
        {resumen.posiciones.length === 0 ? (
          <p className="texto-suave">
            Todavía no perteneces a ningún grupo. <Link to="/grupos">Crea o únete a uno</Link>.
          </p>
        ) : (
          <div className="lista-posiciones">
            {resumen.posiciones.map((p) => (
              <Link key={p.grupo_id} to={`/grupos/${p.grupo_id}`} className="fila-posicion">
                <span>{p.nombre}</span>
                <span className="badge">
                  #{p.posicion} de {p.totalMiembros}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Próximos partidos pendientes */}
      <section className="seccion">
        <h2 className="seccion-titulo">Próximos partidos por pronosticar</h2>
        {resumen.proximosSinPronostico.length === 0 ? (
          <p className="texto-suave">¡Estás al día con tus pronósticos!</p>
        ) : (
          <div className="grilla-partidos">
            {resumen.proximosSinPronostico.map((partido) => (
              <PartidoCard key={partido.id} partido={partido} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
