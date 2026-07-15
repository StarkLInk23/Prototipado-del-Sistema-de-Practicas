// Cálculo de días hábiles (lunes a viernes). Reglamento institucional:
// - Subsanación de observaciones: máximo 5 días hábiles.
// - Límite legal para dictamen de comisión: 15 días hábiles.
// Estas funciones son puras: mismo input, mismo output, sin dependencias.

const UN_DIA_MS = 24 * 60 * 60 * 1000;

function esFinDeSemana(fecha: Date): boolean {
  const dia = fecha.getDay();
  return dia === 0 || dia === 6; // domingo=0, sábado=6
}

/** Cuenta los días hábiles transcurridos entre dos fechas (excluye fines de semana). */
export function contarDiasHabilesEntre(fechaInicioIso: string, fechaFinIso: string): number {
  const inicio = new Date(fechaInicioIso);
  const fin = new Date(fechaFinIso);
  let cursor = new Date(inicio.getTime());
  let contador = 0;

  while (cursor.getTime() < fin.getTime()) {
    cursor = new Date(cursor.getTime() + UN_DIA_MS);
    if (!esFinDeSemana(cursor)) contador += 1;
  }
  return contador;
}

/** Días hábiles restantes hasta una fecha límite (0 si ya venció). */
export function diasHabilesRestantesHasta(fechaLimiteIso: string, ahoraIso: string): number {
  const restantes = contarDiasHabilesEntre(ahoraIso, fechaLimiteIso);
  return Math.max(0, restantes);
}

/** Suma N días hábiles a una fecha, saltando fines de semana. */
export function sumarDiasHabiles(fechaIso: string, diasHabiles: number): string {
  let cursor = new Date(fechaIso);
  let sumados = 0;
  while (sumados < diasHabiles) {
    cursor = new Date(cursor.getTime() + UN_DIA_MS);
    if (!esFinDeSemana(cursor)) sumados += 1;
  }
  return cursor.toISOString();
}

export interface EstadoLimiteLegal {
  diasTranscurridos: number;
  diasLimite: number;
  proporcionConsumida: number; // 0 a 1+
  nivelUrgencia: "normal" | "atencion" | "critico";
}

/**
 * Calcula qué tan cerca está un expediente de la comisión del límite legal
 * (por defecto 15 días hábiles) y clasifica el nivel de urgencia para
 * la jerarquía visual de la bandeja.
 */
export function evaluarLimiteLegal(
  fechaIngresoComisionIso: string,
  ahoraIso: string,
  diasLimite: number
): EstadoLimiteLegal {
  const diasTranscurridos = Math.min(
    contarDiasHabilesEntre(fechaIngresoComisionIso, ahoraIso),
    diasLimite + 30 // tope defensivo, no debería crecer sin límite
  );
  const proporcionConsumida = diasTranscurridos / diasLimite;

  let nivelUrgencia: EstadoLimiteLegal["nivelUrgencia"] = "normal";
  if (proporcionConsumida >= 0.85) nivelUrgencia = "critico";
  else if (proporcionConsumida >= 0.6) nivelUrgencia = "atencion";

  return { diasTranscurridos, diasLimite, proporcionConsumida, nivelUrgencia };
}
