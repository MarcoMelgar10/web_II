import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { misGrupos, crearGrupo, unirseAGrupo } from '../api/grupos';
import Loader from '../components/Loader';
import Mensaje from '../components/Mensaje';

// Página de grupos: lista, crear y unirse por código.
const Grupos = () => {
  const [grupos, setGrupos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');
  const [aviso, setAviso] = useState('');

  const cargar = () => {
    setCargando(true);
    misGrupos()
      .then(({ data }) => setGrupos(data))
      .catch(() => setError('No se pudieron cargar los grupos'))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargar();
  }, []);

  const crear = async (e) => {
    e.preventDefault();
    setError('');
    setAviso('');
    if (!nombre.trim()) {
      setError('Escribe un nombre para el grupo');
      return;
    }
    try {
      const { data } = await crearGrupo({ nombre });
      setNombre('');
      setAviso(`Grupo creado. Código de invitación: ${data.codigo_invitacion}`);
      cargar();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo crear el grupo');
    }
  };

  const unirse = async (e) => {
    e.preventDefault();
    setError('');
    setAviso('');
    if (!codigo.trim()) {
      setError('Escribe un código de invitación');
      return;
    }
    try {
      await unirseAGrupo(codigo.trim());
      setCodigo('');
      setAviso('Te uniste al grupo correctamente');
      cargar();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo unir al grupo');
    }
  };

  return (
    <div>
      <h1 className="pagina-titulo">Mis grupos</h1>

      <Mensaje texto={error} />
      <Mensaje texto={aviso} tipo="exito" />

      {/* Acciones: crear y unirse */}
      <div className="grupos-acciones">
        <form className="tarjeta" onSubmit={crear}>
          <h3>Crear un grupo</h3>
          <input
            placeholder="Nombre del grupo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <button className="btn btn-primario" type="submit">Crear</button>
        </form>

        <form className="tarjeta" onSubmit={unirse}>
          <h3>Unirse con código</h3>
          <input
            placeholder="Ej: MUN-7K2QX"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
          />
          <button className="btn btn-secundario" type="submit">Unirme</button>
        </form>
      </div>

      {/* Lista de grupos */}
      <section className="seccion">
        {cargando ? (
          <Loader />
        ) : grupos.length === 0 ? (
          <p className="texto-suave">Aún no perteneces a ningún grupo.</p>
        ) : (
          <div className="grilla-grupos">
            {grupos.map((g) => (
              <Link key={g.id} to={`/grupos/${g.id}`} className="tarjeta tarjeta-grupo">
                <h3>{g.nombre}</h3>
                <p className="texto-suave">{g.cantidadMiembros} participante(s)</p>
                <span className="codigo-chip">{g.codigo_invitacion}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Grupos;
