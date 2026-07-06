import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { iniciarSesion } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import Mensaje from '../components/Mensaje';

// Página de inicio de sesión (pública).
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setError('');

    // Validación del lado del cliente.
    if (!email || !contrasena) {
      setError('Completa todos los campos');
      return;
    }

    setCargando(true);
    try {
      const { data } = await iniciarSesion({ email, contrasena });
      login(data.token, data.usuario);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-pagina">
      <div className="auth-tarjeta">
        <h1 className="auth-titulo">Quiniela Mundial 2026</h1>
        <p className="auth-subtitulo">Inicia sesión para continuar</p>

        <form onSubmit={enviar}>
          <Mensaje texto={error} />

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
            placeholder="••••••"
          />

          <button className="btn btn-primario btn-ancho" type="submit" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="auth-pie">
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
