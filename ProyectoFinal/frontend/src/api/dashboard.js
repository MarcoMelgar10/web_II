import client from './client';

// Servicio del dashboard (resumen del usuario).
export const obtenerResumen = () => client.get('/dashboard');
