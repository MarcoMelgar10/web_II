import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protege rutas de administrador: exige usuario con rol 'admin'.
const RutaAdmin = ({ children }) => {
  const { usuario } = useAuth();
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }
  if (usuario.rol !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default RutaAdmin;
