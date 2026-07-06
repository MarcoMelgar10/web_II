import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Barra de navegación superior. Se muestra en las páginas privadas.
const Navbar = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const cerrarSesion = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-marca">Quiniela 2026</div>

      <div className="navbar-links">
        <NavLink to="/dashboard">Inicio</NavLink>
        <NavLink to="/grupos">Grupos</NavLink>
        <NavLink to="/partidos">Partidos</NavLink>
        <NavLink to="/mis-pronosticos">Pronósticos</NavLink>
        {usuario?.rol === 'admin' && <NavLink to="/admin/partidos">Admin</NavLink>}
        <NavLink to="/perfil">Perfil</NavLink>
      </div>

      <div className="navbar-usuario">
        <span>{usuario?.nombre}</span>
        <button className="btn btn-secundario btn-pequeno" onClick={cerrarSesion}>
          Salir
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
