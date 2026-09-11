import { Server, Eye, Wrench } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { useSigintStore } from "@/store/useSigintStore";

export function SettingsPage() {
  const apiStatus = useSigintStore((s) => s.apiStatus);
  const visualizationSettings = useSigintStore((s) => s.visualizationSettings);
  const setVisualizationSettings = useSigintStore((s) => s.setVisualizationSettings);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Settings" subtitle="System, analysis and visualization configuration." />

      <Panel title="System" icon={<Server className="h-3.5 w-3.5" aria-hidden="true" />}>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-text-muted">API Status</dt>
            <dd className={apiStatus?.reachable ? "text-ok" : "text-warn"}>
              {apiStatus?.reachable ? "Connected" : "Mock mode (backend not connected)"}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-muted">Backend Version</dt>
            <dd className="font-mono text-text-primary">{apiStatus?.backendVersion ?? "unavailable"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-muted">Model Version</dt>
            <dd className="font-mono text-text-primary">{apiStatus?.modelVersion ?? "—"}</dd>
          </div>
        </dl>
      </Panel>

      <Panel title="Visualization" icon={<Eye className="h-3.5 w-3.5" aria-hidden="true" />}>
        <div className="space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block text-text-muted">Display point limit</span>
            <select
              value={String(visualizationSettings.maxPoints)}
              onChange={(e) =>
                setVisualizationSettings({ maxPoints: Number(e.target.value) })
              }
              className="w-full max-w-xs rounded-md border border-border-light bg-panel px-3 py-1.5 text-xs text-text-primary focus:border-cyan-dim focus:outline-none"
            >
              <option value="10000">10,000 points</option>
              <option value="50000">50,000 points (default)</option>
              <option value="150000">150,000 points</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-text-muted">Poll refresh rate</span>
            <select
              value={String(visualizationSettings.refreshRateMs)}
              onChange={(e) =>
                setVisualizationSettings({ refreshRateMs: Number(e.target.value) })
              }
              className="w-full max-w-xs rounded-md border border-border-light bg-panel px-3 py-1.5 text-xs text-text-primary focus:border-cyan-dim focus:outline-none"
            >
              <option value="1000">1s</option>
              <option value="2000">2s (default)</option>
              <option value="5000">5s</option>
            </select>
          </label>
        </div>
      </Panel>

      <Panel title="About" icon={<Wrench className="h-3.5 w-3.5" aria-hidden="true" />}>
        <p className="text-sm text-text-secondary">
          SIGINT-X v0.1.0 — Autonomous Signal Analysis &amp; Decoding Pipeline Discovery Platform.
          Built for Smart India Hackathon 2026 (SIH26147).
        </p>
      </Panel>
    </div>
  );
}