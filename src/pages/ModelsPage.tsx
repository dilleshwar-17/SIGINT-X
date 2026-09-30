import { useEffect, useState } from "react";
import { Cpu, Boxes, Rocket, Wrench, Gauge } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getModels } from "@/services/api";
import { PanelSkeleton } from "@/components/ui/Skeleton";
import type { ModelInfo } from "@/types";

function tone(value: number) {
  if (value >= 0.95) return "bg-ok";
  if (value >= 0.85) return "bg-cyan-accent";
  if (value >= 0.75) return "bg-warn";
  return "bg-err";
}

export function ModelsPage() {
  const [models, setModels] = useState<ModelInfo[] | null>(null);

  useEffect(() => {
    getModels().then(setModels);
  }, []);

  const prod = models?.filter((m) => m.status === "Production").length ?? 0;
  const dev = models?.filter((m) => m.status === "Development").length ?? 0;
  const avg =
    models && models.length
      ? models.reduce((s, m) => s + m.validationAccuracy, 0) / models.length
      : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Registry"
        title="Models"
        subtitle="Deployed analysis and classification models backing the pipeline."
      />

      {models ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Registered models"
            value={models.length}
            icon={<Cpu className="h-3.5 w-3.5" aria-hidden="true" />}
            accent="cyan"
          />
          <StatCard
            label="In production"
            value={prod}
            icon={<Rocket className="h-3.5 w-3.5" aria-hidden="true" />}
            accent="ok"
          />
          <StatCard
            label="In development"
            value={dev}
            icon={<Wrench className="h-3.5 w-3.5" aria-hidden="true" />}
            accent="warn"
          />
          <StatCard
            label="Avg validation acc"
            value={`${(avg * 100).toFixed(1)}%`}
            icon={<Gauge className="h-3.5 w-3.5" aria-hidden="true" />}
            accent="violet"
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

      <Panel title="Model Registry" icon={<Boxes className="h-3.5 w-3.5" aria-hidden="true" />}>
        {models ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {models.map((m) => (
              <article
                key={m.id}
                className="panel-surface panel-surface-hover p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">{m.name}</h3>
                    <p className="mt-0.5 font-mono text-[10px] text-text-muted">
                      {m.id} · {m.version}
                    </p>
                  </div>
                  <StatusBadge status={m.status} />
                </div>

                <div className="mt-3 space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-text-muted">Classes</dt>
                    <dd className="font-mono text-text-primary">{m.classes > 0 ? m.classes : "regression"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-text-muted">Dataset</dt>
                    <dd className="text-right text-text-secondary">{m.dataset}</dd>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-text-muted">
                      Validation accuracy
                    </span>
                    <span className="font-mono text-xs text-text-secondary">
                      {(m.validationAccuracy * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]" role="presentation">
                    <div
                      className={`h-full rounded-full ${tone(m.validationAccuracy)} transition-[width] duration-700 ease-out`}
                      style={{ width: `${m.validationAccuracy * 100}%` }}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <PanelSkeleton rows={5} />
            <PanelSkeleton rows={5} />
          </div>
        )}
      </Panel>
    </div>
  );
}