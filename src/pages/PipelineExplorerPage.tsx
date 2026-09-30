import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { GitBranch, ChevronRight, Star } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PipelineGraph } from "@/components/pipeline/PipelineGraph";
import { PipelineTimeline } from "@/components/pipeline/PipelineTimeline";
import { PipelineEvidence } from "@/components/pipeline/PipelineEvidence";
import { Button } from "@/components/ui/Button";
import { getPipelines } from "@/services/api";
import { PanelSkeleton } from "@/components/ui/Skeleton";
import type { Pipeline } from "@/types";

export function PipelineExplorerPage() {
  const { id } = useParams<{ id: string }>();
  const [pipelines, setPipelines] = useState<Pipeline[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    getPipelines(id)
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : [];
        setPipelines(list);
        setSelectedId(list[0]?.id ?? null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.error("Failed to load pipelines", err);
        setPipelines([]);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const selected = pipelines?.find((p) => p.id === selectedId) ?? pipelines?.[0] ?? null;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Discovery"
        title="Pipeline Explorer"
        subtitle="Candidate decoding pipelines discovered for this signal, ranked by evidence."
        actions={
          <Link to={`/analyze/${id}/report`}>
            <Button variant="secondary" size="md">
              View Report
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </Link>
        }
      />

      <Panel
        title="Pipeline Comparison"
        subtitle={`${pipelines?.length ?? 0} candidates ranked by evidence score`}
        icon={<GitBranch className="h-3.5 w-3.5" aria-hidden="true" />}
        pad={false}
        tone={selected?.status === "BEST" ? "cyan" : "default"}
      >
        {pipelines ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-xs">
              <thead>
                <tr className="border-b border-border/70 text-[9px] uppercase tracking-[0.16em] text-text-muted">
                  <th className="px-4 py-2.5 font-semibold">Pipeline</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Score</th>
                  <th className="px-3 py-2.5 font-semibold">Decoder</th>
                  <th className="px-3 py-2.5 font-semibold">Status</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {pipelines.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className={`cursor-pointer transition-colors ${
                      selected?.id === p.id ? "bg-cyan-accent/[0.07]" : "hover:bg-white/[0.035]"
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-text-primary">
                      <span className={p.status === "BEST" ? "text-cyan-accent" : ""}>
                        #{p.rank} {p.stageNames.join(" + ")}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-text-secondary">
                      {p.score.toFixed(2)}
                    </td>
                    <td className="px-3 py-3 font-mono text-text-secondary">{p.decoder}</td>
                    <td className="px-3 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td
                      className={`px-3 py-3 text-right ${
                        selected?.id === p.id ? "text-cyan-accent" : "text-text-muted"
                      }`}
                    >
                      <ChevronRight className="h-4 w-4 inline" aria-hidden="true" />
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

          <Panel title="Processing Timeline" subtitle={selected.decoder}>
            <PipelineTimeline pipeline={selected} />
          </Panel>
        </>
      )}
    </div>
  );
}