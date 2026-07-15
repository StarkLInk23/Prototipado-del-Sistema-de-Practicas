interface AnilloConteoRegresivoProps {
  diasRestantes: number;
  diasTotales: number;
}

const RADIO = 30;
const CIRCUNFERENCIA = 2 * Math.PI * RADIO;

export function AnilloConteoRegresivo({ diasRestantes, diasTotales }: AnilloConteoRegresivoProps) {
  const proporcionRestante = Math.max(0, Math.min(1, diasRestantes / diasTotales));
  const colorAnillo =
    diasRestantes <= 1 ? "var(--color-alerta-500)" : diasRestantes <= 2 ? "var(--color-oro-500)" : "var(--color-rio-500)";

  return (
    <div className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center">
      <svg viewBox="0 0 76 76" className="h-full w-full -rotate-90">
        <circle cx="38" cy="38" r={RADIO} stroke="var(--color-arena-200)" strokeWidth="6" fill="none" />
        <circle
          cx="38"
          cy="38"
          r={RADIO}
          stroke={colorAnillo}
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={CIRCUNFERENCIA}
          strokeDashoffset={CIRCUNFERENCIA * (1 - proporcionRestante)}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <span className="font-[var(--font-display)] text-2xl font-semibold text-tinta-700">
          {diasRestantes}
        </span>
        <span className="text-[10px] text-tinta-500/60">de {diasTotales}</span>
      </div>
    </div>
  );
}
