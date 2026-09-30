import { useEffect, useMemo, useState } from "react";
import { FolderOpen, FileUp, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { getSignals } from "@/services/api";
import { useSigintStore } from "@/store/useSigintStore";
import { PanelSkeleton } from "@/components/ui/Skeleton";
import type { Signal } from "@/types";

const EM_DASH = "—";

export function SignalLibraryPage() {
  const [signals, setSignals] = useState<Signal[] | null>(null);
  const [query, setQuery] = useState("");
  const uploadedSignals = useSigintStore((s) => s.signals);

  useEffect(() => {
    getSignals().then(setSignals).catch(() => setSignals([]));
  }, []);

  const library = useMemo(() => {
    const catalog = signals ?? [];
    const ids = new Set(uploadedSignals.map((s) => s.id));
    return [...uploadedSignals, ...catalog.filter((s) => !ids.has(s.id))];
  }, [signals, uploadedSignals]);

  const filtered = library.filter(
    (s) =>
      s.filename.toLowerCase().includes(query.toLowerCase()) ||
      s.id.toLowerCase().includes(query.toLowerCase()),
  );

  const analyzedCount = library.filter((s) => s.status === "ANALYZED").length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Ingest"
        title="Signal Library"
        subtitle="Searchable store of uploaded IQ and WAV captures awaiting or resolved by analysis."
        actions={
          <Link to="/analyze">
            <Button variant="primary" size="md">
              <FileUp className="h-3.5 w-3.5" aria-hidden="true" />
              Upload Signal
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total signals", value: library.length },
          { label: "Analyzed", value: analyzedCount },
          { label: "Formats", value: new Set(library.map((s) => s.format)).size },
          {
            label: "Matched",
            value: filtered.length,
            accent: query ? "text-cyan-accent" : undefined,
          },
        ].map((item) => (
          <div key={item.label} className="panel-surface px-4 py-3">
            <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-text-muted">
              {item.label}
            </div>
            <div className={`mt-1 font-mono text-xl font-semibold ${item.accent ?? "text-text-primary"}`}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <Panel
        title="Signals"
        subtitle={`${filtered.length} of ${library.length} records`}
        icon={<FolderOpen className="h-3.5 w-3.5" aria-hidden="true" />}
        pad={false}
      >
        <div className="border-b border-border/70 px-4 py-3">
          <div className="group relative max-w-sm">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-cyan-accent"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by filename or ID…"
              aria-label="Filter signals"
              className="w-full rounded-lg border border-border-light/80 bg-bg/60 py-2 pl-9 pr-3 text-xs text-text-primary placeholder:text-text-muted transition-colors focus:border-cyan-accent/60 focus:bg-cyan-accent/[0.04] focus:outline-none"
            />
          </div>
        </div>

        {signals ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-xs">
              <thead>
                <tr className="border-b border-border/70 text-[9px] uppercase tracking-[0.16em] text-text-muted">
                  <th className="px-4 py-2.5 font-semibold">Signal ID</th>
                  <th className="px-3 py-2.5 font-semibold">Filename</th>
                  <th className="px-3 py-2.5 font-semibold">Format</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Duration</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Sample Rate</th>
                  <th className="px-3 py-2.5 font-semibold">Status</th>
                  <th className="px-3 py-2.5 font-semibold">Last Analysis</th>
                  <th className="px-3 py-2.5 font-semibold">Best Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((s) => (
                  <tr key={s.id} className="transition-colors hover:bg-white/[0.035]">
                    <td className="px-4 py-3 font-mono text-cyan-accent">{s.id}</td>
                    <td className="px-3 py-3 font-mono text-text-primary">{s.filename}</td>
                    <td className="px-3 py-3">
                      <StatusBadge status={s.format} />
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-text-secondary">
                      {s.duration.toFixed(1)}s
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-text-secondary">
                      {s.sampleRate ? `${(s.sampleRate / 1e6).toFixed(1)} MHz` : EM_DASH}
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="px-3 py-3 font-mono text-text-secondary">
                      {s.lastAnalysisId ?? EM_DASH}
                    </td>
                    <td className="px-3 py-3 font-mono text-text-primary">
                      {s.bestResult ?? EM_DASH}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-sm text-text-muted">
                      No signals match &ldquo;{query}&rdquo;.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4">
            <PanelSkeleton rows={6} />
          </div>
        )}
      </Panel>
    </div>
  );
}
