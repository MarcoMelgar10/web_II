import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { detalleGrupo, participantes, clasificacion } from '../api/grupos';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Mensaje from '../components/Mensaje';

// Detalle de un grupo: código, participantes y clasificación.
const GrupoDetalle = () => {
  const { id } = useParams();
  const { usuario } = useAuth();

  const [grupo, setGrupo] = useState(null);
  const [miembros, setMiembros] = useState([]);
  const [tabla, setTabla] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    // Cargar en paralelo el detalle, los participantes y la clasificación.
    Promise.all([detalleGrupo(id), participantes(id), clasificacion(id)])
      .then(([g, p, c]) => {
        setGrupo(g.data);
        setMiembros(p.data);
        setTabla(c.data);
      })
      .catch((err) => setError(err.response?.data?.mensaje || 'No se pudo cargar el grupo'))
      .finally(() => setCargando(false));
  }, [id]);

  const copiarCodigo = () => {
    navigator.clipboard.writeText(grupo.codigo_invitacion);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  if (cargando) return <Loader />;
  if (error) return <Mensaje texto={error} />;

  return (
    <div>
      <h1 className="pagina-titulo">{grupo.nombre}</h1>

      {/* Código de invitación */}
      <div className="tarjeta codigo-invitacion">
        <div>
          <p className="texto-suave">Código de invitación</p>
          <span className="codigo-grande">{grupo.codigo_invitacion}</span>
        </div>
        <button className="btn btn-secundario" onClick={copiarCodigo}>
          {copiado ? '¡Copiado!' : 'Copiar'}
        </button>
      </div>

      <div className="grupo-columnas">
        {/* Clasificación */}
        <section className="seccion">
          <h2 className="seccion-titulo">Clasificación</h2>
          <table className="tabla">
            <thead>
              <tr>
                <th>#</th>
                <th>Participante</th>
                <th>Puntos</th>
              </tr>
            </thead>
            <tbody>
              {tabla.map((fila) => (
                <tr key={fila.usuario_id} className={fila.usuario_id === usuario.id ? 'fila-resaltada' : ''}>
                  <td>{fila.posicion}</td>
                  <td>{fila.nombre}{fila.usuario_id === usuario.id ? ' (tú)' : ''}</td>
                  <td><strong>{fila.puntos}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Participantes */}
        <section className="seccion">
          <h2 className="seccion-titulo">Participantes ({miembros.length})</h2>
          <ul className="lista-simple">
            {miembros.map((m) => (
              <li key={m.id}>{m.nombre} <span className="texto-suave">· {m.email}</span></li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default GrupoDetalle;
