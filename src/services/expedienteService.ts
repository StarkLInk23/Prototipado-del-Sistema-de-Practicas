// Capa de servicio: simula la latencia y el contrato de una API real
// (MockAPI en el futuro). Los hooks de React nunca hablan directamente
// con los datos simulados; siempre pasan por aquí. Esto permite
// reemplazar esta implementación por fetch() real sin tocar la UI.

import type {
  ArchivoAdjunto,
  DictamenFormValues,
  ExpedienteComision,
  ExpedienteEstudiante,
} from "../domain/types";
import {
  expedienteEstudianteSimulado,
  expedientesComisionSimulados,
} from "../data/datosSimulados";
import { validarDictamen, validarEnvioSubsanacion } from "../domain/validaciones";
import { diasHabilesRestantesHasta } from "../domain/diasHabiles";

const LATENCIA_SIMULADA_MS = 700;

function esperar<T>(valor: T, ms = LATENCIA_SIMULADA_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(valor), ms));
}

export async function obtenerExpedienteDelEstudiante(): Promise<ExpedienteEstudiante> {
  return esperar(structuredClone(expedienteEstudianteSimulado));
}

export async function obtenerExpedientesDeLaComision(): Promise<ExpedienteComision[]> {
  return esperar(structuredClone(expedientesComisionSimulados));
}

/**
 * Simula el HTTP 401: si la "sesión" mock expira, emite el evento global
 * que el resto del sistema (interceptor real) escucha para redirigir a login.
 * Se mantiene aquí por consistencia arquitectónica con el resto del proyecto,
 * aunque este prototipo no fuerza la expiración de sesión.
 */
function emitirSesionExpiradaSiCorresponde(codigoSimuladoDeError?: number) {
  if (codigoSimuladoDeError === 401) {
    window.dispatchEvent(new CustomEvent("sesion-expirada"));
  }
}

export interface RespuestaEnvioSubsanacion {
  ok: boolean;
  errores: string[];
}

export async function enviarSubsanacion(
  archivosAdjuntados: ArchivoAdjunto[],
  anexosRequeridos: string[],
  fechaLimiteSubsanacion: string | null
): Promise<RespuestaEnvioSubsanacion> {
  const diasRestantes = fechaLimiteSubsanacion
    ? diasHabilesRestantesHasta(fechaLimiteSubsanacion, new Date().toISOString())
    : 0;

  const validacion = validarEnvioSubsanacion(archivosAdjuntados, anexosRequeridos, diasRestantes);
  if (!validacion.esValido) {
    return esperar({ ok: false, errores: validacion.errores }, 300);
  }

  emitirSesionExpiradaSiCorresponde();
  return esperar({ ok: true, errores: [] });
}

export interface RespuestaGuardarDictamen {
  ok: boolean;
  errores: string[];
}

export async function guardarDictamen(
  valores: DictamenFormValues
): Promise<RespuestaGuardarDictamen> {
  const validacion = validarDictamen(valores);
  if (!validacion.esValido) {
    return esperar({ ok: false, errores: validacion.errores }, 300);
  }

  emitirSesionExpiradaSiCorresponde();
  return esperar({ ok: true, errores: [] });
}
