import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { Maximize2, X } from "lucide-react";
import { useState } from "react";

interface ChartFrameProps {
  title: string;
  subtitle?: string;
  badge?: string;
  toolbar?: ReactNode;
  children: ReactNode;
  height?: number;
}

export function ChartFrame({
  title,
  subtitle,
  badge,
  toolbar,
  children,
  height = 320,
}: ChartFrameProps) {
  const [fullscreen, setFullscreen] = useState(false);
  const body = children;

  if (fullscreen) {
    return createPortal(
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${title} fullscreen`}
        className="fixed inset-0 z-50 flex flex-col bg-bg/92 p-4 backdrop-blur-xl md:p-6"
      >
        <div className="panel-surface mb-3 flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold uppercase tracking-[0.14em] text-text-primary">
              {title}
            </h3>
            {subtitle && (
              <p className="mt-0.5 font-mono text-[11px] text-text-muted">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            aria-label="Exit fullscreen"
            className="rounded-lg border border-border-light/80 bg-white/[0.04] p-2 text-text-secondary transition-all duration-200 hover:border-err/40 hover:text-err focus-ring"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="panel-surface min-h-0 flex-1 p-3">
          <div className="h-full">{body}</div>
        </div>
      </div>,
      document.body,
    );
  }

  return (
    <section className="panel-surface overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <h3 className="truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-text-primary">
            {title}
          </h3>
          {subtitle && (
            <span className="truncate font-mono text-[10px] text-text-muted">{subtitle}</span>
          )}
          {badge && (
            <span className="rounded border border-warn/40 bg-warn/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-warn">
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {toolbar}
          <button
            type="button"
            onClick={() => setFullscreen(true)}
            aria-label={`Open ${title} fullscreen`}
            title="Fullscreen"
            className="rounded-md p-1.5 text-text-muted transition-all duration-200 hover:bg-white/[0.06] hover:text-cyan-accent focus-ring"
          >
            <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="hairline-t mx-4 h-px opacity-50" aria-hidden="true" />

      <div className="p-2" style={{ height: height + 16 }} aria-label={title} role="img">
        {body}
      </div>
    </section>
  );
}
