import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import { useSigintStore } from "@/store/useSigintStore";

function useSystemState() {
  const analysisStatus = useSigintStore((s) => s.analysisStatus);
  return useMemo(() => {
    if (analysisStatus === "PROCESSING" || analysisStatus === "QUEUED") {
      return {
        label: "ANALYSIS RUNNING",
        color: "text-cyan-accent",
        dot: "bg-cyan-accent animate-pulse",
      };
    }
    if (analysisStatus === "COMPLETED") {
      return {
        label: "ANALYSIS COMPLETE",
        color: "text-ok",
        dot: "bg-ok",
      };
    }
    if (analysisStatus === "FAILED") {
      return {
        label: "ANALYSIS FAILED",
        color: "text-err",
        dot: "bg-err",
      };
    }
    return {
      label: "SYSTEM OPERATIONAL",
      color: "text-ok",
      dot: "bg-ok",
    };
  }, [analysisStatus]);
}

export function TopBar() {
  const location = useLocation();
  const system = useSystemState();

  const analysisId = useMemo(() => {
    const match = location.pathname.match(/\/analyze\/([^/]+)/);
    return match?.[1] ?? null;
  }, [location.pathname]);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface px-5">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-semibold tracking-wide">SIGINT-X</span>
          {analysisId && (
            <span className="font-mono text-xs text-text-muted">Analysis: {analysisId}</span>
          )}
        </div>
        <div className="hidden items-center gap-2 text-xs lg:flex">
          <span className={`flex items-center gap-1.5 ${system.color}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${system.dot}`} aria-hidden="true" />
            {system.label}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-md border border-border-light bg-panel px-3 py-1.5 md:flex">
          <Search className="h-3.5 w-3.5 text-text-muted" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search signals, analyses..."
            aria-label="Global search"
            className="w-52 bg-transparent text-xs text-text-primary placeholder:text-text-muted focus:outline-none"
          />
          <kbd className="rounded border border-border bg-bg px-1 font-mono text-[10px] text-text-muted">
            /
          </kbd>
        </div>

        <div className="hidden font-mono text-[10px] text-text-muted lg:block">
          CPU: <span className="text-text-secondary">31%</span>
          <span className="mx-1.5 text-border-light">|</span>
          MEM: <span className="text-text-secondary">4.2 GB</span>
        </div>
      </div>
    </header>
  );
}