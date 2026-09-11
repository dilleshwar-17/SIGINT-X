import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { GitBranch, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ConfidenceBar } from "@/components/analysis/ConfidenceBar";
import { getPipelines } from "@/services/api";
import { PanelSkeleton } from "@/components/ui/Skeleton";
import type { Pipeline } from "@/types";

export function PipelineExplorerPage() {
  const { id } = useParams<{ id: string }>();
  const [pipelines, setPipelines] = useState<Pipeline[] | null>(null);
  const [selected, setSelected] = useState<Pipeline | null>(null);

  useEffect(() => {
    if (!id) return;
    getPipelines(id).then((data) => {
      setPipelines(data);
      setSelected(data[0] ?? null);
    });
  }, [id]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Pipeline Explorer"
        subtitle="Candidate decoding pipelines discovered for this signal, ranked by evidence."
      />

      <Panel title="Pipeline Comparison" icon={<GitBranch className="h-3.5 w-3.5" aria-hidden="true" />} pad={false}>
        {pipelines ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-xs">
              <thead>
                <tr className="border-b border-border-light text-[10px] uppercase tracking-widest text-text-muted">
                  <th className="px-4 py-2.5 font-medium">Pipeline</th>
                  <th className="px-3 py-2.5 font-medium">Score</th>
                  <th className="px-3 py-2.5 font-medium">Decoder</th>
                  <th className="px-3 py-2.5 font-medium">Status</th>
                  <th className="px-3 py-2.5 font-medium">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pipelines.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelected(p)}
                    className={`cursor-pointer ${
                      selected?.id === p.id ? "bg-cyan-accent/5" : "hover:bg-panel-hover"
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-text-primary">
                      <span className={p.status === "BEST" ? "text-cyan-accent" : ""}>
                        #{p.rank} {p.stageNames.join(" + ")}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-mono text-text-secondary">
                      {p.score.toFixed(2)}
                    </td>
                    <td className="px-3 py-3 font-mono text-text-secondary">{p.decoder}</td>
                    <td className="px-3 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-3 py-3">
                      <ChevronRight className="h-4 w-4 text-text-muted" aria-hidden="true" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4">
            <PanelSkeleton rows={4} />
          </div>
        )}
      </Panel>

      {selected && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title={`Pipeline Stage Flow · ${selected.id}`}>
            {selected.stages.length > 0 ? (
              <ol className="space-y-2">
                {selected.stages.map((stage) => (
                  <li key={stage.id} className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${
                        stage.status === "success"
                          ? "bg-ok"
                          : stage.status === "failed"
                            ? "bg-err"
                            : "bg-text-muted"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="font-mono text-xs text-text-primary">{stage.name}</span>
                    {stage.status === "success" && (
                      <span className="font-mono text-[10px] text-ok">✓</span>
                    )}
                    {stage.status === "failed" && (
                      <span className="font-mono text-[10px] text-err">✕ {stage.reason}</span>
                    )}
                  </li>
                ))}
              </ol>
            ) : (
              <ol className="space-y-2">
                {selected.stageNames.map((name, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${
                        selected.status === "FAILED" && i >= 3 ? "bg-err" : "bg-ok"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="font-mono text-xs text-text-primary">{name}</span>
                  </li>
                ))}
              </ol>
            )}
          </Panel>

          <Panel title="Pipeline Evidence">
            {selected.evidence ? (
              <div className="space-y-3">
                <ConfidenceBar label="Mod. confidence" value={selected.evidence.modulationConfidence} />
                <ConfidenceBar label="Synchronization" value={selected.evidence.synchronization} />
                <ConfidenceBar label="Decoder validity" value={selected.evidence.decoderValidity} />
                <ConfidenceBar label="Frame correlation" value={selected.evidence.frameCorrelation} />
                <ConfidenceBar label="Reconstruction" value={selected.evidence.reconstruction} />
                <div className="mt-3 border-t border-border-light pt-3">
                  <ConfidenceBar label="Overall" value={selected.evidence.overall} />
                </div>
              </div>
            ) : (
              <p className="text-xs text-text-muted">Evidence unavailable for this candidate.</p>
            )}
          </Panel>
        </div>
      )}

      <div className="flex justify-end">
        <Link
          to={`/analyze/${id}/report`}
          className="inline-flex items-center gap-1.5 rounded-md border border-border-light bg-panel px-3.5 py-1.5 text-sm text-text-primary transition-colors hover:border-cyan-dim/50 hover:bg-panel-hover"
        >
          View Report <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}