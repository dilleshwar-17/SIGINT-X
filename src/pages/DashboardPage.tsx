import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Cpu,
  GitBranch,
  Radio,
  ShieldCheck,
  Timer,
  Upload,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Panel } from "@/components/ui/Panel";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { getDashboardStats, getRecentAnalyses } from "@/services/api";
import { useSigintStore } from "@/store/useSigintStore";
import type { Analysis } from "@/types";

interface DashStats {
  totalSignals: number;
  completedAnalyses: number;
  successfulPipelines: number;
  averageAnalysisTimeSeconds: number;
}

const MOD_TONES: Record<string, string> = {
  QPSK: "#22d3ee",
  BPSK: "#a78bfa",
  "8PSK": "#34d399",
  "16QAM": "#fbbf24",
  "64QAM": "#e879f9",
  FSK: "#60a5fa",
  GMSK: "#facc15",
};

function scoreColor(score: number) {
  if (score >= 0.85) return "text-ok";
  if (score >= 0.6) return "text-warn";
  return "text-err";
}

function relativeTime(iso: string) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";
  const diff = Date.now() - then;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function ProgressRing({ value, size = 108 }: { value: number; size?: number }) {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, value));
  const tone = pct >= 80 ? "#34d399" : pct >= 55 ? "#fbbf24" : "#f87171";

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" role="img" aria-label={`${pct}% success rate`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(148,163,184,0.12)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={tone}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct / 100)}
          style={{
            transition: "stroke-dashoffset 900ms cubic-bezier(0.22,1,0.36,1)",
            filter: `drop-shadow(0 0 6px ${tone}66)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-xl font-semibold text-text-primary">
          {Math.round(pct)}
          <span className="text-xs text-text-muted">%</span>
        </span>
        <span className="text-[8px] uppercase tracking-[0.16em] text-text-muted">Success</span>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const [stats, setStats] = useState<DashStats | null>(null);
  const [analyses, setAnalyses] = useState<Analysis[] | null>(null);
  const setApiStatus = useSigintStore((s) => s.setApiStatus);

  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => setStats(null));
    getRecentAnalyses().then(setAnalyses).catch(() => setAnalyses([]));
    setApiStatus({ reachable: false, modelVersion: "v0.3.1" });
  }, [setApiStatus]);

  const derived = useMemo(() => {
    const list = analyses ?? [];
    const total = list.length;
    const completed = list.filter((a) => a.status === "COMPLETED");
    const successRate = total ? (completed.length / total) * 100 : 0;
    const avgScore = completed.length
      ? completed.reduce((sum, a) => sum + (a.bestScore ?? 0), 0) / completed.length
      : 0;
    const avgTime = completed.length
      ? completed.reduce((sum, a) => sum + (a.timeTakenSeconds ?? 0), 0) / completed.length
      : 0;

    const modCounts = new Map<string, number>();
    completed.forEach((a) => {
      const label = a.modulationLabel ?? "UNKNOWN";
      modCounts.set(label, (modCounts.get(label) ?? 0) + 1);
    });
    const modMix = [...modCounts.entries()]
      .map(([label, count]) => ({
        label,
        count,
        share: completed.length ? (count / completed.length) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return { successRate, avgScore, avgTime, modMix, completedCount: completed.length };
  }, [analyses]);

  const bars = useMemo(() => {
    const list = (analyses ?? []).filter((a) => a.bestScore != null);
    const source = list.length ? list.slice(0, 12) : [];
    return source.map((a) => Math.round((a.bestScore ?? 0) * 100));
  }, [analyses]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Mission Control"
        title="Dashboard"
        subtitle="Autonomous signal analysis and decoding pipeline discovery across the signal library."
        actions={
          <>
            <Link to="/analyze">
              <Button variant="primary" size="md">
                <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                New Analysis
              </Button>
            </Link>
            <Link to="/signals">
              <Button variant="secondary" size="md">
                Signal Library
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats ? (
          <>
            <StatCard
              className="animate-fade-up stagger-1"
              label="Total Signals"
              value={stats.totalSignals}
              icon={<Radio className="h-3.5 w-3.5" />}
              accent="cyan"
              bars={bars.length ? bars : [40, 62, 48, 74, 58, 86]}
              hint="Captured IQ and audio captures"
            />
            <StatCard
              className="animate-fade-up stagger-2"
              label="Completed Analyses"
              value={stats.completedAnalyses}
              icon={<Activity className="h-3.5 w-3.5" />}
              accent="ok"
              trend={{ value: 8.4 }}
              hint={`${derived.completedCount} surfaced in the recent feed`}
            />
            <StatCard
              className="animate-fade-up stagger-3"
              label="Successful Pipelines"
              value={stats.successfulPipelines}
              icon={<GitBranch className="h-3.5 w-3.5" />}
              accent="violet"
              bars={bars.length ? [...bars].reverse() : [30, 55, 70, 45, 80, 60]}
              hint="Decoded with a validated chain"
            />
            <StatCard
              className="animate-fade-up stagger-4"
              label="Avg Analysis Time"
              value={`${stats.averageAnalysisTimeSeconds}s`}
              icon={<Timer className="h-3.5 w-3.5" />}
              accent="info"
              trend={{ value: -12.6 }}
              hint="Wall-clock across all depths"
            />
          </>
        ) : (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Panel
          className="animate-fade-up stagger-5 xl:col-span-2"
          title="Recent Analyses"
          subtitle="Latest decode pipeline discovery runs"
          icon={<Activity className="h-3.5 w-3.5" aria-hidden="true" />}
          actions={
            <Link to="/signals">
              <Button variant="ghost" size="sm">
                View all
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </Button>
            </Link>
          }
        >
          {analyses ? (
            <div className="-mx-1 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-xs">
                <thead>
                  <tr className="border-b border-border/70 text-[9px] uppercase tracking-[0.16em] text-text-muted">
                    <th className="pb-2.5 pr-3 font-semibold">Analysis</th>
                    <th className="pb-2.5 pr-3 font-semibold">Signal</th>
                    <th className="pb-2.5 pr-3 font-semibold">Modulation</th>
                    <th className="pb-2.5 pr-3 font-semibold">Status</th>
                    <th className="pb-2.5 pr-3 font-semibold">Best Pipeline</th>
                    <th className="pb-2.5 pr-3 text-right font-semibold">Score</th>
                    <th className="pb-2.5 pr-3 text-right font-semibold">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {analyses.map((a) => (
                    <tr key={a.id} className="group transition-colors hover:bg-white/[0.035]">
                      <td className="py-2.5 pr-3">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/analyze/${a.id}`}
                            className="font-mono text-cyan-accent transition-colors hover:text-white hover:underline"
                          >
                            {a.id}
                          </Link>
                          <span className="font-mono text-[10px] text-text-muted">
                            {relativeTime(a.startedAt)}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 pr-3">
                        <span className="font-mono text-text-secondary">{a.signalFilename}</span>
                      </td>
                      <td className="py-2.5 pr-3">
                        {a.modulationLabel ? (
                          <span className="inline-flex items-center gap-1.5 font-mono text-text-primary">
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{
                                background: MOD_TONES[a.modulationLabel] ?? "#22d3ee",
                                boxShadow: `0 0 8px ${MOD_TONES[a.modulationLabel] ?? "#22d3ee"}80`,
                              }}
                              aria-hidden="true"
                            />
                            {a.modulationLabel}
                          </span>
                        ) : (
                          <span className="font-mono text-text-muted">—</span>
                        )}
                      </td>
                      <td className="py-2.5 pr-3">
                        <StatusBadge status={a.status} />
                      </td>
                      <td className="py-2.5 pr-3">
                        <span className="font-mono text-text-secondary">
                          {a.bestPipelineLabel ?? "—"}
                        </span>
                      </td>
                      <td
                        className={`py-2.5 pr-3 text-right font-mono font-medium ${
                          a.bestScore != null ? scoreColor(a.bestScore) : "text-text-muted"
                        }`}
                      >
                        {a.bestScore != null ? a.bestScore.toFixed(2) : "—"}
                      </td>
                      <td className="py-2.5 pr-3 text-right font-mono text-text-muted">
                        {a.timeTakenSeconds != null ? `${a.timeTakenSeconds}s` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-2.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="shimmer h-9 rounded-lg bg-panel-hover" />
              ))}
            </div>
          )}
        </Panel>

        <div className="space-y-4">
          <Panel
            className="animate-fade-up stagger-6"
            title="Pipeline Health"
            subtitle="Recent run outcomes"
            icon={<ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />}
          >
            <div className="flex items-center gap-4">
              <ProgressRing value={derived.successRate} />
              <div className="min-w-0 flex-1 space-y-2.5">
                <div>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-text-muted">
                    <span>Mean score</span>
                    <span className="font-mono text-text-primary">
                      {derived.avgScore ? derived.avgScore.toFixed(2) : "—"}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-accent to-violet-accent transition-[width] duration-1000 ease-out"
                      style={{ width: `${Math.round(derived.avgScore * 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-text-muted">
                    <span>Mean runtime</span>
                    <span className="font-mono text-text-primary">
                      {derived.avgTime ? `${derived.avgTime.toFixed(1)}s` : "—"}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-ok to-cyan-accent transition-[width] duration-1000 ease-out"
                      style={{
                        width: `${Math.min(100, (derived.avgTime / 60) * 100) || 4}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          <Panel
            title="Modulation Mix"
            subtitle="Detected classes"
            icon={<TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />}
          >
            {derived.modMix.length ? (
              <ul className="space-y-2.5">
                {derived.modMix.map((item) => (
                  <li key={item.label} className="group">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-text-secondary">{item.label}</span>
                      <span className="text-text-muted">
                        {item.count} · {Math.round(item.share)}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full transition-[width] duration-700 ease-out"
                        style={{
                          width: `${Math.max(6, item.share)}%`,
                          background:
                            MOD_TONES[item.label] ??
                            "linear-gradient(90deg, #22d3ee, #a78bfa)",
                          boxShadow: `0 0 10px ${(MOD_TONES[item.label] ?? "#22d3ee")}55`,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-4 text-center text-[11px] text-text-muted">
                No completed analyses in the recent feed.
              </p>
            )}
          </Panel>

          <Panel title="Engine" subtitle="Runtime configuration" icon={<Cpu className="h-3.5 w-3.5" aria-hidden="true" />}>
            <dl className="space-y-2 font-mono text-[11px]">
              {[
                ["Model version", "v0.3.1"],
                ["Pipeline depth", "Quick / Standard / Deep"],
                ["Decoders", "Viterbi · Reed–Solomon"],
                ["Transport", "Local adapter"],
              ].map(([key, value]) => (
                <div key={key} className="flex items-center justify-between gap-3">
                  <dt className="text-text-muted">{key}</dt>
                  <dd className="truncate text-right text-text-primary">{value}</dd>
                </div>
              ))}
            </dl>
          </Panel>
        </div>
      </div>
    </div>
  );
}
