import type { ModulationPrediction } from "@/types";
import { ConfidenceBar } from "./ConfidenceBar";

interface ModulationPanelProps {
  prediction: ModulationPrediction;
}

export function ModulationPanel({ prediction }: ModulationPanelProps) {
  const levelTone =
    prediction.topLevel === "High"
      ? "text-ok border-ok/30 bg-ok/10"
      : prediction.topLevel === "Medium"
        ? "text-warn border-warn/30 bg-warn/10"
        : "text-err border-err/30 bg-err/10";

  return (
    <div className="space-y-4">
      <div
        className="rounded-xl border border-cyan-accent/25 p-3.5"
        style={{
          background:
            "linear-gradient(135deg, rgba(34,211,238,0.12) 0%, rgba(124,58,237,0.06) 60%, transparent 100%)",
        }}
      >
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted">
          Detected Modulation
        </div>
        <div className="mt-1.5 flex items-baseline justify-between">
          <span className="text-gradient font-mono text-2xl font-semibold">
            {prediction.detectedModulation}
          </span>
          <span className="font-mono text-sm tabular-nums text-text-secondary">
            {prediction.topConfidence}%
          </span>
        </div>
        <div className="mt-2">
          <ConfidenceBar value={prediction.topConfidence} />
        </div>
        <span
          className={`mt-2 inline-block rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide ${levelTone}`}
        >
          {prediction.topLevel} Confidence
        </span>
      </div>

      <div>
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted">
          Alternatives
        </div>
        <div className="space-y-1.5">
          {prediction.alternatives.map((alt) => (
            <ConfidenceBar key={alt.modulation} label={alt.modulation} value={alt.confidence} />
          ))}
        </div>
      </div>
    </div>
  );
}