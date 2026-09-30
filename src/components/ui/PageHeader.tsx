import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, eyebrow, actions }: PageHeaderProps) {
  return (
    <div className="animate-fade-up mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && (
          <div className="mb-1.5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-accent/80">
            <span className="h-px w-6 bg-gradient-to-r from-cyan-accent to-transparent" aria-hidden="true" />
            {eyebrow}
          </div>
        )}
        <h1 className="text-gradient text-2xl font-semibold tracking-tight sm:text-[28px]">
          {title}
        </h1>
        {subtitle && <p className="mt-1.5 max-w-2xl text-sm text-text-secondary">{subtitle}</p>}
      </div>
      {actions && <div className="no-print flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
