interface ConfidenceBarProps {
  label?: string;
  value: number;
  size?: "sm" | "md";
}

function tone(value: number) {
  if (value >= 80) return { fill: "linear-gradient(90deg, #34d399, #22d3ee)", glow: "52,211,153" };
  if (value >= 50) return { fill: "linear-gradient(90deg, #fbbf24, #fb923c)", glow: "251,191,36" };
  return { fill: "linear-gradient(90deg, #f87171, #ef4444)", glow: "248,113,113" };
}

export function ConfidenceBar({ label, value, size = "md" }: ConfidenceBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  const t = tone(pct);
  const barHeight = size === "sm" ? "h-1" : "h-1.5";

  return (
    <div className="flex items-center gap-2.5">
      {label && (
        <span className="w-[86px] shrink-0 truncate text-right text-[11px] text-text-secondary">
          {label}
        </span>
      )}
      <div
        className={`${barHeight} flex-1 overflow-hidden rounded-full bg-white/[0.07]`}
        role="presentation"
      >
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: t.fill,
            boxShadow: `0 0 10px rgba(${t.glow},0.45)`,
          }}
        />
      </div>
      <span className="w-9 shrink-0 text-right font-mono text-[11px] tabular-nums text-text-secondary">
        {Math.round(pct)}%
      </span>
    </div>
  );
}
