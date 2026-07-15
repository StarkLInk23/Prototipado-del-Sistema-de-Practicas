import type { ArchivoAdjunto, ExpedienteEstudiante } from "../../domain/types";
import { Modal } from "../../components/ui/Modal";
import { BotonPrimario } from "../../components/ui/BotonPrimario";
import { ZonaCargaArchivo } from "../../components/ui/ZonaCargaArchivo";

interface ModalObservacionesProps {
  abierto: boolean;
  expediente: ExpedienteEstudiante;
  diasHabilesRestantes: number;
  archivosPendientes: ArchivoAdjunto[];
  erroresSubsanacion: string[];
  enviandoSubsanacion: boolean;
  onCerrar: () => void;
  onAgregarArchivo: (archivo: ArchivoAdjunto) => void;
  onQuitarArchivo: (id: string) => void;
  onEnviar: () => void;
}

function formatearTamanio(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(0)} KB`;
}

export function ModalObservaciones({
  abierto,
  expediente,
  diasHabilesRestantes,
  archivosPendientes,
  erroresSubsanacion,
  enviandoSubsanacion,
  onCerrar,
  onAgregarArchivo,
  onQuitarArchivo,
  onEnviar,
}: ModalObservacionesProps) {
  return (
    <Modal
      abierto={abierto}
      onCerrar={onCerrar}
      titulo="Observaciones a subsanar"
      subtitulo={`Expediente ${expediente.codigo}`}
      pie={
        <>
          <BotonPrimario variante="secundario" onClick={onCerrar} disabled={enviandoSubsanacion}>
            Cancelar
          </BotonPrimario>
          <BotonPrimario onClick={onEnviar} cargando={enviandoSubsanacion}>
            {enviandoSubsanacion ? "Enviando…" : "Enviar subsanación"}
          </BotonPrimario>
        </>
      }
    >
      <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-oro-100 px-3 py-1.5 text-sm font-medium text-oro-600">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.4" />
          <path d="M7 4v3.2l2 1.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        {diasHabilesRestantes} días hábiles restantes para corregir
      </div>

      <section className="mb-6">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-tinta-500/60">
          Correcciones solicitadas por la comisión
        </h3>
        <ul className="space-y-3">
          {expediente.observaciones.map((observacion) => (
            <li key={observacion.id} className="rounded-xl bg-arena-100 p-4">
              <p className="text-sm font-semibold text-rio-700">{observacion.capitulo}</p>
              <p className="mt-1 text-sm text-tinta-500/85">{observacion.descripcion}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-tinta-500/60">Anexos</h3>
        <ul className="mb-3 space-y-1.5">
          {expediente.anexosRequeridos.map((anexo) => (
            <li key={anexo} className="flex gap-2 text-sm text-tinta-500/85">
              <span className="text-rio-500">•</span>
              {anexo}
            </li>
          ))}
        </ul>

        <ZonaCargaArchivo onArchivoCargado={onAgregarArchivo} />

        {archivosPendientes.length > 0 && (
          <ul className="mt-3 space-y-2">
            {archivosPendientes.map((archivo) => (
              <li
                key={archivo.id}
                className="flex items-center justify-between rounded-lg bg-rio-50 px-3 py-2 text-sm"
              >
                <span className="truncate text-tinta-700">
                  {archivo.nombre}{" "}
                  <span className="text-tinta-500/50">({formatearTamanio(archivo.tamanioBytes)})</span>
                </span>
                <button
                  type="button"
                  onClick={() => onQuitarArchivo(archivo.id)}
                  className="ml-2 shrink-0 text-tinta-500/50 hover:text-alerta-500"
                  aria-label={`Quitar ${archivo.nombre}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {erroresSubsanacion.length > 0 && (
        <div role="alert" className="mt-5 rounded-xl border border-alerta-300 bg-alerta-100/60 p-4">
          <ul className="list-disc space-y-1 pl-4 text-sm text-alerta-600">
            {erroresSubsanacion.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </Modal>
  );
}
