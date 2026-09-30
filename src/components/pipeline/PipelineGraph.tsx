import {
  Binary,
  Check,
  ChevronsUpDown,
  FileInput,
  Loader,
  Radio,
  RefreshCw,
  Shuffle,
  Terminal,
  Wrench,
  X,
} from "lucide-react";
import type { Pipeline, PipelineStage } from "@/types";

interface PipelineGraphProps {
  pipeline: Pipeline;
}

const stageIcon: Record<PipelineStage["type"], typeof Binary> = {
  input: FileInput,
  preprocess: Wrench,
  sync: RefreshCw,
  demod: Radio,
  deinterleave: Shuffle,
  decode: Binary,
  validate: Check,
  output: Terminal,
};

const statusClasses: Record<PipelineStage["status"], { box: string; icon: string }> = {
  success: { box: "border-ok/30 bg-ok/[0.06]", icon: "text-ok" },
  partial: { box: "border-warn/35 bg-warn/[0.06]", icon: "text-warn" },
  failed: { box: "border-err/35 bg-err/[0.06]", icon: "text-err" },
  running: { box: "border-cyan-accent/50 bg-cyan-accent/[0.08]", icon: "text-cyan-accent" },
  pending: { box: "border-border-light/70 bg-white/[0.02]", icon: "text-text-muted" },
};

function Connector({ failed }: { failed: boolean }) {
  return (
    <div
      className="my-1 flex flex-col items-center"
      role="presentation"
      aria-hidden="true"
    >
      <div className={`h-1.5 w-px ${failed ? "bg-err/50" : "bg-border-light"}`} />
      <svg
        width="14"
        height="10"
        viewBox="0 0 14 10"
        className={failed ? "text-err/60" : "text-text-muted"}
      >
        <path d="M7 0v6M2 3l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    </div>
  );
}

export function PipelineGraph({ pipeline }: PipelineGraphProps) {
  const effectiveStages: PipelineStage[] =
    pipeline.stages.length > 0
      ? pipeline.stages
      : pipeline.stageNames.map((name, i) => ({
          id: `${pipeline.id}-gen-${i}`,
          name,
          type: i === 0 ? "input" : i === pipeline.stageNames.length - 1 ? "output" : "preprocess",
          status: pipeline.status === "FAILED" && i > 2 ? "failed" : "success",
        }));

  const terminalFailed = effectiveStages.some((s) => s.status === "failed" || s.status === "partial");

  return (
    <div className="flex flex-col items-center">
      {effectiveStages.map((stage, i) => {
        const Icon = stageIcon[stage.type];
        const st = statusClasses[stage.status];
        const failed = stage.status === "failed" || stage.status === "partial";
        return (
          <div key={stage.id} className="w-full max-w-[280px]">
<div
              className={`flex items-center gap-3 rounded-lg border px-3.5 py-2.5 transition-all duration-200 ${st.box}`}
              title={`${stage.name} — ${stage.status}`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-current/20 ${st.icon}`}
                aria-hidden="true"
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium text-text-primary">{stage.name}</div>
                <div className="font-mono text-[9px] uppercase tracking-wider text-text-muted">
                  {stage.type}
                </div>
              </div>
              {stage.status === "running" && (
                <Loader className="h-3.5 w-3.5 animate-spin text-cyan-accent" aria-hidden="true" />
              )}
              {stage.status === "success" && (
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-ok shadow-[0_0_8px_rgba(52,211,153,0.9)]"
                  aria-hidden="true"
                />
              )}
</div>
            {i < effectiveStages.length - 1 && <Connector failed={failed} />}
          </div>
        );
      })}
      {terminalFailed && (
        <div className="mt-2 w-full max-w-[280px]">
          <div className="mt-2 flex w-full max-w-[280px] items-start gap-2 rounded-lg border border-err/35 bg-err/[0.07] px-3 py-2">
            <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-err" aria-hidden="true" />
            <div className="text-[11px] leading-snug text-text-secondary">
              {effectiveStages.find((s) => s.status === "failed")?.reason ?? (
                "Stage did not validate; downstream processing skipped."
              )}
            </div>
          </div>
        </div>
      )}
      <div className="mt-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-text-muted">
        <ChevronsUpDown className="h-3 w-3" aria-hidden="true" />
        {effectiveStages.length} stages
      </div>
    </div>
  );
}