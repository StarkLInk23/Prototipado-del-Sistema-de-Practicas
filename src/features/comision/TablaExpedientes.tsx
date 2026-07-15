import type { FilaExpediente } from "../../hooks/useBandejaComision";
import { BotonPrimario } from "../../components/ui/BotonPrimario";

interface TablaExpedientesProps {
  filas: FilaExpediente[];
  onDictaminar: (expedienteId: string) => void;
}

const ESTILO_URGENCIA: Record<string, { barra: string; texto: string }> = {
  critico: { barra: "bg-alerta-500", texto: "text-alerta-600" },
  atencion: { barra: "bg-oro-500", texto: "text-oro-600" },
  normal: { barra: "bg-rio-500", texto: "text-rio-600" },
};

export function TablaExpedientes({ filas, onDictaminar }: TablaExpedientesProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-arena-200 bg-arena-50">
      <div className="hidden grid-cols-[1fr_1.4fr_1fr_auto] gap-4 border-b border-arena-200 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-tinta-500/60 sm:grid">
        <span>Expediente</span>
        <span>Estudiante</span>
        <span>Días transcurridos</span>
        <span className="text-right">Acción</span>
      </div>

      <ul>
        {filas.map(({ expediente, estadoLimite }) => {
          const estilo = ESTILO_URGENCIA[estadoLimite.nivelUrgencia];
          const yaDictaminado = Boolean(expediente.dictamen);

          return (
            <li
              key={expediente.id}
              className="relative grid grid-cols-2 items-center gap-3 border-b border-arena-200 py-4 pl-4 pr-5 last:border-b-0 sm:grid-cols-[1fr_1.4fr_1fr_auto] sm:gap-4 sm:py-3.5"
            >
              <span className={`absolute left-0 top-0 h-full w-1.5 ${estilo.barra}`} aria-hidden="true" />

              <span className="font-[var(--font-display)] font-medium text-tinta-700">
                {expediente.codigo}
              </span>
              <span className="text-sm text-tinta-500/85">{expediente.estudiante}</span>

              <span className={`text-sm font-semibold ${estilo.texto}`}>
                {estadoLimite.diasTranscurridos} / {estadoLimite.diasLimite}
              </span>

              <span className="col-span-2 justify-self-end sm:col-span-1">
                {yaDictaminado ? (
                  <span className="rounded-full bg-rio-100 px-3 py-1.5 text-xs font-semibold text-rio-700">
                    {expediente.dictamen?.tipo}
                  </span>
                ) : (
                  <BotonPrimario variante="secundario" onClick={() => onDictaminar(expediente.id)}>
                    Dictaminar
                  </BotonPrimario>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
