// Reglas de puntuación de la quiniela.
//   - Marcador exacto correcto  -> 3 puntos
//   - Solo el resultado correcto (ganador o empate) -> 1 punto
//   - Fallado                   -> 0 puntos
//
// "pronostico" y "partido" deben tener goles_local y goles_visitante (números).
const calcularPuntos = (pronostico, partido) => {
  // Si el partido no tiene marcador todavía, no hay puntos.
  if (partido.goles_local === null || partido.goles_visitante === null) {
    return 0;
  }

  // Marcador exacto.
  if (
    pronostico.goles_local === partido.goles_local &&
    pronostico.goles_visitante === partido.goles_visitante
  ) {
    return 3;
  }

  // Resultado (signo) del pronóstico y del partido: 1 local, -1 visitante, 0 empate.
  const signo = (local, visitante) => Math.sign(local - visitante);

  const resultadoPron = signo(pronostico.goles_local, pronostico.goles_visitante);
  const resultadoReal = signo(partido.goles_local, partido.goles_visitante);

  if (resultadoPron === resultadoReal) {
    return 1;
  }

  return 0;
};

module.exports = { calcularPuntos };
