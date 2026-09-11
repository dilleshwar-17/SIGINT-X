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
  PROCESSING: "text-cyan-accent border-cyan-accent/30 bg-cyan-accent/10 animate-pulse",
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
  PROCESSING: "bg-cyan-accent animate-pulse",
  FAILED: "bg-err",
  ANALYSIS_FAILED: "bg-err",
  QUEUED: "bg-text-muted",
  UPLOADED: "bg-info",
  CANDIDATE: "bg-info",
  CANCELLED: "bg-text-muted",
};

export function StatusBadge({ status }: { status: StatusLike }) {
  const tone = toneMap[status] ?? "text-text-secondary border-border-light bg-panel";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ${tone}`}
    >
      {dotMap[status] && (
        <span className={`h-1 w-1 rounded-full ${dotMap[status]}`} aria-hidden="true" />
      )}
      {status}
    </span>
  );
}