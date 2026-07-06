import { useState } from 'react';
import { crearPronostico, actualizarPronostico } from '../api/pronosticos';
import Mensaje from './Mensaje';

// Formulario reutilizable para crear o editar un pronóstico de un partido.
// props: partido, pronostico (opcional, si ya existe), onGuardado (callback)
const PronosticoForm = ({ partido, pronostico, onGuardado }) => {
  const [golesLocal, setGolesLocal] = useState(pronostico ? pronostico.goles_local : '');
  const [golesVisitante, setGolesVisitante] = useState(pronostico ? pronostico.goles_visitante : '');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setError('');

    // Validación del lado del cliente.
    if (golesLocal === '' || golesVisitante === '') {
      setError('Debes ingresar ambos marcadores');
      return;
    }
    if (Number(golesLocal) < 0 || Number(golesVisitante) < 0) {
      setError('Los goles no pueden ser negativos');
      return;
    }

    setGuardando(true);
    try {
      const datos = {
        goles_local: Number(golesLocal),
        goles_visitante: Number(golesVisitante),
      };
      if (pronostico) {
        await actualizarPronostico(pronostico.id, datos);
      } else {
        await crearPronostico({ partido_id: partido.id, ...datos });
      }
      onGuardado();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo guardar el pronóstico');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form className="pronostico-form" onSubmit={enviar}>
      <Mensaje texto={error} />
      <div className="pronostico-form-marcador">
        <div className="campo-goles">
          <label>{partido.equipo_local}</label>
          <input
            type="number"
            min="0"
            value={golesLocal}
            onChange={(e) => setGolesLocal(e.target.value)}
          />
        </div>
        <span className="pronostico-form-guion">-</span>
        <div className="campo-goles">
          <label>{partido.equipo_visitante}</label>
          <input
            type="number"
            min="0"
            value={golesVisitante}
            onChange={(e) => setGolesVisitante(e.target.value)}
          />
        </div>
      </div>
      <button className="btn btn-primario" type="submit" disabled={guardando}>
        {guardando ? 'Guardando...' : pronostico ? 'Actualizar pronóstico' : 'Guardar pronóstico'}
      </button>
    </form>
  );
};

export default PronosticoForm;
