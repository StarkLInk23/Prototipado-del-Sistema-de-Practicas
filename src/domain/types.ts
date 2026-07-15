// Modelos de dominio del Sistema de Gestión de Prácticas Pre-Profesionales.
// Esta capa no importa nada de React: describe únicamente el "qué",
// nunca el "cómo se pinta en pantalla" (Principio de Responsabilidad Única).

export type EstadoTramite =
  | "Entregado"
  | "En Comisión"
  | "Observado"
  | "Aprobado"
  | "Sustentación";

export interface Observacion {
  id: string;
  capitulo: string;
  descripcion: string;
}

export interface ArchivoAdjunto {
  id: string;
  nombre: string;
  tamanioBytes: number;
}

export interface ExpedienteEstudiante {
  id: string;
  codigo: string; // p.ej. "2026-0143"
  estudiante: string;
  estado: EstadoTramite;
  fechaIngreso: string; // ISO
  diasHabilesLimiteSubsanacion: number; // regla institucional: máx. 5
  fechaLimiteSubsanacion: string | null; // ISO, solo si Observado
  observaciones: Observacion[];
  anexosRequeridos: string[];
  archivosAdjuntados: ArchivoAdjunto[];
}

export type DictamenTipo = "Aprobado" | "Observado";

export interface ExpedienteComision {
  id: string;
  codigo: string;
  estudiante: string;
  fechaIngresoComision: string; // ISO
  diasHabilesLimiteLegal: number; // regla institucional: 15 días hábiles
  dictamen?: {
    tipo: DictamenTipo;
    nota?: number;
    correcciones?: string;
    fecha: string;
  };
}

export interface DictamenFormValues {
  tipo: DictamenTipo;
  nota: string; // se valida como número 0-20 antes de convertir
  correcciones: string;
}
