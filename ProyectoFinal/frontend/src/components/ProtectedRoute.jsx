import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protege rutas privadas: si no hay usuario, redirige al login.
const ProtectedRoute = ({ children }) => {
  const { usuario } = useAuth();
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
