import { useEffect, useMemo, useState } from "react";
import type { DictamenFormValues, ExpedienteComision } from "../domain/types";
import { guardarDictamen, obtenerExpedientesDeLaComision } from "../services/expedienteService";
import { evaluarLimiteLegal } from "../domain/diasHabiles";

export interface FilaExpediente {
  expediente: ExpedienteComision;
  estadoLimite: ReturnType<typeof evaluarLimiteLegal>;
}

export function useBandejaComision() {
  const [expedientes, setExpedientes] = useState<ExpedienteComision[]>([]);
  const [cargandoBandeja, setCargandoBandeja] = useState(true);
  const [guardandoDictamen, setGuardandoDictamen] = useState(false);
  const [erroresDictamen, setErroresDictamen] = useState<string[]>([]);

  useEffect(() => {
    let cancelado = false;
    obtenerExpedientesDeLaComision().then((datos) => {
      if (!cancelado) {
        setExpedientes(datos);
        setCargandoBandeja(false);
      }
    });
    return () => {
      cancelado = true;
    };
  }, []);

  // Ordena por proximidad al límite legal: los más urgentes primero.
  // Esta regla vive en el hook (orquestación), no en el componente visual.
  const filas: FilaExpediente[] = useMemo(() => {
    const ahoraIso = new Date().toISOString();
    return expedientes
      .map((expediente) => ({
        expediente,
        estadoLimite: evaluarLimiteLegal(
          expediente.fechaIngresoComision,
          ahoraIso,
          expediente.diasHabilesLimiteLegal
        ),
      }))
      .sort((a, b) => b.estadoLimite.proporcionConsumida - a.estadoLimite.proporcionConsumida);
  }, [expedientes]);

  async function emitirDictamen(idExpediente: string, valores: DictamenFormValues) {
    setGuardandoDictamen(true);
    const respuesta = await guardarDictamen(valores);
    setGuardandoDictamen(false);

    if (!respuesta.ok) {
      setErroresDictamen(respuesta.errores);
      return false;
    }

    setErroresDictamen([]);
    setExpedientes((previos) =>
      previos.map((expediente) =>
        expediente.id === idExpediente
          ? {
              ...expediente,
              dictamen: {
                tipo: valores.tipo,
                nota: valores.tipo === "Aprobado" ? Number(valores.nota) : undefined,
                correcciones: valores.tipo === "Observado" ? valores.correcciones : undefined,
                fecha: new Date().toISOString(),
              },
            }
          : expediente
      )
    );
    return true;
  }

  function limpiarErroresDictamen() {
    setErroresDictamen([]);
  }

  return {
    filas,
    cargandoBandeja,
    emitirDictamen,
    guardandoDictamen,
    erroresDictamen,
    limpiarErroresDictamen,
  };
}
