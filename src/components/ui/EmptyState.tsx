import type { ReactNode } from "react";
import { Radar } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="animate-fade-in relative flex flex-col items-center justify-center gap-3.5 overflow-hidden rounded-[var(--radius-panel)] border border-dashed border-border-light/70 bg-white/[0.015] px-6 py-16 text-center">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-accent/40 to-transparent"
        aria-hidden="true"
      />
      <span className="icon-chip h-12 w-12 text-cyan-accent/80">
        {icon ?? <Radar className="h-5 w-5" aria-hidden="true" />}
      </span>
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-primary">
        {title}
      </h3>
      <p className="max-w-md text-sm leading-relaxed text-text-muted">{description}</p>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
