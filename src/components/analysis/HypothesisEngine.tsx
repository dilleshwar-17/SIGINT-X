import { Check, CircleDashed } from "lucide-react";
import type { Hypothesis } from "@/types";

interface HypothesisEngineProps {
  hypotheses: Hypothesis[];
}

export function HypothesisEngine({ hypotheses }: HypothesisEngineProps) {
  const complete = hypotheses.every((h) => h.status === "complete");
  const totalCandidates = hypotheses.reduce((sum, h) => sum + (h.candidates ?? 0), 0);

  return (
    <div>
      <ul className="space-y-1.5">
        {hypotheses.map((h) => {
          const done = h.status === "complete";
          const running = h.status === "generating";
          return (
            <li key={h.id} className="flex items-center gap-2 text-xs">
              {done ? (
                <Check className="h-3.5 w-3.5 shrink-0 text-ok" aria-hidden="true" />
              ) : running ? (
                <CircleDashed className="h-3.5 w-3.5 shrink-0 animate-spin text-cyan-accent" aria-hidden="true" />
              ) : (
                <span className="h-3.5 w-3.5 shrink-0 rounded-full border border-border-light" aria-hidden="true" />
              )}
              <span className={done ? "text-text-secondary" : "text-text-primary"}>{h.description}</span>
              {h.candidates > 0 && done && (
                <span className="ml-auto font-mono text-[10px] text-text-muted">{h.candidates} cand.</span>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-3 border-t border-border pt-3">
        {complete ? (
          <span className="font-mono text-xs font-semibold text-cyan-accent">
            {totalCandidates} CANDIDATE PIPELINES GENERATED
          </span>
        ) : (
          <span className="font-mono text-xs text-cyan-accent">GENERATING CANDIDATE INTERPRETATIONS…</span>
        )}
      </div>
    </div>
  );
}