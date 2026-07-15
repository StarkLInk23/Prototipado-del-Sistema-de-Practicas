import { useState } from "react";
import type { DictamenFormValues, DictamenTipo, ExpedienteComision } from "../../domain/types";
import { Modal } from "../../components/ui/Modal";
import { BotonPrimario } from "../../components/ui/BotonPrimario";

interface ModalDictamenProps {
  expediente: ExpedienteComision | null;
  guardando: boolean;
  errores: string[];
  onCerrar: () => void;
  onGuardar: (valores: DictamenFormValues) => void;
}

const VALORES_INICIALES: DictamenFormValues = { tipo: "Aprobado", nota: "", correcciones: "" };

export function ModalDictamen({ expediente, guardando, errores, onCerrar, onGuardar }: ModalDictamenProps) {
  const [valores, setValores] = useState<DictamenFormValues>(VALORES_INICIALES);

  function alCerrar() {
    setValores(VALORES_INICIALES);
    onCerrar();
  }

  function cambiarTipo(tipo: DictamenTipo) {
    setValores((previo) => ({ ...previo, tipo }));
  }

  if (!expediente) return null;

  return (
    <Modal
      abierto={Boolean(expediente)}
      onCerrar={alCerrar}
      titulo="Dictamen rápido"
      subtitulo={`Expediente ${expediente.codigo} · ${expediente.estudiante}`}
      pie={
        <>
          <BotonPrimario variante="secundario" onClick={alCerrar} disabled={guardando}>
            Cancelar
          </BotonPrimario>
          <BotonPrimario onClick={() => onGuardar(valores)} cargando={guardando}>
            {guardando ? "Guardando…" : "Guardar dictamen"}
          </BotonPrimario>
        </>
      }
    >
      <div className="mb-5 inline-flex w-full rounded-xl bg-arena-100 p-1">
        {(["Aprobado", "Observado"] as DictamenTipo[]).map((tipo) => (
          <button
            key={tipo}
            type="button"
            onClick={() => cambiarTipo(tipo)}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
              valores.tipo === tipo
                ? "bg-rio-600 text-arena-50 shadow-sm"
                : "text-tinta-500/70 hover:text-tinta-700"
            }`}
          >
            {tipo}
          </button>
        ))}
      </div>

      {valores.tipo === "Aprobado" ? (
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-tinta-700">Nota final</span>
          <input
            type="number"
            min={0}
            max={20}
            step={0.5}
            placeholder="0 - 20"
            value={valores.nota}
            onChange={(evento) => setValores((previo) => ({ ...previo, nota: evento.target.value }))}
            className="w-full rounded-lg border border-arena-200 bg-arena-50 px-3.5 py-2.5 text-sm text-tinta-700 outline-none ring-rio-500 focus:ring-2"
          />
        </label>
      ) : (
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-tinta-700">
            Correcciones para el estudiante
          </span>
          <textarea
            rows={5}
            placeholder="Describe con precisión qué debe corregir el estudiante…"
            value={valores.correcciones}
            onChange={(evento) =>
              setValores((previo) => ({ ...previo, correcciones: evento.target.value }))
            }
            className="w-full resize-none rounded-lg border border-arena-200 bg-arena-50 px-3.5 py-2.5 text-sm text-tinta-700 outline-none ring-rio-500 focus:ring-2"
          />
        </label>
      )}

      {errores.length > 0 && (
        <div role="alert" className="mt-4 rounded-xl border border-alerta-300 bg-alerta-100/60 p-4">
          <ul className="list-disc space-y-1 pl-4 text-sm text-alerta-600">
            {errores.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </Modal>
  );
}
