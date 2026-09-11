import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Settings2, ChevronDown } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { SignalUploader } from "@/components/signal/SignalUploader";
import { Button } from "@/components/ui/Button";
import { useSigintStore } from "@/store/useSigintStore";
import type { Analysis, AnalysisDepth, AnalysisMode, Signal } from "@/types";

const depths: AnalysisDepth[] = ["Quick", "Standard", "Deep"];
const modes: { value: AnalysisMode; label: string; hint: string }[] = [
  { value: "automatic", label: "Automatic", hint: "Full autonomous pipeline discovery" },
  { value: "manual", label: "Manual Assistance", hint: "Analyst-guided parameter handling" },
];

export function NewAnalysisPage() {
  const navigate = useNavigate();
  const [signal, setSignal] = useState<Signal | null>(null);
  const [depth, setDepth] = useState<AnalysisDepth>("Standard");
  const [mode, setMode] = useState<AnalysisMode>("automatic");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const startAnalysis = () => {
    if (!signal) return;
    const analysis: Analysis = {
      id: `ANL-${Date.now().toString(36)}`,
      signalId: signal.id,
      signalFilename: signal.filename,
      status: "COMPLETED",
      mode,
      depth,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
    useSigintStore.getState().addAnalysis(analysis);
    useSigintStore.getState().setCurrentAnalysis(analysis);
    useSigintStore.getState().setCurrentSignal(signal);
    navigate(`/analyze/${analysis.id}`);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="New Analysis"
        subtitle="Upload an IQ / WAV signal and configure the autonomous analysis pipeline."
      />

      <Panel title="1 · Upload Signal" pad={false}>
        <div className="p-4">
          <SignalUploader onUploaded={setSignal} />
        </div>
      </Panel>

      <Panel title="2 · Analysis Configuration" pad={false}>
        <div className="space-y-5 p-4">
          <div>
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
              Processing Mode
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {modes.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMode(m.value)}
                  aria-pressed={mode === m.value}
                  className={`rounded-md border p-3 text-left transition-colors focus-ring ${
                    mode === m.value
                      ? "border-cyan-accent/60 bg-cyan-accent/10"
                      : "border-border bg-panel hover:bg-panel-hover"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">{m.label}</span>
                    <span
                      className={`h-2.5 w-2.5 rounded-full border ${
                        mode === m.value ? "border-cyan-accent bg-cyan-accent" : "border-border-light"
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-1 text-xs text-text-muted">{m.hint}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
              Analysis Depth
            </div>
            <div
              role="radiogroup"
              aria-label="Analysis depth"
              className="inline-flex rounded-md border border-border bg-panel p-1"
            >
              {depths.map((d) => (
                <button
                  key={d}
                  type="button"
                  role="radio"
                  aria-checked={depth === d}
                  onClick={() => setDepth(d)}
                  className={`rounded px-3 py-1 text-sm transition-colors focus-ring ${
                    depth === d
                      ? "bg-cyan-dim/80 font-medium text-bg"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-text-muted">Default: Standard</p>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              aria-expanded={showAdvanced}
              className="flex items-center gap-1.5 text-xs font-medium text-text-secondary transition-colors hover:text-cyan-accent focus-ring"
            >
              <Settings2 className="h-3.5 w-3.5" aria-hidden="true" />
              Advanced Settings
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
            {showAdvanced && (
              <div className="mt-3 grid gap-4 rounded-md border border-border bg-surface p-4 sm:grid-cols-2">
                <label className="block text-xs">
                  <span className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                    Sample Rate (Hz)
                  </span>
                  <input
                    type="text"
                    placeholder="Unknown"
                    className="w-full rounded-md border border-border-light bg-panel px-3 py-1.5 font-mono text-xs text-text-primary focus:border-cyan-dim focus:outline-none"
                  />
                </label>
                <label className="block text-xs">
                  <span className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                    Center Frequency (Hz)
                  </span>
                  <input
                    type="text"
                    placeholder="Unknown"
                    className="w-full rounded-md border border-border-light bg-panel px-3 py-1.5 font-mono text-xs text-text-primary focus:border-cyan-dim focus:outline-none"
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      </Panel>

      <div className="flex items-center justify-end gap-3">
        <Button variant="ghost" onClick={() => navigate("/signals")}>
          <Link to="/signals">Cancel</Link>
        </Button>
        <Button variant="primary" size="lg" disabled={!signal} onClick={startAnalysis}>
          Start Analysis
        </Button>
      </div>
    </div>
  );
}