import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
  accent?: "cyan" | "violet" | "ok" | "warn" | "info";
  trend?: { value: number; label?: string };
  bars?: number[];
  className?: string;
}

const accents: Record<
  NonNullable<StatCardProps["accent"]>,
  { text: string; glow: string; ring: string; gradient: string }
> = {
  cyan: {
    text: "text-cyan-accent",
    glow: "rgba(34,211,238,0.30)",
    ring: "rgba(34,211,238,0.20)",
    gradient: "from-cyan-accent/20",
  },
  violet: {
    text: "text-violet-accent",
    glow: "rgba(167,139,250,0.30)",
    ring: "rgba(167,139,250,0.20)",
    gradient: "from-violet-accent/20",
  },
  ok: {
    text: "text-ok",
    glow: "rgba(52,211,153,0.28)",
    ring: "rgba(52,211,153,0.20)",
    gradient: "from-ok/20",
  },
  warn: {
    text: "text-warn",
    glow: "rgba(251,191,36,0.28)",
    ring: "rgba(251,191,36,0.20)",
    gradient: "from-warn/20",
  },
  info: {
    text: "text-info",
    glow: "rgba(96,165,250,0.28)",
    ring: "rgba(96,165,250,0.20)",
    gradient: "from-info/20",
  },
};

export function StatCard({
  label,
  value,
  hint,
  icon,
  accent = "cyan",
  trend,
  bars,
  className = "",
}: StatCardProps) {
  const tone = accents[accent];

  return (
    <div
      className={`panel-surface panel-surface-hover group relative overflow-hidden p-4 ${className}`}
      style={{ borderColor: tone.ring }}
    >
      <div
        className={`pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${tone.gradient} to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`}
        aria-hidden="true"
      />

      <div className="relative flex items-start justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted">
          {label}
        </span>
        {icon && (
          <span
            className={`icon-chip h-7 w-7 shrink-0 ${tone.text}`}
            style={{ borderColor: tone.ring, background: "rgba(255,255,255,0.03)" }}
          >
            {icon}
          </span>
        )}
      </div>

      <div className="relative mt-2.5 flex items-end gap-2.5">
        <span className="font-mono text-[26px] font-semibold leading-none tracking-tight text-text-primary">
          {value}
        </span>
        {trend && (
          <span
            className={`mb-0.5 rounded px-1.5 py-0.5 font-mono text-[10px] ${
              trend.value >= 0 ? "bg-ok/12 text-ok" : "bg-err/12 text-err"
            }`}
          >
            {trend.value >= 0 ? "▲" : "▼"} {Math.abs(trend.value)}%
          </span>
        )}
      </div>

      {bars && bars.length > 0 && (
        <div className="relative mt-3 flex h-8 items-end gap-[3px]" aria-hidden="true">
          {bars.map((b, i) => (
            <span
              key={i}
              className={`flex-1 rounded-sm bg-gradient-to-t ${tone.gradient} to-transparent transition-all duration-500`}
              style={{
                height: `${Math.max(8, Math.min(100, b))}%`,
                opacity: 0.35 + (i / bars.length) * 0.5,
              }}
            />
          ))}
        </div>
      )}

      {hint && <div className="relative mt-2.5 text-[11px] text-text-muted">{hint}</div>}
    </div>
  );
}
