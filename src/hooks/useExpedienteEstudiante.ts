import { useCallback, useEffect, useState } from "react";
import type { ArchivoAdjunto, ExpedienteEstudiante } from "../domain/types";
import { enviarSubsanacion, obtenerExpedienteDelEstudiante } from "../services/expedienteService";
import { diasHabilesRestantesHasta } from "../domain/diasHabiles";

export function useExpedienteEstudiante() {
  const [expediente, setExpediente] = useState<ExpedienteEstudiante | null>(null);
  const [cargandoExpediente, setCargandoExpediente] = useState(true);
  const [enviandoSubsanacion, setEnviandoSubsanacion] = useState(false);
  const [erroresSubsanacion, setErroresSubsanacion] = useState<string[]>([]);
  const [archivosPendientes, setArchivosPendientes] = useState<ArchivoAdjunto[]>([]);

  useEffect(() => {
    let cancelado = false;
    obtenerExpedienteDelEstudiante().then((datos) => {
      if (!cancelado) {
        setExpediente(datos);
        setCargandoExpediente(false);
      }
    });
    return () => {
      cancelado = true;
    };
  }, []);

  const diasHabilesRestantes = expediente?.fechaLimiteSubsanacion
    ? diasHabilesRestantesHasta(expediente.fechaLimiteSubsanacion, new Date().toISOString())
    : 0;

  const agregarArchivo = useCallback((archivo: ArchivoAdjunto) => {
    setArchivosPendientes((previos) => [...previos, archivo]);
    setErroresSubsanacion([]);
  }, []);

  const quitarArchivo = useCallback((idArchivo: string) => {
    setArchivosPendientes((previos) => previos.filter((archivo) => archivo.id !== idArchivo));
  }, []);

  const enviar = useCallback(async () => {
    if (!expediente) return false;
    setEnviandoSubsanacion(true);
    const respuesta = await enviarSubsanacion(
      archivosPendientes,
      expediente.anexosRequeridos,
      expediente.fechaLimiteSubsanacion
    );
    setEnviandoSubsanacion(false);

    if (!respuesta.ok) {
      setErroresSubsanacion(respuesta.errores);
      return false;
    }
    setErroresSubsanacion([]);
    return true;
  }, [archivosPendientes, expediente]);

  return {
    expediente,
    cargandoExpediente,
    diasHabilesRestantes,
    archivosPendientes,
    agregarArchivo,
    quitarArchivo,
    enviar,
    enviandoSubsanacion,
    erroresSubsanacion,
  };
}
