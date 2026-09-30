import type { AnalysisStatus, SignalFormat, SignalStatus } from "@/types";

type StatusLike =
  | AnalysisStatus
  | SignalStatus
  | SignalFormat
  | "OPERATIONAL"
  | "BEST"
  | "CANDIDATE"
  | "FAILED"
  | "Production"
  | "Development"
  | "Deprecated";

const toneMap: Record<string, string> = {
  OPERATIONAL: "text-ok border-ok/30 bg-ok/10",
  COMPLETED: "text-ok border-ok/30 bg-ok/10",
  ANALYZED: "text-ok border-ok/30 bg-ok/10",
  READY: "text-ok border-ok/30 bg-ok/10",
  BEST: "text-cyan-accent border-cyan-accent/30 bg-cyan-accent/10",
  CANDIDATE: "text-info border-info/30 bg-info/10",
  PROCESSING: "text-cyan-accent border-cyan-accent/30 bg-cyan-accent/10",
  QUEUED: "text-text-secondary border-border-light bg-panel",
  UPLOADED: "text-info border-info/30 bg-info/10",
  FAILED: "text-err border-err/30 bg-err/10",
  ANALYSIS_FAILED: "text-err border-err/30 bg-err/10",
  CANCELLED: "text-text-muted border-border-light bg-panel",
  "ANALYSIS FAILED": "text-err border-err/30 bg-err/10",
  IQ: "text-violet-accent border-violet-accent/30 bg-violet-accent/10",
  WAV: "text-info border-info/30 bg-info/10",
  RAW: "text-warn border-warn/30 bg-warn/10",
  Production: "text-ok border-ok/30 bg-ok/10",
  Development: "text-info border-info/30 bg-info/10",
  Deprecated: "text-text-muted border-border-light bg-panel",
};

const dotMap: Record<string, string> = {
  COMPLETED: "bg-ok",
  ANALYZED: "bg-ok",
  READY: "bg-ok",
  OPERATIONAL: "bg-ok",
  BEST: "bg-cyan-accent",
  PROCESSING: "bg-cyan-accent",
  FAILED: "bg-err",
  ANALYSIS_FAILED: "bg-err",
  QUEUED: "bg-text-muted",
  UPLOADED: "bg-info",
  CANDIDATE: "bg-info",
  CANCELLED: "bg-text-muted",
};

const liveMap: Record<string, boolean> = {
  PROCESSING: true,
  QUEUED: true,
};

export function StatusBadge({ status }: { status: StatusLike }) {
  const tone = toneMap[status] ?? "text-text-secondary border-border-light bg-panel";
  const live = liveMap[status] ?? false;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[3px] font-mono text-[10px] font-medium uppercase tracking-wider backdrop-blur-sm ${tone}`}
    >
      {dotMap[status] && (
        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
          {live && (
            <span
              className={`absolute inline-flex h-full w-full rounded-full ${dotMap[status]}`}
              style={{ animation: "pulse-ring 1.9s ease-out infinite" }}
            />
          )}
          <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${dotMap[status]}`} />
        </span>
      )}
      {status}
    </span>
  );
}
