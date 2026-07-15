// Datos simulados (mock) — reemplazar por llamadas reales a la API/MockAPI
// cuando el backend esté disponible. El resto de la app no debe saber
// que estos datos son estáticos: solo consume los servicios.

import type { ExpedienteEstudiante, ExpedienteComision } from "../domain/types";
import { sumarDiasHabiles } from "../domain/diasHabiles";

const AHORA = new Date().toISOString();

export const expedienteEstudianteSimulado: ExpedienteEstudiante = {
  id: "exp-2026-0143",
  codigo: "2026-0143",
  estudiante: "Estudiante actual",
  estado: "Observado",
  fechaIngreso: sumarDiasHabiles(AHORA, -10),
  diasHabilesLimiteSubsanacion: 5,
  fechaLimiteSubsanacion: sumarDiasHabiles(AHORA, 3),
  observaciones: [
    {
      id: "obs-1",
      capitulo: "Capítulo 2, sección 2.3",
      descripcion: "Falta sustentar la metodología con fuentes actualizadas.",
    },
  ],
  anexosRequeridos: [
    "Adjuntar carta de consentimiento informado firmada.",
    "Adjuntar documento corregido.",
  ],
  archivosAdjuntados: [],
};

export const expedientesComisionSimulados: ExpedienteComision[] = [
  {
    id: "com-2026-0089",
    codigo: "2026-0089",
    estudiante: "Rosa Quispe M.",
    fechaIngresoComision: sumarDiasHabiles(AHORA, -14),
    diasHabilesLimiteLegal: 15,
  },
  {
    id: "com-2026-0102",
    codigo: "2026-0102",
    estudiante: "Jorge Huamán T.",
    fechaIngresoComision: sumarDiasHabiles(AHORA, -12),
    diasHabilesLimiteLegal: 15,
  },
  {
    id: "com-2026-0117",
    codigo: "2026-0117",
    estudiante: "Ana Ttito P.",
    fechaIngresoComision: sumarDiasHabiles(AHORA, -6),
    diasHabilesLimiteLegal: 15,
  },
  {
    id: "com-2026-0130",
    codigo: "2026-0130",
    estudiante: "Luis Ccahuana R.",
    fechaIngresoComision: sumarDiasHabiles(AHORA, -2),
    diasHabilesLimiteLegal: 15,
  },
];
