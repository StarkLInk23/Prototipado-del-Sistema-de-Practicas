import type { EstadoTramite } from "../../domain/types";
import { construirEtapasStepper } from "../../domain/etapasTramite";

interface RioStepperProps {
  estado: EstadoTramite;
}

// El "río": en vez de una línea recta de progreso (el conector genérico
// que usa cualquier stepper), esta traza serpentea suavemente entre los
// nodos — un guiño a Madre de Dios, la región amazónica cuyo nombre viene
// del río homónimo. El expediente "fluye" de una orilla a la otra.
const PUNTOS_X = [40, 220, 380, 560];

export function RioStepper({ estado }: RioStepperProps) {
  const etapas = construirEtapasStepper(estado);
  const posicionActivaIndex = etapas.findIndex((etapa) => etapa.activa);
  const ultimaPosicionCompletadaX =
    PUNTOS_X[Math.max(0, posicionActivaIndex === -1 ? etapas.length - 1 : posicionActivaIndex)];

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox="0 0 600 90"
        className="w-full min-w-[420px]"
        role="img"
        aria-label={`Progreso del trámite: etapa actual ${etapas.find((e) => e.activa)?.etiqueta ?? ""}`}
      >
        <path
          d="M 40 30 C 140 5, 180 55, 220 30 S 340 5, 380 30 S 520 5, 560 30"
          fill="none"
          stroke="var(--color-arena-200)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M 40 30 C 140 5, 180 55, 220 30 S 340 5, 380 30 S 520 5, 560 30"
          fill="none"
          stroke="var(--color-oro-500)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="540"
          strokeDashoffset={540 - (540 * ultimaPosicionCompletadaX) / 560}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />

        {etapas.map((etapa, indice) => {
          const x = PUNTOS_X[indice];
          const color = etapa.completada
            ? "var(--color-rio-600)"
            : etapa.activa
            ? "var(--color-oro-500)"
            : "var(--color-arena-200)";

          return (
            <g key={etapa.posicion}>
              {etapa.activa && (
                <circle cx={x} cy={30} r={13} fill="var(--color-oro-500)" opacity={0.25}>
                  <animate attributeName="r" values="11;16;11" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0.05;0.3" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              <circle cx={x} cy={30} r={9} fill={color} stroke="var(--color-arena-50)" strokeWidth="2.5" />
              {etapa.completada && (
                <path
                  d={`M ${x - 4} 30 L ${x - 1} 33 L ${x + 4.5} 26.5`}
                  stroke="var(--color-arena-50)"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              <text
                x={x}
                y={62}
                textAnchor="middle"
                className="fill-tinta-500"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  fontWeight: etapa.activa ? 700 : 500,
                  opacity: etapa.activa || etapa.completada ? 1 : 0.55,
                }}
              >
                {etapa.etiqueta}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
