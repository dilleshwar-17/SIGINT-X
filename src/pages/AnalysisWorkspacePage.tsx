import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Brain, GitBranch } from "lucide-react";
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
    getAnalysisMock(id).then(setAnalysis);
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Signal:{" "}
            <span className="font-mono text-cyan-accent">
              {analysis?.signalFilename ?? "unknown_001.iq"}
            </span>
          </h1>
          <div className="mt-1 flex items-center gap-3 text-sm text-text-secondary">
            <span className="font-mono">{analysis?.id ?? id}</span>
            <StatusBadge status="COMPLETED" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <Link to={`/analyze/${id}/bits`} className="flex items-center gap-1.5">
              Bits &amp; Frame
            </Link>
          </Button>
          <Button variant="secondary" size="sm">
            <Link to={`/analyze/${id}/pipelines`} className="flex items-center gap-1.5">
              <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
              Pipelines
            </Link>
          </Button>
          <Button variant="secondary" size="sm">
            <Link to={`/analyze/${id}/report`} className="flex items-center gap-1.5">
              Report
            </Link>
          </Button>
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
          <Button variant="ghost" size="sm">
            <Link to={`/analyze/${id}/pipelines`}>Explore all</Link>
          </Button>
        }
      >
        {pipelines ? (
          <ul className="divide-y divide-border">
            {pipelines.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-sm ${
                      p.status === "BEST" ? "text-cyan-accent" : "text-text-primary"
                    }`}
                  >
                    #{p.rank}
                  </span>
                  <span className="font-mono text-xs text-text-secondary">
                    {p.stageNames.join(" → ")}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono text-sm ${
                      p.status === "BEST" ? "text-ok" : p.status === "FAILED" ? "text-err" : "text-text-secondary"
                    }`}
                  >
                    {p.status === "BEST" ? "★" : ""} {Math.round(p.score * 100)}%
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