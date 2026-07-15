import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface ModalProps {
  abierto: boolean;
  titulo: string;
  subtitulo?: string;
  onCerrar: () => void;
  children: ReactNode;
  pie?: ReactNode;
}

export function Modal({ abierto, titulo, subtitulo, onCerrar, children, pie }: ModalProps) {
  const referenciaDialogo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    function alPresionarTecla(evento: KeyboardEvent) {
      if (evento.key === "Escape") onCerrar();
    }
    document.addEventListener("keydown", alPresionarTecla);
    return () => document.removeEventListener("keydown", alPresionarTecla);
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-tinta-500/50 backdrop-blur-[2px] p-0 sm:items-center sm:p-4 animate-[fadeIn_0.15s_ease-out]"
      role="presentation"
      onClick={(evento) => {
        if (evento.target === evento.currentTarget) onCerrar();
      }}
    >
      <div
        ref={referenciaDialogo}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-arena-50 shadow-2xl ring-1 ring-black/5"
      >
        <div className="flex items-start justify-between gap-4 border-b border-arena-200 px-6 py-5">
          <div>
            <h2 id="modal-titulo" className="font-[var(--font-display)] text-xl font-semibold text-rio-700">
              {titulo}
            </h2>
            {subtitulo && <p className="mt-1 text-sm text-tinta-500/70">{subtitulo}</p>}
          </div>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar ventana"
            className="shrink-0 rounded-full p-2 text-tinta-500/60 transition hover:bg-arena-200 hover:text-tinta-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rio-500"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>

        {pie && <div className="flex justify-end gap-3 border-t border-arena-200 px-6 py-4">{pie}</div>}
      </div>
    </div>
  );
}
