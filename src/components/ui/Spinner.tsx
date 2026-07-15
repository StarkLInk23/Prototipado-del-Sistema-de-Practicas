interface SpinnerProps {
  tamanioPx?: number;
  className?: string;
}

export function Spinner({ tamanioPx = 16, className = "" }: SpinnerProps) {
  return (
    <svg
      className={`animate-spin ${className}`}
      width={tamanioPx}
      height={tamanioPx}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
