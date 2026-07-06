// Funciones de formato reutilizables en varias páginas.

// Convierte una fecha ISO a un texto legible en español.
export const formatearFecha = (iso) => {
  const fecha = new Date(iso);
  return fecha.toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Etiquetas legibles para cada fase del torneo.
export const etiquetaFase = (fase) => {
  const etiquetas = {
    grupos: 'Fase de grupos',
    dieciseisavos: 'Dieciseisavos',
    octavos: 'Octavos',
    cuartos: 'Cuartos',
    semifinal: 'Semifinal',
    tercer_puesto: 'Tercer puesto',
    final: 'Final',
  };
  return etiquetas[fase] || fase;
};

// Etiquetas legibles para el estado del partido.
export const etiquetaEstado = (estado) => {
  const etiquetas = {
    programado: 'Programado',
    en_curso: 'En curso',
    finalizado: 'Finalizado',
  };
  return etiquetas[estado] || estado;
};
