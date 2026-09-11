import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
  accent?: "cyan" | "violet" | "ok" | "warn" | "info";
}

const accents: Record<NonNullable<StatCardProps["accent"]>, string> = {
  cyan: "text-cyan-accent",
  violet: "text-violet-accent",
  ok: "text-ok",
  warn: "text-warn",
  info: "text-info",
};

export function StatCard({ label, value, hint, icon, accent = "cyan" }: StatCardProps) {
  return (
    <div className="rounded-md border border-border bg-panel p-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
          {label}
        </span>
        {icon && <span className={`${accents[accent]}`}>{icon}</span>}
      </div>
      <div className="mt-2 font-mono text-2xl font-semibold text-text-primary">{value}</div>
      {hint && <div className="mt-1 text-xs text-text-muted">{hint}</div>}
    </div>
  );
}