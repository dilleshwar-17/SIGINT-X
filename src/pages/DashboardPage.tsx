import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Radio, Activity, GitBranch, Timer } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Panel } from "@/components/ui/Panel";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { PanelSkeleton } from "@/components/ui/Skeleton";
import { getDashboardStats, getRecentAnalyses } from "@/services/api";
import { useSigintStore } from "@/store/useSigintStore";
import type { Analysis } from "@/types";

interface DashStats {
  totalSignals: number;
  completedAnalyses: number;
  successfulPipelines: number;
  averageAnalysisTimeSeconds: number;
}

const statusColor: Record<string, string> = {
  COMPLETED: "text-ok",
  FAILED: "text-err",
  PROCESSING: "text-cyan-accent",
};

export function DashboardPage() {
  const [stats, setStats] = useState<DashStats | null>(null);
  const [analyses, setAnalyses] = useState<Analysis[] | null>(null);
  const setApiStatus = useSigintStore((s) => s.setApiStatus);

  useEffect(() => {
    getDashboardStats().then(setStats);
    getRecentAnalyses().then(setAnalyses);
    setApiStatus({ reachable: false, modelVersion: "v0.3.1 (mock)" });
  }, [setApiStatus]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Dashboard" subtitle="Autonomous Signal Analysis & Decoding Pipeline Discovery" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats ? (
          <>
            <StatCard label="Total Signals" value={stats.totalSignals} icon={<Radio className="h-4 w-4" />} />
            <StatCard
              label="Completed Analyses"
              value={stats.completedAnalyses}
              icon={<Activity className="h-4 w-4" />}
              accent="ok"
            />
            <StatCard
              label="Successful Pipelines"
              value={stats.successfulPipelines}
              icon={<GitBranch className="h-4 w-4" />}
              accent="violet"
            />
            <StatCard
              label="Avg Analysis Time"
              value={`${stats.averageAnalysisTimeSeconds} sec`}
              icon={<Timer className="h-4 w-4" />}
              accent="info"
            />
          </>
        ) : (
          Array.from({ length: 4 }).map((_, i) => <PanelSkeleton key={i} rows={2} />)
        )}
      </div>

      <Panel
        title="Recent Analyses"
        icon={<Activity className="h-3.5 w-3.5" aria-hidden="true" />}
        actions={
          <Button variant="ghost" size="sm">
            <Link to="/signals" className="flex items-center gap-1">
              View all
            </Link>
          </Button>
        }
      >
        {analyses ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead>
                <tr className="border-b border-border-light text-[10px] uppercase tracking-widest text-text-muted">
                  <th className="pb-2 pr-3 font-medium">Analysis ID</th>
                  <th className="pb-2 pr-3 font-medium">Signal</th>
                  <th className="pb-2 pr-3 font-medium">Modulation</th>
                  <th className="pb-2 pr-3 font-medium">Status</th>
                  <th className="pb-2 pr-3 font-medium">Best Pipeline</th>
                  <th className="pb-2 pr-3 font-medium">Score</th>
                  <th className="pb-2 pr-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {analyses.map((a) => (
                  <tr key={a.id} className="group hover:bg-panel-hover">
                    <td className="py-2.5 pr-3">
                      <Link
                        to={`/analyze/${a.id}`}
                        className="font-mono text-cyan-accent hover:underline"
                      >
                        {a.id}
                      </Link>
                    </td>
                    <td className="py-2.5 pr-3 font-mono text-text-secondary">
                      {a.signalFilename}
                    </td>
                    <td className="py-2.5 pr-3 font-mono text-text-primary">
                      {a.modulationLabel ?? "—"}
                    </td>
                    <td className="py-2.5 pr-3">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="py-2.5 pr-3 font-mono text-text-secondary">
                      {a.bestPipelineLabel ?? "—"}
                    </td>
                    <td className={`py-2.5 pr-3 font-mono ${statusColor[a.status] ?? "text-text-primary"}`}>
                      {a.bestScore != null ? a.bestScore.toFixed(2) : "—"}
                    </td>
                    <td className="py-2.5 pr-3 font-mono text-text-muted">
                      {a.timeTakenSeconds != null ? `${a.timeTakenSeconds}s` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-3">
            <PanelSkeleton rows={5} />
          </div>
        )}
      </Panel>
    </div>
  );
}