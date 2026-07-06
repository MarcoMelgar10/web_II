import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registrar } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import Mensaje from '../components/Mensaje';

// Página de registro (pública).
const Registro = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setError('');

    // Validación del lado del cliente.
    if (!nombre || !email || !contrasena) {
      setError('Completa todos los campos');
      return;
    }
    if (contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setCargando(true);
    try {
      const { data } = await registrar({ nombre, email, contrasena });
      login(data.token, data.usuario);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo crear la cuenta');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-pagina">
      <div className="auth-tarjeta">
        <h1 className="auth-titulo">Crear cuenta</h1>
        <p className="auth-subtitulo">Únete a la Quiniela Mundial 2026</p>

        <form onSubmit={enviar}>
          <Mensaje texto={error} />

          <label>Nombre</label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" />

          <label>Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
          />

          <label>Contraseña</label>
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            placeholder="Mínimo 6 caracteres"
          />

          <button className="btn btn-primario btn-ancho" type="submit" disabled={cargando}>
            {cargando ? 'Creando...' : 'Registrarme'}
          </button>
        </form>

        <p className="auth-pie">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Registro;
