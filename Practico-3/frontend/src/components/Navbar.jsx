import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const creatorLinks = (
    <>
      <Link to="/creator/dashboard">Dashboard</Link>
      <Link to="/creator/profile">Perfil</Link>
      <Link to="/creator/posts/new">Nueva Publicacion</Link>
      <Link to="/creator/income">Ingresos</Link>
    </>
  );

  const followerLinks = (
    <>
      <Link to="/follower/feed">Feed</Link>
      <Link to="/follower/creators">Creadores</Link>
      <Link to="/follower/favorites">Favoritos</Link>
      <Link to="/follower/donations">Mis Donaciones</Link>
    </>
  );

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">OnlyFlans</Link>
      <div className="navbar-links">
        {user?.role === "CREATOR" && creatorLinks}
        {user?.role === "FOLLOWER" && followerLinks}
      </div>
      <div className="navbar-actions">
        {user ? (
          <>
            <span className="navbar-user">{user.email}</span>
            <button onClick={handleLogout} className="btn btn-outline">Salir</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline">Ingresar</Link>
            <Link to="/register" className="btn btn-primary">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
