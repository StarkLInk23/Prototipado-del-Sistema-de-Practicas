import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Spinner } from "./Spinner";

interface BotonPrimarioProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  cargando?: boolean;
  variante?: "primario" | "secundario" | "peligro";
  children: ReactNode;
}

const ESTILOS_VARIANTE: Record<NonNullable<BotonPrimarioProps["variante"]>, string> = {
  primario: "bg-rio-600 text-arena-50 hover:bg-rio-700 focus-visible:outline-rio-600",
  secundario:
    "bg-transparent text-tinta-500 ring-1 ring-inset ring-arena-200 hover:bg-arena-100 focus-visible:outline-rio-600",
  peligro: "bg-alerta-500 text-arena-50 hover:bg-alerta-600 focus-visible:outline-alerta-500",
};

export function BotonPrimario({
  cargando = false,
  variante = "primario",
  disabled,
  children,
  className = "",
  ...resto
}: BotonPrimarioProps) {
  return (
    <button
      type="button"
      disabled={disabled || cargando}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${ESTILOS_VARIANTE[variante]} ${className}`}
      {...resto}
    >
      {cargando && <Spinner tamanioPx={15} />}
      {children}
    </button>
  );
}
