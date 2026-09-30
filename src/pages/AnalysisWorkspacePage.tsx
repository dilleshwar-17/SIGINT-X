import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Brain, Binary, ChevronRight, FileText, GitBranch } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ParameterCard } from "@/components/analysis/ParameterCard";
import { ModulationPanel } from "@/components/analysis/ModulationPanel";
import { EvidencePanel } from "@/components/analysis/EvidencePanel";
import { HypothesisEngine } from "@/components/analysis/HypothesisEngine";
import { Button } from "@/components/ui/Button";
import { SpectrumChart } from "@/components/charts/SpectrumChart";
import { WaterfallChart } from "@/components/charts/WaterfallChart";
import { ConstellationChart } from "@/components/charts/ConstellationChart";
import { WaveformChart } from "@/components/charts/WaveformChart";
import { getAnalysisMock, getSignalFeatures } from "@/services/api";
import { mockEvidence, mockHypotheses, mockModulationPrediction } from "@/services/mockData";
import {
  generateConstellation,
  generateSpectrum,
  generateWaterfall,
  generateWaveform,
} from "@/services/chartData";
import { useSigintStore } from "@/store/useSigintStore";
import { PanelSkeleton } from "@/components/ui/Skeleton";
import type { Analysis, SignalParameters } from "@/types";

