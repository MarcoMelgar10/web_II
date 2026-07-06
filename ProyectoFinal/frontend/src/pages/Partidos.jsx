import { useEffect, useState } from 'react';
import { listarPartidos, listarSedes } from '../api/partidos';
import PartidoCard from '../components/PartidoCard';
import Mapa from '../components/Mapa';
import Loader from '../components/Loader';
import Mensaje from '../components/Mensaje';

// Página de partidos: calendario con filtros + mapa de sedes oficiales.
const Partidos = () => {
  const [partidos, setPartidos] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Filtros
  const [fase, setFase] = useState('');
  const [estado, setEstado] = useState('');
  const [fecha, setFecha] = useState('');

  // Carga las sedes una sola vez (para el mapa).
  useEffect(() => {
    listarSedes().then(({ data }) => setSedes(data)).catch(() => {});
  }, []);

  // Carga los partidos cada vez que cambian los filtros.
  useEffect(() => {
    setCargando(true);
    const filtros = {};
    if (fase) filtros.fase = fase;
    if (estado) filtros.estado = estado;
    if (fecha) filtros.fecha = fecha;

    listarPartidos(filtros)
      .then(({ data }) => setPartidos(data))
      .catch(() => setError('No se pudieron cargar los partidos'))
      .finally(() => setCargando(false));
  }, [fase, estado, fecha]);

  const limpiar = () => {
    setFase('');
    setEstado('');
    setFecha('');
  };

  return (
    <div>
      <h1 className="pagina-titulo">Calendario del Mundial</h1>

      {/* Mapa de las sedes oficiales */}
      <section className="seccion">
        <h2 className="seccion-titulo">Sedes oficiales</h2>
        <Mapa puntos={sedes} />
      </section>

      {/* Filtros */}
      <div className="filtros">
        <select value={fase} onChange={(e) => setFase(e.target.value)}>
          <option value="">Todas las fases</option>
          <option value="grupos">Fase de grupos</option>
          <option value="dieciseisavos">Dieciseisavos</option>
          <option value="octavos">Octavos</option>
          <option value="cuartos">Cuartos</option>
          <option value="semifinal">Semifinal</option>
          <option value="tercer_puesto">Tercer puesto</option>
          <option value="final">Final</option>
        </select>

        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="programado">Programado</option>
          <option value="en_curso">En curso</option>
          <option value="finalizado">Finalizado</option>
        </select>

        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />

        <button className="btn btn-secundario btn-pequeno" onClick={limpiar}>Limpiar</button>
      </div>

      {/* Lista de partidos */}
      <Mensaje texto={error} />
      {cargando ? (
        <Loader />
      ) : partidos.length === 0 ? (
        <p className="texto-suave">No hay partidos con esos filtros.</p>
      ) : (
        <div className="grilla-partidos">
          {partidos.map((p) => (
            <PartidoCard key={p.id} partido={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Partidos;
