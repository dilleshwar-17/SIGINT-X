import { useEffect, useState } from "react";
import { Cpu } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getModels } from "@/services/api";
import { PanelSkeleton } from "@/components/ui/Skeleton";
import type { ModelInfo } from "@/types";

export function ModelsPage() {
  const [models, setModels] = useState<ModelInfo[] | null>(null);

  useEffect(() => {
    getModels().then(setModels);
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader title="Models" subtitle="Deployed analysis and classification models." />
      {models ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {models.map((m) => (
            <Panel key={m.id} title={m.name} icon={<Cpu className="h-3.5 w-3.5" aria-hidden="true" />}>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-text-muted">Version</dt>
                  <dd className="font-mono text-text-primary">{m.version}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-text-muted">Classes</dt>
                  <dd className="font-mono text-text-primary">{m.classes > 0 ? m.classes : "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-text-muted">Validation Accuracy</dt>
                  <dd className="font-mono text-text-primary">
                    {(m.validationAccuracy * 100).toFixed(1)}%
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-text-muted">Dataset</dt>
                  <dd className="text-text-secondary">{m.dataset}</dd>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <dt className="text-text-muted">Status</dt>
                  <dd>
                    <StatusBadge status={m.status} />
                  </dd>
                </div>
              </dl>
            </Panel>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <PanelSkeleton rows={5} />
          <PanelSkeleton rows={5} />
        </div>
      )}
    </div>
  );
}