import client from './client';

// Servicios de pronósticos.
export const misPronosticos = () => client.get('/pronosticos');
export const crearPronostico = (datos) => client.post('/pronosticos', datos);
export const actualizarPronostico = (id, datos) => client.put(`/pronosticos/${id}`, datos);
