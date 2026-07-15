import { useState } from "react";
import { PantallaTrazabilidad } from "./features/estudiante/PantallaTrazabilidad";
import { PantallaBandejaComision } from "./features/comision/PantallaBandejaComision";

type Vista = "estudiante" | "comision";

export default function App() {
  const [vista, setVista] = useState<Vista>("estudiante");

  return (
    <div className="min-h-screen">
      <header className="border-b border-arena-200 bg-arena-50/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-rio-500/70">
              UNAMAD · SIGEP
            </p>
            <h1 className="font-[var(--font-display)] text-lg font-semibold text-rio-700">
              Sistema de Gestión de Prácticas Pre-Profesionales
            </h1>
          </div>

          <nav className="inline-flex self-start rounded-xl bg-arena-100 p-1 sm:self-auto" aria-label="Cambiar de vista">
            <button
              type="button"
              onClick={() => setVista("estudiante")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                vista === "estudiante" ? "bg-rio-600 text-arena-50 shadow-sm" : "text-tinta-500/70 hover:text-tinta-700"
              }`}
            >
              Vista Estudiante
            </button>
            <button
              type="button"
              onClick={() => setVista("comision")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                vista === "comision" ? "bg-rio-600 text-arena-50 shadow-sm" : "text-tinta-500/70 hover:text-tinta-700"
              }`}
            >
              Vista Comisión
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-8">
        {vista === "estudiante" ? <PantallaTrazabilidad /> : <PantallaBandejaComision />}
      </main>

      <footer className="mx-auto max-w-4xl px-5 pb-8 text-center text-xs text-tinta-500/45">
        Prototipo funcional — Frontend (UX/UI) · Reto A y Reto B
      </footer>
    </div>
  );
}
