import type { ReactNode } from "react";

type Tone = "default" | "cyan" | "violet" | "ok" | "warn" | "err";

interface PanelProps {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  pad?: boolean;
  tone?: Tone;
  footer?: ReactNode;
  interactive?: boolean;
}

const TONE_RING: Record<Tone, string> = {
  default: "rgba(148,163,184,0.11)",
  cyan: "rgba(34,211,238,0.30)",
  violet: "rgba(167,139,250,0.30)",
  ok: "rgba(52,211,153,0.30)",
  warn: "rgba(251,191,36,0.30)",
  err: "rgba(248,113,113,0.30)",
};

export function Panel({
  title,
  subtitle,
  icon,
  actions,
  children,
  className = "",
  pad = true,
  tone = "default",
  footer,
  interactive = false,
}: PanelProps) {
  const hasHeader = Boolean(title || subtitle || actions || icon);

  return (
    <section
      className={`panel-surface ${interactive ? "panel-surface-hover" : ""} ${className}`}
      style={{ borderColor: tone === "default" ? undefined : TONE_RING[tone] }}
    >
      {hasHeader && (
        <header
          className={`flex items-start justify-between gap-3 ${
            pad ? "px-4 pt-4" : "px-4 pt-4"
          } pb-3`}
        >
          <div className="flex min-w-0 items-center gap-2.5">
            {icon && (
              <span className="icon-chip h-6 w-6 shrink-0 text-cyan-accent">{icon}</span>
            )}
            <div className="min-w-0">
              {title && (
                <h2 className="truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-text-primary">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="mt-0.5 truncate font-mono text-[10px] text-text-muted">{subtitle}</p>
              )}
            </div>
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      )}

      {title && <div className="hairline-t mx-4 h-px opacity-60" />}

      <div className={pad ? "p-4" : ""}>{children}</div>

      {footer && (
        <div className="border-t border-border/70 px-4 py-2.5 text-[11px] text-text-muted">
          {footer}
        </div>
      )}
    </section>
  );
}
