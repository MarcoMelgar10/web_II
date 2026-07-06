import client from './client';

// Servicios de partidos.
// filtros = { fase, fecha, estado } (todos opcionales)
export const listarPartidos = (filtros = {}) => client.get('/partidos', { params: filtros });
export const detallePartido = (id) => client.get(`/partidos/${id}`);
export const crearPartido = (datos) => client.post('/partidos', datos);
export const actualizarPartido = (id, datos) => client.put(`/partidos/${id}`, datos);

// Sedes oficiales (para el mapa).
export const listarSedes = () => client.get('/sedes');
