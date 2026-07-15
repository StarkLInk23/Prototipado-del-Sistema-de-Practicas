import { useRef, useState } from "react";
import type { ArchivoAdjunto } from "../../domain/types";

interface ZonaCargaArchivoProps {
  onArchivoCargado: (archivo: ArchivoAdjunto) => void;
}

export function ZonaCargaArchivo({ onArchivoCargado }: ZonaCargaArchivoProps) {
  const [enArrastre, setEnArrastre] = useState(false);
  const referenciaInput = useRef<HTMLInputElement>(null);

  function procesarArchivos(listaArchivos: FileList | null) {
    if (!listaArchivos || listaArchivos.length === 0) return;
    Array.from(listaArchivos).forEach((archivo) => {
      onArchivoCargado({
        id: `${archivo.name}-${archivo.size}-${crypto.randomUUID()}`,
        nombre: archivo.name,
        tamanioBytes: archivo.size,
      });
    });
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => referenciaInput.current?.click()}
      onKeyDown={(evento) => {
        if (evento.key === "Enter" || evento.key === " ") referenciaInput.current?.click();
      }}
      onDragOver={(evento) => {
        evento.preventDefault();
        setEnArrastre(true);
      }}
      onDragLeave={() => setEnArrastre(false)}
      onDrop={(evento) => {
        evento.preventDefault();
        setEnArrastre(false);
        procesarArchivos(evento.dataTransfer.files);
      }}
      className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${
        enArrastre ? "border-rio-500 bg-rio-50" : "border-arena-200 bg-arena-50 hover:border-rio-300"
      }`}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-rio-600">
        <path
          d="M12 16V4m0 0L7 9m5-5 5 5M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="text-sm font-medium text-tinta-500">
        Arrastra tu archivo o haz clic para subirlo
      </p>
      <p className="text-xs text-tinta-500/60">PDF, DOCX — máx. 10 MB</p>
      <input
        ref={referenciaInput}
        type="file"
        className="hidden"
        onChange={(evento) => procesarArchivos(evento.target.files)}
      />
    </div>
  );
}
