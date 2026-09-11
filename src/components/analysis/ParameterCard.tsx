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
    <div className="flex flex-col justify-between gap-2 rounded-md border border-border bg-panel p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
          {label}
        </span>
        {method && (
          <button
            type="button"
            onClick={() => setShowMethod((v) => !v)}
            aria-label={`Method for ${label}`}
            aria-expanded={showMethod}
            className="text-text-muted transition-colors hover:text-cyan-accent focus-ring"
          >
            <Info className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="font-mono text-lg font-semibold text-text-primary">
        {value}
        {unit && <span className="ml-1 text-xs font-normal text-text-muted">{unit}</span>}
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`rounded-full border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide ${confTone[confidence]}`}
        >
          {confidence}
        </span>
      </div>
      {showMethod && method && (
        <p className="mt-1 border-t border-border-light pt-2 text-[11px] leading-snug text-text-secondary">
          {method}
        </p>
      )}
    </div>
  );
}