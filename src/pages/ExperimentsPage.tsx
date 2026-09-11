import { useEffect, useState } from "react";
import { FlaskConical } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { getExperiments } from "@/services/api";
import { PanelSkeleton } from "@/components/ui/Skeleton";
import type { Experiment } from "@/types";

export function ExperimentsPage() {
  const [experiments, setExperiments] = useState<Experiment[] | null>(null);

  useEffect(() => {
    getExperiments().then(setExperiments);
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Experiments"
        subtitle="Research benchmarks for the analysis models and pipeline discovery."
      />
      <Panel title="Benchmarks" icon={<FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />} pad={false}>
        {experiments ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-xs">
              <thead>
                <tr className="border-b border-border-light text-[10px] uppercase tracking-widest text-text-muted">
                  <th className="px-4 py-2.5 font-medium">Experiment</th>
                  <th className="px-3 py-2.5 font-medium">Model</th>
                  <th className="px-3 py-2.5 font-medium">Dataset</th>
                  <th className="px-3 py-2.5 font-medium">Accuracy</th>
                  <th className="px-3 py-2.5 font-medium">F1</th>
                  <th className="px-3 py-2.5 font-medium">BER</th>
                  <th className="px-3 py-2.5 font-medium">Version</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {experiments.map((e) => (
                  <tr key={e.id} className="hover:bg-panel-hover">
                    <td className="px-4 py-2.5">
                      <div className="font-medium text-text-primary">{e.name}</div>
                      <div className="mt-0.5 text-[11px] text-text-muted">{e.description}</div>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-text-secondary">{e.model}</td>
                    <td className="px-3 py-2.5 text-text-secondary">{e.dataset}</td>
                    <td className="px-3 py-2.5 font-mono text-text-primary">{(e.accuracy * 100).toFixed(1)}%</td>
                    <td className="px-3 py-2.5 font-mono text-text-primary">{e.f1.toFixed(3)}</td>
                    <td className="px-3 py-2.5 font-mono text-text-muted">{e.ber?.toFixed(3) ?? "—"}</td>
                    <td className="px-3 py-2.5 font-mono text-text-muted">{e.version}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4">
            <PanelSkeleton rows={5} />
          </div>
        )}
      </Panel>
    </div>
  );
}