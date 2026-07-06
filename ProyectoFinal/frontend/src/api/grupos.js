import client from './client';

// Servicios de grupos.
export const crearGrupo = (datos) => client.post('/grupos', datos);
export const misGrupos = () => client.get('/grupos');
export const detalleGrupo = (id) => client.get(`/grupos/${id}`);
export const participantes = (id) => client.get(`/grupos/${id}/participantes`);
export const clasificacion = (id) => client.get(`/grupos/${id}/clasificacion`);
export const unirseAGrupo = (codigo) => client.post('/grupos/unirse', { codigo });
