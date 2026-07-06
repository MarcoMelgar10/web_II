import client from './client';

// Servicios del perfil del usuario.
export const obtenerPerfil = () => client.get('/perfil');
export const actualizarPerfil = (datos) => client.put('/perfil', datos);
