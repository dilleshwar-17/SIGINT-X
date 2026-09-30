import { useEffect, useState } from "react";
import { FlaskConical, TrendingUp, Target, Gauge } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { StatCard } from "@/components/ui/StatCard";
import { getExperiments } from "@/services/api";
import { PanelSkeleton } from "@/components/ui/Skeleton";
import type { Experiment } from "@/types";

function tone(value: number) {
  if (value >= 0.95) return "bg-ok";
  if (value >= 0.85) return "bg-cyan-accent";
  if (value >= 0.75) return "bg-warn";
  return "bg-err";
}

export function ExperimentsPage() {
  const [experiments, setExperiments] = useState<Experiment[] | null>(null);

  useEffect(() => {
    getExperiments().then(setExperiments);
  }, []);

  const sorted = experiments?.slice().sort((a, b) => b.accuracy - a.accuracy) ?? [];
  const best = sorted[0] ?? { accuracy: 0, f1: 0, name: "—", model: "—" };
  const avg =
    experiments && experiments.length
      ? experiments.reduce((s, e) => s + e.accuracy, 0) / experiments.length
      : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Research"
        title="Experiments"
        subtitle="Research benchmarks for the analysis models and pipeline discovery."
      />

      {experiments ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Experiment runs"
            value={experiments.length}
            icon={<FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />}
            accent="cyan"
          />
          <StatCard
            label="Best accuracy"
            value={`${(best.accuracy * 100).toFixed(1)}%`}
            hint={best.name}
            icon={<Target className="h-3.5 w-3.5" aria-hidden="true" />}
            accent="ok"
          />
          <StatCard
            label="Best F1"
            value={best.f1.toFixed(3)}
            hint={best.model}
            icon={<TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />}
            accent="violet"
          />
          <StatCard
            label="Avg accuracy"
            value={`${(avg * 100).toFixed(1)}%`}
            hint="across runs"
            icon={<Gauge className="h-3.5 w-3.5" aria-hidden="true" />}
            accent="info"
          />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <PanelSkeleton rows={2} />
          <PanelSkeleton rows={2} />
          <PanelSkeleton rows={2} />
          <PanelSkeleton rows={2} />
        </div>
      )}

      <Panel title="Accuracy by Experiment" icon={<Gauge className="h-3.5 w-3.5" aria-hidden="true" />}>
        {experiments ? (
          <ul className="space-y-3">
            {sorted.map((e) => (
              <li key={e.id}>
                <div className="mb-1 flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm text-text-primary">
                    {e.name}
                    <span className="ml-2 font-mono text-[10px] text-text-muted">{e.model}</span>
                  </span>
                  <span className="font-mono text-xs text-text-secondary">
                    {(e.accuracy * 100).toFixed(1)}%
                  </span>
                </div>
                <div
                  className="h-2 overflow-hidden rounded-full bg-white/[0.06]"
                  role="presentation"
                >
                  <div
                    className={`h-full rounded-full ${tone(e.accuracy)} transition-[width] duration-700 ease-out`}
                    style={{ width: `${e.accuracy * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <PanelSkeleton rows={5} />
        )}
      </Panel>

      <Panel
        title="Benchmark Results"
        icon={<FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />}
        pad={false}
      >
        {experiments ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-xs">
              <thead>
                <tr className="border-b border-border/70 text-[9px] uppercase tracking-[0.16em] text-text-muted">
                  <th className="px-4 py-2.5 font-semibold">Experiment</th>
                  <th className="px-3 py-2.5 font-semibold">Model</th>
                  <th className="px-3 py-2.5 font-semibold">Dataset</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Accuracy</th>
                  <th className="px-3 py-2.5 text-right font-semibold">F1</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Top-1</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Top-3</th>
                  <th className="px-3 py-2.5 text-right font-semibold">BER</th>
                  <th className="px-3 py-2.5 font-semibold">Version</th>
                  <th className="px-3 py-2.5 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {experiments.map((e) => (
                  <tr key={e.id} className="transition-colors hover:bg-white/[0.035]">
                    <td className="px-4 py-3">
                      <div className="font-medium text-text-primary">{e.name}</div>
                      <div className="mt-0.5 text-[11px] text-text-muted">{e.description}</div>
                    </td>
                    <td className="px-3 py-3 font-mono text-text-secondary">{e.model}</td>
                    <td className="px-3 py-3 text-text-secondary">{e.dataset}</td>
                    <td className="px-3 py-3 text-right">
                      <span
                        className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-medium text-[#04121a] ${tone(e.accuracy)}`}
                      >
                        {(e.accuracy * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-text-primary">{e.f1.toFixed(3)}</td>
                    <td className="px-3 py-3 text-right font-mono text-text-muted">
                      {e.top1 ? (e.top1 * 100).toFixed(1) + "%" : "—"}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-text-muted">
                      {e.top3 ? (e.top3 * 100).toFixed(1) + "%" : "—"}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-text-muted">
                      {e.ber?.toFixed(3) ?? "—"}
                    </td>
                    <td className="px-3 py-3 font-mono text-text-muted">{e.version}</td>
                    <td className="px-3 py-3 font-mono text-text-muted">{e.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4">
            <PanelSkeleton rows={6} />
          </div>
        )}
      </Panel>
    </div>
  );
}