import { useEffect, useState } from 'react';
import { listarPartidos, listarSedes, crearPartido, actualizarPartido } from '../../api/partidos';
import Loader from '../../components/Loader';
import Mensaje from '../../components/Mensaje';
import { formatearFecha, etiquetaEstado } from '../../utils/formato';

// Estado inicial vacío del formulario.
const formularioVacio = {
  equipo_local: '',
  equipo_visitante: '',
  fecha: '',
  fase: 'grupos',
  ciudad: '',
  estadio: '',
  latitud: '',
  longitud: '',
  id_api: '',
};

// Panel de administrador: registrar y editar partidos.
// Nota: el resultado (goles) NO se edita aquí, se obtiene de la API.
const AdminPartidos = () => {
  const [partidos, setPartidos] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');

  const [form, setForm] = useState(formularioVacio);
  const [editandoId, setEditandoId] = useState(null);

  const cargar = () => {
    setCargando(true);
    Promise.all([listarPartidos(), listarSedes()])
      .then(([p, s]) => {
        setPartidos(p.data);
        setSedes(s.data);
      })
      .catch(() => setError('No se pudieron cargar los datos'))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargar();
  }, []);

  // Actualiza un campo del formulario.
  const cambiar = (campo, valor) => setForm({ ...form, [campo]: valor });

  // Al elegir una sede, se autocompletan estadio, ciudad y coordenadas.
  const elegirSede = (ciudad) => {
    const sede = sedes.find((s) => s.ciudad === ciudad);
    if (sede) {
      setForm({
        ...form,
        ciudad: sede.ciudad,
        estadio: sede.estadio,
        latitud: sede.latitud,
        longitud: sede.longitud,
      });
    } else {
      setForm({ ...form, ciudad, estadio: '', latitud: '', longitud: '' });
    }
  };

  const limpiarForm = () => {
    setForm(formularioVacio);
    setEditandoId(null);
  };

  // Carga un partido en el formulario para editarlo.
  const editar = (p) => {
    setEditandoId(p.id);
    setForm({
      equipo_local: p.equipo_local,
      equipo_visitante: p.equipo_visitante,
      // datetime-local necesita el formato YYYY-MM-DDTHH:mm
      fecha: new Date(p.fecha).toISOString().slice(0, 16),
      fase: p.fase,
      ciudad: p.ciudad || '',
      estadio: p.estadio || '',
      latitud: p.latitud ?? '',
      longitud: p.longitud ?? '',
      id_api: p.id_api || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const guardar = async (e) => {
    e.preventDefault();
    setError('');
    setAviso('');

    // Validación del lado del cliente.
    if (!form.equipo_local || !form.equipo_visitante || !form.fecha) {
      setError('Equipos y fecha son obligatorios');
      return;
    }

    try {
      if (editandoId) {
        await actualizarPartido(editandoId, form);
        setAviso('Partido actualizado (el marcador no se modifica desde aquí)');
      } else {
        await crearPartido(form);
        setAviso('Partido registrado correctamente');
      }
      limpiarForm();
      cargar();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo guardar el partido');
    }
  };

  return (
    <div>
      <h1 className="pagina-titulo">Administrar partidos</h1>

      {/* Formulario de alta / edición */}
      <form className="tarjeta admin-form" onSubmit={guardar}>
        <h3>{editandoId ? 'Editar partido' : 'Registrar nuevo partido'}</h3>
        <Mensaje texto={error} />
        <Mensaje texto={aviso} tipo="exito" />

        <div className="admin-form-grid">
          <div>
            <label>Equipo local</label>
            <input value={form.equipo_local} onChange={(e) => cambiar('equipo_local', e.target.value)} />
          </div>
          <div>
            <label>Equipo visitante</label>
            <input value={form.equipo_visitante} onChange={(e) => cambiar('equipo_visitante', e.target.value)} />
          </div>
          <div>
            <label>Fecha y hora</label>
            <input type="datetime-local" value={form.fecha} onChange={(e) => cambiar('fecha', e.target.value)} />
          </div>
          <div>
            <label>Fase</label>
            <select value={form.fase} onChange={(e) => cambiar('fase', e.target.value)}>
              <option value="grupos">Fase de grupos</option>
              <option value="dieciseisavos">Dieciseisavos</option>
              <option value="octavos">Octavos</option>
              <option value="cuartos">Cuartos</option>
              <option value="semifinal">Semifinal</option>
              <option value="tercer_puesto">Tercer puesto</option>
              <option value="final">Final</option>
            </select>
          </div>
          <div>
            <label>Sede</label>
            <select value={form.ciudad} onChange={(e) => elegirSede(e.target.value)}>
              <option value="">Selecciona una sede</option>
              {sedes.map((s) => (
                <option key={s.ciudad} value={s.ciudad}>{s.ciudad} — {s.estadio}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Id en thesportsdb (opcional, para sincronizar)</label>
            <input value={form.id_api} onChange={(e) => cambiar('id_api', e.target.value)} placeholder="Ej: 2052744" />
          </div>
        </div>

        <div className="admin-form-acciones">
          <button className="btn btn-primario" type="submit">
            {editandoId ? 'Guardar cambios' : 'Registrar partido'}
          </button>
          {editandoId && (
            <button type="button" className="btn btn-secundario" onClick={limpiarForm}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Tabla de partidos */}
      <section className="seccion">
        <h2 className="seccion-titulo">Partidos registrados</h2>
        {cargando ? (
          <Loader />
        ) : (
          <table className="tabla">
            <thead>
              <tr>
                <th>Partido</th>
                <th>Fecha</th>
                <th>Sede</th>
                <th>Estado</th>
                <th>Marcador</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {partidos.map((p) => (
                <tr key={p.id}>
                  <td>{p.equipo_local} vs {p.equipo_visitante}</td>
                  <td>{formatearFecha(p.fecha)}</td>
                  <td>{p.ciudad || '—'}</td>
                  <td>{etiquetaEstado(p.estado)}</td>
                  <td>
                    {p.estado === 'finalizado' ? `${p.goles_local} - ${p.goles_visitante}` : '—'}
                  </td>
                  <td>
                    <button className="btn btn-secundario btn-pequeno" onClick={() => editar(p)}>
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default AdminPartidos;
