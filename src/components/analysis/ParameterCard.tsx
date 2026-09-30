import { useState } from "react";
import { Info } from "lucide-react";
import type { ConfidenceLevel } from "@/types";

interface ParameterCardProps {
  label: string;
  value: string;
  unit?: string;
  confidence: ConfidenceLevel;
  method?: string;
}

const confTone: Record<ConfidenceLevel, string> = {
  High: "text-ok border-ok/30 bg-ok/10",
  Medium: "text-warn border-warn/30 bg-warn/10",
  Low: "text-err border-err/30 bg-err/10",
};

export function ParameterCard({ label, value, unit, confidence, method }: ParameterCardProps) {
  const [showMethod, setShowMethod] = useState(false);

  return (
    <div className="panel-surface panel-surface-hover flex flex-col justify-between gap-2 p-3.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted">
          {label}
        </span>
        {method && (
          <button
            type="button"
            onClick={() => setShowMethod((v) => !v)}
            aria-label={`Method for ${label}`}
            aria-expanded={showMethod}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-cyan-accent/10 hover:text-cyan-accent focus-ring"
          >
            <Info className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="font-mono text-xl font-semibold leading-none tracking-tight text-text-primary">
        {value}
        {unit && <span className="ml-1 text-[11px] font-normal text-text-muted">{unit}</span>}
      </div>

      <span
        className={`self-start rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide ${confTone[confidence]}`}
      >
        {confidence}
      </span>

      {showMethod && method && (
        <p className="animate-fade-in mt-1 border-t border-border/70 pt-2 text-[11px] leading-snug text-text-secondary">
          {method}
        </p>
      )}
    </div>
  );
}
