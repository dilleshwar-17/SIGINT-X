import type { ReactNode } from "react";

interface PanelProps {
  title?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  pad?: boolean;
}

export function Panel({ title, icon, actions, children, className = "", pad = true }: PanelProps) {
  return (
    <section
      className={`rounded-md border border-border bg-panel ${pad ? "p-4" : ""} ${className}`}
    >
      {(title || actions) && (
        <header className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-text-secondary">
            {icon}
            {title}
          </h2>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}