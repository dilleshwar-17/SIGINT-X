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
        className="fixed inset-0 z-50 flex flex-col bg-bg/98 p-4"
      >
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-text-primary">
              {title}
            </h3>
            {subtitle && <p className="mt-0.5 font-mono text-[11px] text-text-muted">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            aria-label="Exit fullscreen"
            className="rounded-md border border-border bg-panel p-2 text-text-secondary transition-colors hover:text-text-primary focus-ring"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1">{body}</div>
      </div>,
      document.body,
    );
  }

  return (
    <section className="rounded-md border border-border bg-panel p-3">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-text-secondary">
            {title}
          </h3>
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
            className="rounded p-1 text-text-muted transition-colors hover:bg-panel-hover hover:text-cyan-accent focus-ring"
          >
            <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div style={{ height }} aria-label={title} role="img">
        {body}
      </div>
    </section>
  );
}