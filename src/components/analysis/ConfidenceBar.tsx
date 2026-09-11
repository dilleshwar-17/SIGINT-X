interface ConfidenceBarProps {
  label?: string;
  value: number;
}

function tone(value: number) {
  if (value >= 80) return "bg-ok";
  if (value >= 50) return "bg-warn";
  return "bg-err";
}

export function ConfidenceBar({ label, value }: ConfidenceBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="w-20 shrink-0 text-right font-mono text-xs text-text-secondary">
          {label}
        </span>
      )}
      <div className="h-1.5 flex-1 overflow-hidden rounded-sm bg-bg" role="presentation">
        <div
          className={`h-full rounded-sm ${tone(pct)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-10 shrink-0 font-mono text-xs text-text-secondary">
        {Math.round(pct)}%
      </span>
    </div>
  );
}