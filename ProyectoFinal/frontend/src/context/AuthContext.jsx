import { createContext, useContext, useState } from 'react';

// Contexto de autenticación: guarda el usuario y el token, y expone login/logout.
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Cargar el usuario guardado (si ya había iniciado sesión antes).
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('usuario');
    return guardado ? JSON.parse(guardado) : null;
  });

  // Guarda token + usuario tras un login/registro exitoso.
  const login = (token, datosUsuario) => {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(datosUsuario));
    setUsuario(datosUsuario);
  };

  // Cierra sesión y limpia el almacenamiento.
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  // Actualiza los datos del usuario (ej. al editar el perfil).
  const actualizarUsuario = (datosUsuario) => {
    localStorage.setItem('usuario', JSON.stringify(datosUsuario));
    setUsuario(datosUsuario);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, actualizarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto cómodamente: const { usuario, login } = useAuth();
export const useAuth = () => useContext(AuthContext);
