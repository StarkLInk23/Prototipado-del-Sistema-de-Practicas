import { useState } from "react";
import { useExpedienteEstudiante } from "../../hooks/useExpedienteEstudiante";
import { RioStepper } from "../../components/stepper/RioStepper";
import { BannerObservacion } from "./BannerObservacion";
import { ModalObservaciones } from "./ModalObservaciones";
import { Notificacion } from "../../components/ui/Notificacion";
import { Spinner } from "../../components/ui/Spinner";

export function PantallaTrazabilidad() {
  const {
    expediente,
    cargandoExpediente,
    diasHabilesRestantes,
    archivosPendientes,
    agregarArchivo,
    quitarArchivo,
    enviar,
    enviandoSubsanacion,
    erroresSubsanacion,
  } = useExpedienteEstudiante();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  if (cargandoExpediente || !expediente) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-arena-200 bg-arena-50 py-24 text-tinta-500/60">
        <Spinner tamanioPx={26} />
        <p className="text-sm">Cargando tu expediente…</p>
      </div>
    );
  }

  async function manejarEnvio() {
    const exito = await enviar();
    if (exito) {
      setModalAbierto(false);
      setMostrarConfirmacion(true);
      setTimeout(() => setMostrarConfirmacion(false), 4000);
    }
  }

  return (
    <div className="rounded-2xl border border-arena-200 bg-arena-50 p-6 sm:p-8">
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-rio-500/70">
            Estado de tu trámite
          </p>
          <h1 className="font-[var(--font-display)] text-2xl font-semibold text-tinta-700">
            Expediente N° {expediente.codigo}
          </h1>
        </div>
      </div>

      <div className="mb-8 rounded-2xl bg-arena-100/60 p-4 sm:p-6">
        <RioStepper estado={expediente.estado} />
      </div>

      {expediente.estado === "Observado" && (
        <BannerObservacion
          diasHabilesRestantes={diasHabilesRestantes}
          diasHabilesLimite={expediente.diasHabilesLimiteSubsanacion}
          onVerDetalle={() => setModalAbierto(true)}
        />
      )}

      {expediente.estado !== "Observado" && (
        <div className="rounded-2xl border border-arena-200 bg-arena-100/50 p-5 text-sm text-tinta-500/75">
          No tienes observaciones pendientes por subsanar en este momento.
        </div>
      )}

      <ModalObservaciones
        abierto={modalAbierto}
        expediente={expediente}
        diasHabilesRestantes={diasHabilesRestantes}
        archivosPendientes={archivosPendientes}
        erroresSubsanacion={erroresSubsanacion}
        enviandoSubsanacion={enviandoSubsanacion}
        onCerrar={() => setModalAbierto(false)}
        onAgregarArchivo={agregarArchivo}
        onQuitarArchivo={quitarArchivo}
        onEnviar={manejarEnvio}
      />

      {mostrarConfirmacion && (
        <Notificacion
          mensaje="Subsanación enviada. La comisión revisará tu expediente."
          onCerrar={() => setMostrarConfirmacion(false)}
        />
      )}
    </div>
  );
}
