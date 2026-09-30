import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Play, Settings2, X } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { SignalUploader } from "@/components/signal/SignalUploader";
import { Button } from "@/components/ui/Button";
import { useSigintStore } from "@/store/useSigintStore";
import type { Analysis, AnalysisDepth, AnalysisMode, Signal } from "@/types";

const depths: { value: AnalysisDepth; hint: string }[] = [
  { value: "Quick", hint: "Parameter estimation only" },
  { value: "Standard", hint: "Balanced discovery run" },
  { value: "Deep", hint: "Exhaustive candidate scoring" },
];

const modes: { value: AnalysisMode; label: string; hint: string }[] = [
  { value: "automatic", label: "Automatic", hint: "Full autonomous pipeline discovery" },
  { value: "manual", label: "Manual Assistance", hint: "Analyst-guided parameter handling" },
];

const DEPTH_COVERAGE: Record<AnalysisDepth, number> = { Quick: 34, Standard: 66, Deep: 100 };

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
    <div className="max-w-4xl space-y-6">
      <PageHeader
        eyebrow="Ingest"
        title="New Analysis"
        subtitle="Upload an IQ / WAV signal and configure the autonomous analysis pipeline."
      />

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-3">
          <Panel
            title="Step 1 · Upload Signal"
            subtitle="IQ, WAV or raw capture"
            pad={false}
            tone={signal ? "ok" : "default"}
          >
            <div className="p-4">
              <SignalUploader onUploaded={setSignal} />
            </div>
          </Panel>

          <Panel title="Step 2 · Analysis Configuration" pad={false}>
            <div className="space-y-6 p-4">
              <div>
                <div className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted">
                  Processing Mode
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {modes.map((m) => {
                    const selected = mode === m.value;
                    return (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => setMode(m.value)}
                        aria-pressed={selected}
                        className={`group relative rounded-xl border p-3.5 text-left transition-all duration-200 focus-ring ${
                          selected
                            ? "border-cyan-accent/50 bg-gradient-to-br from-cyan-accent/[0.13] to-transparent shadow-[0_12px_30px_-20px_rgba(34,211,238,0.9)]"
                            : "border-border-light/70 bg-white/[0.02] hover:border-cyan-dim/50 hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-text-primary">{m.label}</span>
                          <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                              selected
                                ? "border-cyan-accent bg-cyan-accent shadow-[0_0_10px_rgba(34,211,238,0.7)]"
                                : "border-border-light group-hover:border-cyan-dim/60"
                            }`}
                            aria-hidden="true"
                          >
                            {selected && (
                              <span className="h-1.5 w-1.5 rounded-full bg-[#04121a]" />
                            )}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-text-muted">{m.hint}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted">
                    Analysis Depth
                  </span>
                  <span className="font-mono text-[10px] text-text-muted">
                    {DEPTH_COVERAGE[depth]}% candidate coverage
                  </span>
                </div>

                <div
                  role="radiogroup"
                  aria-label="Analysis depth"
                  className="grid grid-cols-3 gap-1 rounded-xl border border-border-light/70 bg-white/[0.02] p-1"
                >
                  {depths.map((d) => {
                    const selected = depth === d.value;
                    return (
                      <button
                        key={d.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setDepth(d.value)}
                        className={`rounded-lg px-2 py-2 text-center transition-all duration-200 focus-ring ${
                          selected
                            ? "bg-gradient-to-br from-cyan-accent to-cyan-dim font-medium text-[#04121a] shadow-[0_10px_24px_-12px_rgba(34,211,238,0.9)]"
                            : "text-text-secondary hover:bg-white/[0.05] hover:text-text-primary"
                        }`}
                      >
                        <span className="block text-sm">{d.value}</span>
                        <span
                          className={`mt-0.5 block text-[9px] ${
                            selected ? "text-[#04121a]/70" : "text-text-muted"
                          }`}
                        >
                          {d.hint}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setShowAdvanced((v) => !v)}
                  aria-expanded={showAdvanced}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-cyan-accent/[0.07] hover:text-cyan-accent focus-ring"
                >
                  <Settings2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Advanced Settings
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      showAdvanced ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {showAdvanced && (
                  <div className="animate-fade-in mt-3 grid gap-4 rounded-xl border border-border/70 bg-white/[0.02] p-4 sm:grid-cols-2">
                    {["Sample Rate (Hz)", "Center Frequency (Hz)"].map((label) => (
                      <label key={label} className="block text-xs">
                        <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted">
                          {label}
                        </span>
                        <input
                          type="text"
                          placeholder="Unknown"
                          className="w-full rounded-lg border border-border-light/80 bg-bg/60 px-3 py-2 font-mono text-xs text-text-primary placeholder:text-text-muted transition-colors focus:border-cyan-accent/60 focus:bg-cyan-accent/[0.04] focus:outline-none"
                        />
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Panel>
        </div>

        <div className="lg:col-span-2">
          <Panel
            title="Run Summary"
            subtitle="What will execute"
            className="sticky top-20"
            tone={signal ? "cyan" : "default"}
            footer={
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => navigate("/signals")} className="flex-1">
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  disabled={!signal}
                  onClick={startAnalysis}
                  className="flex-1"
                >
                  <Play className="h-3.5 w-3.5" aria-hidden="true" />
                  Start
                </Button>
              </div>
            }
          >
            <dl className="space-y-2.5 font-mono text-[11px]">
              {[
                ["Signal", signal ? signal.filename : "Not selected"],
                ["Format", signal ? signal.format : "—"],
                ["Size", signal ? `${(signal.sizeBytes / 1e6).toFixed(1)} MB` : "—"],
                ["Mode", mode === "automatic" ? "Automatic" : "Manual"],
                ["Depth", depth],
                ["Coverage", `${DEPTH_COVERAGE[depth]}%`],
              ].map(([key, value]) => (
                <div key={key} className="flex items-center justify-between gap-3">
                  <dt className="text-text-muted">{key}</dt>
                  <dd
                    className={`truncate text-right ${
                      key === "Signal" && !signal ? "text-warn" : "text-text-primary"
                    }`}
                  >
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-4 rounded-lg border border-border/70 bg-white/[0.02] p-3">
              <div className="mb-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-text-muted">
                Pipeline stages
              </div>
              <ol className="space-y-1.5">
                {[
                  "IQ ingest",
                  "Synchronize",
                  "Demodulate",
                  "Deinterleave",
                  "Decode",
                  "Validate frame",
                ].map((stage, index) => (
                  <li key={stage} className="flex items-center gap-2 text-[11px] text-text-secondary">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-border-light/80 font-mono text-[9px] text-text-muted">
                      {index + 1}
                    </span>
                    {stage}
                  </li>
                ))}
              </ol>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
