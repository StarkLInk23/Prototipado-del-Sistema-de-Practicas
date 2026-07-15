import type { EstadoTramite } from "./types";

// La línea de tiempo institucional tiene 4 posiciones. La tercera posición
// es una bifurcación: el expediente sale "Observado" o "Aprobado", nunca
// ambas. Esta función traduce el estado real del expediente a la posición
// del stepper, sin que el componente visual conozca esta regla.

export interface EtapaStepper {
  posicion: 1 | 2 | 3 | 4;
  etiqueta: string;
  completada: boolean;
  activa: boolean;
}

const ETIQUETA_POR_POSICION: Record<number, string> = {
  1: "Entregado",
  2: "En Comisión",
  4: "Sustentación",
};

function posicionDelEstado(estado: EstadoTramite): number {
  switch (estado) {
    case "Entregado":
      return 1;
    case "En Comisión":
      return 2;
    case "Observado":
    case "Aprobado":
      return 3;
    case "Sustentación":
      return 4;
    default:
      return 1;
  }
}

export function construirEtapasStepper(estadoActual: EstadoTramite): EtapaStepper[] {
  const posicionActual = posicionDelEstado(estadoActual);

  return [1, 2, 3, 4].map((posicion) => {
    let etiqueta = ETIQUETA_POR_POSICION[posicion];
    if (posicion === 3) {
      if (posicionActual > 3) {
        // Si ya avanzó a Sustentación, la única bifurcación posible fue "Aprobado".
        etiqueta = "Aprobado";
      } else if (posicionActual === 3) {
        etiqueta = estadoActual; // "Observado" o "Aprobado", el valor real
      } else {
        etiqueta = "Observado/Aprobado";
      }
    }

    return {
      posicion: posicion as 1 | 2 | 3 | 4,
      etiqueta,
      completada: posicion < posicionActual,
      activa: posicion === posicionActual,
    };
  });
}
