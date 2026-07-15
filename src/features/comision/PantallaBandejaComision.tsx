import { useState } from "react";
import { useBandejaComision } from "../../hooks/useBandejaComision";
import { TablaExpedientes } from "./TablaExpedientes";
import { ModalDictamen } from "./ModalDictamen";
import { Notificacion } from "../../components/ui/Notificacion";
import { Spinner } from "../../components/ui/Spinner";
import type { DictamenFormValues } from "../../domain/types";

export function PantallaBandejaComision() {
  const {
    filas,
    cargandoBandeja,
    emitirDictamen,
    guardandoDictamen,
    erroresDictamen,
    limpiarErroresDictamen,
  } = useBandejaComision();

  const [idExpedienteEnDictamen, setIdExpedienteEnDictamen] = useState<string | null>(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const expedienteSeleccionado =
    filas.find((fila) => fila.expediente.id === idExpedienteEnDictamen)?.expediente ?? null;

  async function manejarGuardar(valores: DictamenFormValues) {
    if (!idExpedienteEnDictamen) return;
    const exito = await emitirDictamen(idExpedienteEnDictamen, valores);
    if (exito) {
      setIdExpedienteEnDictamen(null);
      setMostrarConfirmacion(true);
      setTimeout(() => setMostrarConfirmacion(false), 4000);
    }
  }

  if (cargandoBandeja) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-arena-200 bg-arena-50 py-24 text-tinta-500/60">
        <Spinner tamanioPx={26} />
        <p className="text-sm">Cargando bandeja de la comisión…</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-arena-200 bg-arena-50 p-6 sm:p-8">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-rio-500/70">
          Expedientes asignados
        </p>
        <h1 className="font-[var(--font-display)] text-2xl font-semibold text-tinta-700">
          Bandeja de la Comisión Evaluadora
        </h1>
        <p className="mt-1 text-sm text-tinta-500/70">
          Ordenados por proximidad al límite legal de 15 días hábiles.
        </p>
      </div>

      <TablaExpedientes
        filas={filas}
        onDictaminar={(id) => {
          limpiarErroresDictamen();
          setIdExpedienteEnDictamen(id);
        }}
      />

      <ModalDictamen
        expediente={expedienteSeleccionado}
        guardando={guardandoDictamen}
        errores={erroresDictamen}
        onCerrar={() => setIdExpedienteEnDictamen(null)}
        onGuardar={manejarGuardar}
      />

      {mostrarConfirmacion && (
        <Notificacion mensaje="Dictamen guardado correctamente." onCerrar={() => setMostrarConfirmacion(false)} />
      )}
    </div>
  );
}
