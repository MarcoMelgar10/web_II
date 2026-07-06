import client from './client';

// Servicios de autenticación.
export const registrar = (datos) => client.post('/auth/register', datos);
export const iniciarSesion = (datos) => client.post('/auth/login', datos);
