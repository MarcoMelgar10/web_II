import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import RutaAdmin from './components/RutaAdmin';

// Páginas
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import Grupos from './pages/Grupos';
import GrupoDetalle from './pages/GrupoDetalle';
import Partidos from './pages/Partidos';
import PartidoDetalle from './pages/PartidoDetalle';
import MisPronosticos from './pages/MisPronosticos';
import Perfil from './pages/Perfil';
import AdminPartidos from './pages/admin/AdminPartidos';

// Envuelve las páginas privadas con la barra de navegación y un contenedor.
const Privada = ({ children }) => (
  <ProtectedRoute>
    <Navbar />
    <main className="contenedor">{children}</main>
  </ProtectedRoute>
);

const App = () => {
  const { usuario } = useAuth();

  return (
    <Routes>
      {/* Públicas */}
      <Route path="/login" element={usuario ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/registro" element={usuario ? <Navigate to="/dashboard" /> : <Registro />} />

      {/* Privadas */}
      <Route path="/dashboard" element={<Privada><Dashboard /></Privada>} />
      <Route path="/grupos" element={<Privada><Grupos /></Privada>} />
      <Route path="/grupos/:id" element={<Privada><GrupoDetalle /></Privada>} />
      <Route path="/partidos" element={<Privada><Partidos /></Privada>} />
      <Route path="/partidos/:id" element={<Privada><PartidoDetalle /></Privada>} />
      <Route path="/mis-pronosticos" element={<Privada><MisPronosticos /></Privada>} />
      <Route path="/perfil" element={<Privada><Perfil /></Privada>} />

      {/* Admin */}
      <Route
        path="/admin/partidos"
        element={
          <RutaAdmin>
            <Navbar />
            <main className="contenedor"><AdminPartidos /></main>
          </RutaAdmin>
        }
      />

      {/* Por defecto */}
      <Route path="*" element={<Navigate to={usuario ? '/dashboard' : '/login'} />} />
    </Routes>
  );
};

export default App;
