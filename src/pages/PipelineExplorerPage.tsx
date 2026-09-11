import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { GitBranch, ChevronRight, Star } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PipelineGraph } from "@/components/pipeline/PipelineGraph";
import { PipelineTimeline } from "@/components/pipeline/PipelineTimeline";
import { PipelineEvidence } from "@/components/pipeline/PipelineEvidence";
import { getPipelines } from "@/services/api";
import { PanelSkeleton } from "@/components/ui/Skeleton";
import type { Pipeline } from "@/types";

export function PipelineExplorerPage() {
  const { id } = useParams<{ id: string }>();
  const [pipelines, setPipelines] = useState<Pipeline[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getPipelines(id).then((data) => {
      setPipelines(data);
      setSelectedId(data[0]?.id ?? null);
    });
  }, [id]);

  const selected = pipelines?.find((p) => p.id === selectedId) ?? pipelines?.[0] ?? null;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Pipeline Explorer"
        subtitle="Candidate decoding pipelines discovered for this signal, ranked by evidence."
      />

      <Panel
        title="Pipeline Comparison"
        icon={<GitBranch className="h-3.5 w-3.5" aria-hidden="true" />}
        pad={false}
      >
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
                    onClick={() => setSelectedId(p.id)}
                    className={`cursor-pointer ${
                      selected?.id === p.id ? "bg-cyan-accent/5" : "hover:bg-panel-hover"
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-text-primary">
                      <span className={p.status === "BEST" ? "text-cyan-accent" : ""}>
                        #{p.rank} {p.stageNames.join(" + ")}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-mono text-text-secondary">{p.score.toFixed(2)}</td>
                    <td className="px-3 py-3 font-mono text-text-secondary">{p.decoder}</td>
                    <td className="px-3 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className={`px-3 py-3 ${selected?.id === p.id ? "text-cyan-accent" : "text-text-muted"}`}>
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
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
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel
              title={
                selected.status === "BEST" ? "Best Pipeline Flow" : `Pipeline #${selected.rank} Flow`
              }
              actions={
                selected.status === "BEST" ? (
                  <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-ok">
                    <Star className="h-3 w-3 fill-current" aria-hidden="true" /> Best
                  </span>
                ) : undefined
              }
            >
              <PipelineGraph pipeline={selected} />
            </Panel>

            <Panel title="Pipeline Evidence">
              <PipelineEvidence pipeline={selected} />
            </Panel>
          </div>

          <Panel title="Processing Timeline">
            <PipelineTimeline pipeline={selected} />
          </Panel>
        </>
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