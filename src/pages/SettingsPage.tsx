import { Server, Eye, Wrench } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { useSigintStore } from "@/store/useSigintStore";

const selectClass =
  "w-full max-w-xs rounded-lg border border-border-light/80 bg-bg/60 px-3 py-2 text-xs text-text-primary transition-colors focus:border-cyan-accent/60 focus:bg-cyan-accent/[0.04] focus:outline-none";

export function SettingsPage() {
  const apiStatus = useSigintStore((s) => s.apiStatus);
  const visualizationSettings = useSigintStore((s) => s.visualizationSettings);
  const setVisualizationSettings = useSigintStore((s) => s.setVisualizationSettings);

  const reachable = apiStatus?.reachable ?? false;

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        eyebrow="Configuration"
        title="Settings"
        subtitle="System, analysis and visualization configuration."
      />

      <Panel
        title="System"
        subtitle="Backend connectivity"
        icon={<Server className="h-3.5 w-3.5" aria-hidden="true" />}
        tone={reachable ? "ok" : "warn"}
      >
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-border/70 bg-white/[0.02] px-4 py-3">
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${reachable ? "bg-ok" : "bg-warn"}`}
            style={{ animation: "blink 2.2s ease-in-out infinite" }}
            aria-hidden="true"
          />
          <span className={`text-sm font-medium ${reachable ? "text-ok" : "text-warn"}`}>
            {reachable ? "Backend connected" : "Backend not connected"}
          </span>
        </div>

        <dl className="space-y-2.5 text-sm">
          {[
            ["Backend Version", apiStatus?.backendVersion ?? "unavailable"],
            ["Model Version", apiStatus?.modelVersion ?? "—"],
          ].map(([key, value]) => (
            <div key={key} className="flex items-center justify-between gap-3">
              <dt className="text-text-muted">{key}</dt>
              <dd className="truncate font-mono text-text-primary">{value}</dd>
            </div>
          ))}
        </dl>
      </Panel>

      <Panel
        title="Visualization"
        subtitle="Chart rendering budget"
        icon={<Eye className="h-3.5 w-3.5" aria-hidden="true" />}
      >
        <div className="space-y-5">
          <label className="block text-sm">
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted">
              Display point limit
            </span>
            <select
              value={String(visualizationSettings.maxPoints)}
              onChange={(e) => setVisualizationSettings({ maxPoints: Number(e.target.value) })}
              className={selectClass}
            >
              <option value="10000">10,000 points</option>
              <option value="50000">50,000 points (default)</option>
              <option value="150000">150,000 points</option>
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted">
              Poll refresh rate
            </span>
            <select
              value={String(visualizationSettings.refreshRateMs)}
              onChange={(e) =>
                setVisualizationSettings({ refreshRateMs: Number(e.target.value) })
              }
              className={selectClass}
            >
              <option value="1000">1s</option>
              <option value="2000">2s (default)</option>
              <option value="5000">5s</option>
            </select>
          </label>
        </div>
      </Panel>

      <Panel
        title="About"
        subtitle="Platform"
        icon={<Wrench className="h-3.5 w-3.5" aria-hidden="true" />}
      >
        <p className="text-sm leading-relaxed text-text-secondary">
          SIGINT-X v0.1.0 — Autonomous Signal Analysis &amp; Decoding Pipeline Discovery Platform.
          Built for Smart India Hackathon 2026 (SIH26147).
        </p>
      </Panel>
    </div>
  );
}
