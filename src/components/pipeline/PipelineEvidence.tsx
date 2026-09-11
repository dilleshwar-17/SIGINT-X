import type { Pipeline } from "@/types";
import { ConfidenceBar } from "@/components/analysis/ConfidenceBar";

interface PipelineEvidenceProps {
  pipeline: Pipeline;
}

export function PipelineEvidence({ pipeline }: PipelineEvidenceProps) {
  if (!pipeline.evidence) {
    return (
      <p className="text-xs text-text-muted">Evidence unavailable for this candidate pipeline.</p>
    );
  }
  const e = pipeline.evidence;
  return (
    <div>
      <dl className="space-y-3">
        <div>
          <dt className="sr-only">Modulation confidence</dt>
          <ConfidenceBar label="Modulation" value={e.modulationConfidence} />
        </div>
        <div>
          <ConfidenceBar label="Synchronization" value={e.synchronization} />
        </div>
        <div>
          <ConfidenceBar label="Decoder validity" value={e.decoderValidity} />
        </div>
        <div>
          <ConfidenceBar label="Frame correlation" value={e.frameCorrelation} />
        </div>
        <div>
          <ConfidenceBar label="Reconstruction" value={e.reconstruction} />
        </div>
      </dl>
      <div className="mt-4 border-t border-border-light pt-4">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
            Overall
          </span>
          <span className="font-mono text-sm font-semibold text-cyan-accent">{e.overall}%</span>
        </div>
        <ConfidenceBar value={e.overall} />
      </div>
    </div>
  );
}