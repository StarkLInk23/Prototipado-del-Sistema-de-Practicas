import { AnilloConteoRegresivo } from "../../components/ui/AnilloConteoRegresivo";
import { BotonPrimario } from "../../components/ui/BotonPrimario";

interface BannerObservacionProps {
  diasHabilesRestantes: number;
  diasHabilesLimite: number;
  onVerDetalle: () => void;
}

export function BannerObservacion({
  diasHabilesRestantes,
  diasHabilesLimite,
  onVerDetalle,
}: BannerObservacionProps) {
  const esUrgente = diasHabilesRestantes <= 1;

  return (
    <div
      role="alert"
      className={`flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between ${
        esUrgente ? "border-alerta-300 bg-alerta-100/60" : "border-oro-300 bg-oro-100/50"
      }`}
    >
      <div className="flex items-center gap-4">
        <AnilloConteoRegresivo diasRestantes={diasHabilesRestantes} diasTotales={diasHabilesLimite} />
        <div>
          <p className="font-[var(--font-display)] text-lg font-semibold text-tinta-700">
            Tu expediente fue observado
          </p>
          <p className="text-sm text-tinta-500/80">
            Quedan <strong>{diasHabilesRestantes} días hábiles</strong> restantes.
            Debes subsanar las observaciones antes de la fecha límite.
          </p>
        </div>
      </div>
      <BotonPrimario onClick={onVerDetalle} className="sm:shrink-0">
        Ver detalle de observaciones
      </BotonPrimario>
    </div>
  );
}
