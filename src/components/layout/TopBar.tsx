import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Search } from "lucide-react";
import { useSigintStore } from "@/store/useSigintStore";

function useSystemState() {
  const analysisStatus = useSigintStore((s) => s.analysisStatus);
  return useMemo(() => {
    if (analysisStatus === "PROCESSING" || analysisStatus === "QUEUED") {
      return {
        label: "ANALYSIS RUNNING",
        pill: "border-cyan-accent/30 bg-cyan-accent/10 text-cyan-accent",
        dot: "bg-cyan-accent",
        live: true,
      };
    }
    if (analysisStatus === "COMPLETED") {
      return {
        label: "ANALYSIS COMPLETE",
        pill: "border-ok/30 bg-ok/10 text-ok",
        dot: "bg-ok",
        live: false,
      };
    }
    if (analysisStatus === "FAILED") {
      return {
        label: "ANALYSIS FAILED",
        pill: "border-err/30 bg-err/10 text-err",
        dot: "bg-err",
        live: false,
      };
    }
    return {
      label: "SYSTEM OPERATIONAL",
      pill: "border-ok/25 bg-ok/[0.08] text-ok",
      dot: "bg-ok",
      live: false,
    };
  }, [analysisStatus]);
}

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

const LABELS: Record<string, string> = {
  signals: "Signal Library",
  analyze: "Analysis",
  pipelines: "Pipelines",
  bits: "Bit Stream",
  report: "Report",
  experiments: "Experiments",
  models: "Models",
  settings: "Settings",
};

function useBreadcrumbs(pathname: string) {
  return useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const crumbs: { label: string; to: string }[] = [];

    segments.forEach((segment, index) => {
      const to = `/${segments.slice(0, index + 1).join("/")}`;

      if (segment === "analyze" && index === 0) {
        crumbs.push({ label: "Analysis", to });
        return;
      }
      if (segments[index - 1] === "analyze") {
        crumbs.push({ label: segment, to });
        return;
      }
      crumbs.push({ label: LABELS[segment] ?? segment, to });
    });

    if (crumbs.length === 0) crumbs.push({ label: "Dashboard", to: "/" });
    return crumbs;
  }, [pathname]);
}

export function TopBar() {
  const location = useLocation();
  const system = useSystemState();
  const crumbs = useBreadcrumbs(location.pathname);
  const now = useClock();
  const searchRef = useRef<HTMLInputElement>(null);
  const apiStatus = useSigintStore((s) => s.apiStatus);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (event.key === "/" && !typing) {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape" && document.activeElement === searchRef.current) {
        searchRef.current?.blur();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const time = now.toLocaleTimeString([], { hour12: false });
  const reachable = apiStatus?.reachable ?? false;

  return (
    <header className="app-chrome sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border/70 bg-surface/70 px-4 backdrop-blur-xl md:px-7">
      <div className="flex min-w-0 items-center gap-3">
        <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1.5 sm:flex">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <span key={crumb.to} className="flex min-w-0 items-center gap-1.5">
                {index > 0 && (
                  <ChevronRight className="h-3 w-3 shrink-0 text-text-muted/60" aria-hidden="true" />
                )}
                {isLast ? (
                  <span className="truncate px-1.5 py-1 text-[13px] font-medium text-text-primary">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.to}
                    className="rounded px-1.5 py-1 text-[13px] text-text-muted transition-colors hover:bg-cyan-accent/[0.07] hover:text-cyan-accent focus-ring"
                  >
                    {crumb.label}
                  </Link>
                )}
              </span>
            );
          })}
        </nav>

        <span
          className={`hidden items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider backdrop-blur-sm lg:inline-flex ${system.pill}`}
          role="status"
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${system.dot}`}
            style={system.live ? { animation: "blink 1.4s ease-in-out infinite" } : undefined}
            aria-hidden="true"
          />
          {system.label}
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="group hidden items-center gap-2 rounded-lg border border-border-light/70 bg-white/[0.03] px-3 py-1.5 transition-colors duration-200 focus-within:border-cyan-accent/50 focus-within:bg-cyan-accent/[0.05] md:flex">
          <Search
            className="h-3.5 w-3.5 text-text-muted transition-colors group-focus-within:text-cyan-accent"
            aria-hidden="true"
          />
          <input
            ref={searchRef}
            type="search"
            placeholder="Search signals, analyses…"
            aria-label="Global search"
            className="w-44 bg-transparent py-1 text-xs text-text-primary placeholder:text-text-muted focus:outline-none lg:w-56"
          />
          <kbd className="rounded border border-border-light/80 bg-bg/60 px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
            /
          </kbd>
        </div>

        <div className="hidden items-center gap-2 font-mono text-[10px] text-text-muted xl:flex">
          <span
            className={`h-1.5 w-1.5 rounded-full ${reachable ? "bg-ok" : "bg-warn"}`}
            title={reachable ? "Backend reachable" : "Backend not connected"}
            aria-hidden="true"
          />
          <span className="uppercase tracking-wider">
            {reachable ? "live" : "offline"}
          </span>
          <span className="text-border-light">|</span>
          <span>CPU</span>
          <span className="text-text-secondary">31%</span>
          <span className="text-border-light">|</span>
          <span className="text-text-secondary tabular-nums">{time}</span>
        </div>
      </div>
    </header>
  );
}