export function AnalysisWorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [params, setParams] = useState<SignalParameters | null>(null);
  const pipelines = useSigintStore((s) => s.pipelines);
  const setAnalysisStatus = useSigintStore((s) => s.setAnalysisStatus);

  const spectrum = useMemo(() => generateSpectrum(), []);
  const waterfall = useMemo(() => generateWaterfall(), []);
  const constellation = useMemo(() => generateConstellation(), []);
  const waveform = useMemo(() => generateWaveform(), []);

  useEffect(() => {
    if (!id) return;
    setAnalysisStatus("COMPLETED");
    const stored = useSigintStore.getState().analyses.find((a) => a.id === id);
    if (stored) {
      setAnalysis(stored);
    } else {
      getAnalysisMock(id).then(setAnalysis);
    }
    getSignalFeatures("SIG-001").then(setParams);
    useSigintStore.getState().setPipelines([
      {
        id: "PLN-001",
        stageNames: ["IQ", "Synchronize", "QPSK", "Conv. Deinterleave", "Viterbi", "Bit Stream"],
        score: 0.94,
        rank: 1,
        status: "BEST",
        decoder: "Viterbi",
        stages: [],
      },
      {
        id: "PLN-002",
        stageNames: ["IQ", "Synchronize", "QPSK", "Block", "Viterbi", "Bit Stream"],
        score: 0.71,
        rank: 2,
        status: "CANDIDATE",
        decoder: "Viterbi",
        stages: [],
      },
      {
        id: "PLN-003",
        stageNames: ["IQ", "Synchronize", "8PSK", "Block", "Reed-Solomon", "Bit Stream"],
        score: 0.38,
        rank: 3,
        status: "FAILED",
        decoder: "Reed-Solomon",
        stages: [],
      },
    ]);
  }, [id, setAnalysisStatus]);

  return (
    <div className="space-y-5">
      <div className="animate-fade-up flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-1.5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-accent/80">
            <span className="h-px w-6 bg-gradient-to-r from-cyan-accent to-transparent" aria-hidden="true" />
            Analysis Workspace
          </div>
          <h1 className="flex flex-wrap items-baseline gap-2 text-gradient text-2xl font-semibold tracking-tight sm:text-[28px]">
            <span className="text-text-primary">Signal</span>
            <span className="font-mono text-cyan-accent">
              {analysis?.signalFilename ?? "unknown_001.iq"}
            </span>
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-text-secondary">
            <span className="font-mono text-xs text-text-muted">{analysis?.id ?? id}</span>
            <StatusBadge status="COMPLETED" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link to={`/analyze/${id}/bits`}>
            <Button variant="secondary" size="sm">
              <Binary className="h-3.5 w-3.5" aria-hidden="true" />
              Bits &amp; Frame
            </Button>
          </Link>
          <Link to={`/analyze/${id}/pipelines`}>
            <Button variant="secondary" size="sm">
              <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
              Pipelines
            </Button>
          </Link>
          <Link to={`/analyze/${id}/report`}>
            <Button variant="primary" size="sm">
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              Report
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {params ? (
          <>
            <ParameterCard
              label="Sample Rate"
              value="2.400"
              unit="MHz"
              confidence={params.sampleRateConfidence}
              method={params.sampleRateMethod}
            />
            <ParameterCard
              label="Bandwidth"
              value="180"
              unit="kHz"
              confidence={params.bandwidthConfidence}
              method={params.bandwidthMethod}
            />
            <ParameterCard
              label="SNR"
              value="14.8"
              unit="dB"
              confidence={params.snrConfidence}
              method={params.snrMethod}
            />
            <ParameterCard
              label="Symbol Rate"
              value="120"
              unit="kSym/s"
              confidence={params.symbolRateConfidence}
              method={params.symbolRateMethod}
            />
          </>
        ) : (
          Array.from({ length: 4 }).map((_, i) => <PanelSkeleton key={i} rows={3} />)
        )}
      </div>

      <WaveformChart data={waveform} height={220} />

      <div className="grid gap-4 lg:grid-cols-2">
        <SpectrumChart data={spectrum} />
        <WaterfallChart data={waterfall} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ConstellationChart data={constellation} />

        <Panel title="AI Signal Analysis" icon={<Brain className="h-3.5 w-3.5" aria-hidden="true" />}>
          <div className="flex h-full flex-col justify-between gap-5">
            <ModulationPanel prediction={mockModulationPrediction} />
            <div>
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                Supporting Evidence
              </div>
              <EvidencePanel items={mockEvidence} />
            </div>
          </div>
        </Panel>
      </div>

      <Panel title="Hypothesis Engine" icon={<Brain className="h-3.5 w-3.5" aria-hidden="true" />}>
        <HypothesisEngine hypotheses={mockHypotheses} />
      </Panel>

      <Panel
        title="Autonomous Pipeline Discovery"
        icon={<GitBranch className="h-3.5 w-3.5" aria-hidden="true" />}
        actions={
          <Link to={`/analyze/${id}/pipelines`}>
            <Button variant="ghost" size="sm">
              Explore all
              <ChevronRight className="h-3 w-3" aria-hidden="true" />
            </Button>
          </Link>
        }
      >
        {pipelines ? (
          <ul className="divide-y divide-border/60">
            {pipelines.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`font-mono text-sm font-semibold ${
                      p.status === "BEST" ? "text-cyan-accent" : "text-text-primary"
                    }`}
                  >
                    #{p.rank}
                  </span>
                  <span className="truncate font-mono text-xs text-text-secondary">
                    {p.stageNames.join(" → ")}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <div className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-white/[0.07] sm:block">
                    <div
                      className="h-full rounded-full transition-[width] duration-700 ease-out"
                      style={{
                        width: `${Math.round(p.score * 100)}%`,
                        background:
                          p.status === "BEST"
                            ? "linear-gradient(90deg, #34d399, #22d3ee)"
                            : p.status === "FAILED"
                              ? "linear-gradient(90deg, #f87171, #ef4444)"
                              : "linear-gradient(90deg, #fbbf24, #fb923c)",
                      }}
                    />
                  </div>
                  <span
                    className={`font-mono text-sm tabular-nums ${
                      p.status === "BEST"
                        ? "text-ok"
                        : p.status === "FAILED"
                          ? "text-err"
                          : "text-text-secondary"
                    }`}
                  >
                    {Math.round(p.score * 100)}%
                  </span>
                  <StatusBadge status={p.status} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <PanelSkeleton rows={4} />
        )}
      </Panel>
    </div>
  );
}