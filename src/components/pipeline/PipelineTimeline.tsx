import { Check, CircleDashed, X } from "lucide-react";
import type { Pipeline, PipelineStage } from "@/types";

interface PipelineTimelineProps {
  pipeline: Pipeline;
}

function StageRow({ stage }: { stage: PipelineStage }) {
  return (
    <li className="relative pb-4 last:pb-0">
      <div className="flex items-start gap-3">
        <div className="relative flex h-6 w-6 shrink-0 items-center justify-center">
          {stage.status === "success" && <Check className="h-4 w-4 text-ok" aria-hidden="true" />}
          {stage.status === "failed" && <X className="h-4 w-4 text-err" aria-hidden="true" />}
          {stage.status === "partial" && <X className="h-4 w-4 text-warn" aria-hidden="true" />}
          {stage.status === "running" && <CircleDashed className="h-4 w-4 animate-spin text-cyan-accent" aria-hidden="true" />}
          {stage.status === "pending" && (
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full border border-border-light/80"
              aria-hidden="true"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-medium text-text-primary">{stage.name}</div>
          <div className="font-mono text-[9px] uppercase tracking-wider text-text-muted">{stage.type}</div>
          {(stage.status === "failed" || stage.status === "partial") && stage.reason && (
            <div className="mt-1.5 rounded border-l-2 border-err/60 bg-err/5 px-2.5 py-1.5 text-[11px] text-text-secondary">
              <span className="mr-1 font-semibold uppercase tracking-wide text-err">Reason:</span>
              {stage.reason}
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

export function PipelineTimeline({ pipeline }: PipelineTimelineProps) {
  const stages: PipelineStage[] =
    pipeline.stages.length > 0
      ? pipeline.stages
      : pipeline.stageNames.map((name, i) => ({
          id: `${pipeline.id}-gen-${i}`,
          name,
          type: i === 0 ? "input" : i === pipeline.stageNames.length - 1 ? "output" : "preprocess",
          status: pipeline.status === "FAILED" && i > 2 ? "failed" : "success",
        }));

  return (
    <ol className="relative">
      <div
          aria-hidden="true"
          className="absolute bottom-2 left-[11px] top-2 w-px bg-gradient-to-b from-cyan-accent/50 via-border-light to-transparent"
        />
      {stages.map((stage) => (
        <StageRow key={stage.id} stage={stage} />
      ))}
    </ol>
  );
}