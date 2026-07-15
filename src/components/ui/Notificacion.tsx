interface NotificacionProps {
  mensaje: string;
  onCerrar: () => void;
}

export function Notificacion({ mensaje, onCerrar }: NotificacionProps) {
  return (
    <div
      role="status"
      className="fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-3 rounded-xl bg-rio-700 px-5 py-3.5 text-sm font-medium text-arena-50 shadow-xl animate-[fadeIn_0.2s_ease-out]"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="8" stroke="var(--color-oro-300)" strokeWidth="1.4" />
        <path d="M5.5 9.2 7.6 11.5 12.5 6.5" stroke="var(--color-oro-300)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {mensaje}
      <button type="button" onClick={onCerrar} aria-label="Cerrar notificación" className="ml-1 text-arena-50/70 hover:text-arena-50">
        ✕
      </button>
    </div>
  );
}
