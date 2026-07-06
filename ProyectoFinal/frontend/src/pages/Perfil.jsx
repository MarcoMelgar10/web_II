import { useEffect, useState } from 'react';
import { obtenerPerfil, actualizarPerfil } from '../api/perfil';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Mensaje from '../components/Mensaje';

// Página de perfil: consultar y modificar la información personal.
const Perfil = () => {
  const { actualizarUsuario } = useAuth();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');

  useEffect(() => {
    obtenerPerfil()
      .then(({ data }) => {
        setNombre(data.nombre);
        setEmail(data.email);
      })
      .catch(() => setError('No se pudo cargar el perfil'))
      .finally(() => setCargando(false));
  }, []);

  const guardar = async (e) => {
    e.preventDefault();
    setError('');
    setAviso('');

    // Validación del lado del cliente.
    if (!nombre || !email) {
      setError('El nombre y el correo son obligatorios');
      return;
    }
    if (contrasena && contrasena.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      const datos = { nombre, email };
      if (contrasena) datos.contrasena = contrasena;
      const { data } = await actualizarPerfil(datos);
      actualizarUsuario(data);
      setContrasena('');
      setAviso('Perfil actualizado correctamente');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo actualizar el perfil');
    }
  };

  if (cargando) return <Loader />;

  return (
    <div className="contenedor-angosto">
      <h1 className="pagina-titulo">Mi perfil</h1>

      <form className="tarjeta" onSubmit={guardar}>
        <Mensaje texto={error} />
        <Mensaje texto={aviso} tipo="exito" />

        <label>Nombre</label>
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} />

        <label>Correo electrónico</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Nueva contraseña (opcional)</label>
        <input
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          placeholder="Déjala vacía para no cambiarla"
        />

        <button className="btn btn-primario" type="submit">Guardar cambios</button>
      </form>
    </div>
  );
};

export default Perfil;
