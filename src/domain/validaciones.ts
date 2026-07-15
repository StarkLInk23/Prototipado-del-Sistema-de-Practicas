// Reglas de negocio (mock) del reglamento institucional. Separadas de la UI
// para cumplir el Principio de Responsabilidad Única: un componente visual
// solo debe preguntar "¿es válido?", nunca decidir la regla en sí misma.

import type { ArchivoAdjunto, DictamenFormValues } from "./types";

export interface ResultadoValidacion {
  esValido: boolean;
  errores: string[];
}

const NOTA_MINIMA = 0;
const NOTA_MAXIMA = 20;
const MIN_CARACTERES_CORRECCIONES = 20;

/** Valida el formulario de subsanación del estudiante antes de enviarlo. */
export function validarEnvioSubsanacion(
  archivosAdjuntados: ArchivoAdjunto[],
  anexosRequeridos: string[],
  diasHabilesRestantes: number
): ResultadoValidacion {
  const errores: string[] = [];

  if (diasHabilesRestantes <= 0) {
    errores.push("El plazo de subsanación venció. Contacta a la facultad para una prórroga.");
  }
  if (archivosAdjuntados.length < anexosRequeridos.length) {
    errores.push(
      `Debes adjuntar los ${anexosRequeridos.length} anexo(s) solicitados antes de enviar.`
    );
  }
  const archivoVacio = archivosAdjuntados.some((archivo) => archivo.tamanioBytes === 0);
  if (archivoVacio) {
    errores.push("Uno de los archivos adjuntados está vacío o no se cargó correctamente.");
  }

  return { esValido: errores.length === 0, errores };
}

/** Valida el dictamen rápido de la comisión antes de guardarlo. */
export function validarDictamen(valores: DictamenFormValues): ResultadoValidacion {
  const errores: string[] = [];

  if (valores.tipo === "Aprobado") {
    const notaNumerica = Number(valores.nota.replace(",", "."));
    if (valores.nota.trim() === "" || Number.isNaN(notaNumerica)) {
      errores.push("Ingresa la nota final para aprobar el expediente.");
    } else if (notaNumerica < NOTA_MINIMA || notaNumerica > NOTA_MAXIMA) {
      errores.push(`La nota debe estar entre ${NOTA_MINIMA} y ${NOTA_MAXIMA}.`);
    }
  }

  if (valores.tipo === "Observado") {
    if (valores.correcciones.trim().length < MIN_CARACTERES_CORRECCIONES) {
      errores.push(
        `Describe las correcciones con al menos ${MIN_CARACTERES_CORRECCIONES} caracteres para que el estudiante entienda qué corregir.`
      );
    }
  }

  return { esValido: errores.length === 0, errores };
}
