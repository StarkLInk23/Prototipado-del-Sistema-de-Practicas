# SIGEP — Prototipado del Sistema de Prácticas (Frontend)

Prototipo funcional de dos pantallas del Sistema de Gestión de Prácticas
Pre-Profesionales, construido con **React + Vite + TypeScript + Tailwind CSS**.

- **Reto A** — Pantalla del Estudiante (Trazabilidad): stepper de 4 etapas,
  banner de observación con conteo regresivo de días hábiles, y modal de
  subsanación con carga de archivos (drag & drop).
- **Reto B** — Bandeja de la Comisión Evaluadora: tabla de expedientes
  ordenada por proximidad al límite legal de 15 días hábiles, con jerarquía
  visual por urgencia, y modal de "Dictamen Rápido" (Aprobado/Observado).

## Cómo ejecutarlo

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`. El encabezado tiene un selector para alternar
entre "Vista Estudiante" y "Vista Comisión".

Para generar el build de producción:

```bash
npm run build
```

## Arquitectura (Principio de Responsabilidad Única)

El proyecto separa explícitamente la lógica de negocio de la interfaz visual,
tal como pide la rúbrica:

```
src/
  domain/          # Reglas de negocio puras (sin React, sin efectos)
    types.ts              -> modelos de dominio (Expediente, Dictamen, etc.)
    diasHabiles.ts        -> cálculo de días hábiles y urgencia por límite legal
    validaciones.ts       -> reglas de validación de formularios
    etapasTramite.ts      -> mapeo de estado del trámite a posición del stepper

  services/        # Simulan la capa de API/MockAPI (con latencia real)
    expedienteService.ts

  data/            # Datos simulados (mock), reemplazables por MockAPI real
    datosSimulados.ts

  hooks/           # Orquestación: conectan servicios + dominio con la UI
    useExpedienteEstudiante.ts
    useBandejaComision.ts

  components/      # Piezas de UI reutilizables, sin lógica de negocio
    ui/  (Modal, BotonPrimario, Spinner, ZonaCargaArchivo, AnilloConteoRegresivo, Notificacion)
    stepper/ (RioStepper)

  features/        # Pantallas concretas, componen hooks + components
    estudiante/  (PantallaTrazabilidad, BannerObservacion, ModalObservaciones)
    comision/    (PantallaBandejaComision, TablaExpedientes, ModalDictamen)
```

Ningún componente visual decide *si* una nota es válida o *cuántos* días
hábiles quedan: solo preguntan al `domain` o al `hook`, y pintan el resultado.
Esto permite reemplazar `services/expedienteService.ts` por llamadas reales a
MockAPI o al backend sin tocar ni un componente visual.

## Reglas de negocio simuladas (mocking)

- **Subsanación**: bloqueada si faltan anexos requeridos, si el plazo (máx.
  5 días hábiles) ya venció, o si algún archivo llegó vacío/corrupto.
- **Dictamen**: "Aprobado" exige una nota numérica entre 0 y 20; "Observado"
  exige una descripción de correcciones de al menos 20 caracteres.
- **Urgencia de la bandeja**: se calcula la proporción de los 15 días hábiles
  legales ya consumidos y se clasifica en normal / atención / crítico,
  lo que determina el orden de la tabla y el color de la barra lateral.
- **Sesión expirada (401)**: el servicio emite un evento global
  `sesion-expirada` en caso de error de autenticación simulado, consistente
  con el resto del sistema (CU-13 a CU-17) que ya maneja este evento.

## Identidad visual

La paleta (verde río/bosque, oro de cosecha, rojo tierra) y el conector
serpenteante del stepper -en vez de una barra recta genérica- son un guiño
deliberado a Madre de Dios, la región amazónica cuyo nombre proviene del río
homónimo: el expediente "fluye" de una orilla a la otra del proceso.

## Nota sobre fidelidad "pixel perfect"

Este prototipo se construyó a partir de la descripción textual y el
wireframe en texto plano del PDF de prototipado (no se recibieron las
imágenes Figma originales). La estructura, los estados y el copy siguen
exactamente lo especificado (expediente 2026-0143, expedientes de la
comisión 2026-0089 / 0102 / 0117 / 0130, límites de 5 y 15 días hábiles).
Si tienes el archivo Figma o capturas de pantalla del diseño original,
puedo ajustar espaciados, tipografía y colores para una réplica exacta.
