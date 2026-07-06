import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { detallePartido } from '../api/partidos';
import { misPronosticos } from '../api/pronosticos';
import PronosticoForm from '../components/PronosticoForm';
import Mapa from '../components/Mapa';
import Loader from '../components/Loader';
import Mensaje from '../components/Mensaje';
import { formatearFecha, etiquetaFase, etiquetaEstado } from '../utils/formato';

// Detalle de un partido: info, ciudad en el mapa y formulario de pronóstico.
const PartidoDetalle = () => {
  const { id } = useParams();
  const [partido, setPartido] = useState(null);
  const [pronostico, setPronostico] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');

  const cargar = () => {
    setCargando(true);
    Promise.all([detallePartido(id), misPronosticos()])
      .then(([p, pr]) => {
        setPartido(p.data);
        // Buscar si ya tengo un pronóstico para este partido.
        const mio = pr.data.find((x) => x.partido_id === Number(id));
        setPronostico(mio || null);
      })
      .catch(() => setError('No se pudo cargar el partido'))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargar();
  }, [id]);

  if (cargando) return <Loader />;
  if (error) return <Mensaje texto={error} />;

  const finalizado = partido.estado === 'finalizado';
  const yaComenzo = partido.estado !== 'programado' || new Date(partido.fecha) <= new Date();

  return (
    <div>
      <div className="partido-detalle-cabecera">
        <span className={`etiqueta etiqueta-${partido.estado}`}>{etiquetaEstado(partido.estado)}</span>
        <span className="texto-suave">{etiquetaFase(partido.fase)}</span>
      </div>

      {/* Marcador / equipos */}
      <div className="partido-detalle-marcador">
        <span className="equipo-grande">{partido.equipo_local}</span>
        <span className="vs-grande">
          {finalizado ? `${partido.goles_local} - ${partido.goles_visitante}` : 'vs'}
        </span>
        <span className="equipo-grande">{partido.equipo_visitante}</span>
      </div>

      <p className="partido-detalle-info">
        {formatearFecha(partido.fecha)}
        {partido.estadio && <> · {partido.estadio}</>}
        {partido.ciudad && <> · {partido.ciudad}</>}
      </p>

      <div className="grupo-columnas">
        {/* Mapa de la ciudad del partido */}
        {partido.latitud != null && (
          <section className="seccion">
            <h2 className="seccion-titulo">Sede del partido</h2>
            <Mapa
              puntos={[partido]}
              centro={[partido.latitud, partido.longitud]}
              zoom={11}
              altura={300}
            />
          </section>
        )}

        {/* Pronóstico */}
        <section className="seccion">
          <h2 className="seccion-titulo">Tu pronóstico</h2>
          <Mensaje texto={aviso} tipo="exito" />

          {yaComenzo ? (
            <div className="tarjeta">
              {pronostico ? (
                <p>
                  Pronosticaste <strong>{pronostico.goles_local} - {pronostico.goles_visitante}</strong>.
                  {finalizado && <> Obtuviste <strong>{pronostico.puntos_obtenidos}</strong> puntos.</>}
                </p>
              ) : (
                <p className="texto-suave">El partido ya comenzó y no registraste pronóstico.</p>
              )}
            </div>
          ) : (
            <PronosticoForm
              partido={partido}
              pronostico={pronostico}
              onGuardado={() => {
                setAviso('Pronóstico guardado correctamente');
                cargar();
              }}
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default PartidoDetalle;
