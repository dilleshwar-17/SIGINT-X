import { useEffect, useMemo, useState } from "react";
import { FolderOpen, FileUp } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { getSignals } from "@/services/api";
import { useSigintStore } from "@/store/useSigintStore";
import { PanelSkeleton } from "@/components/ui/Skeleton";
import type { Signal } from "@/types";

export function SignalLibraryPage() {
  const [signals, setSignals] = useState<Signal[] | null>(null);
  const [query, setQuery] = useState("");
  const uploadedSignals = useSigintStore((s) => s.signals);

  useEffect(() => {
    getSignals().then(setSignals);
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

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Signal Library"
        subtitle="Searchable store of uploaded IQ / WAV signals."
        actions={
          <Button variant="primary" size="sm">
            <Link to="/analyze" className="flex items-center gap-1.5">
              <FileUp className="h-3.5 w-3.5" aria-hidden="true" />
              Upload Signal
            </Link>
          </Button>
        }
      />

      <Panel title="Signals" icon={<FolderOpen className="h-3.5 w-3.5" aria-hidden="true" />} pad={false}>
        <div className="border-b border-border px-4 py-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by filename or ID..."
            aria-label="Filter signals"
            className="w-full max-w-sm rounded-md border border-border-light bg-bg px-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:border-cyan-dim focus:outline-none"
          />
        </div>
        {signals ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-xs">
              <thead>
                <tr className="border-b border-border-light text-[10px] uppercase tracking-widest text-text-muted">
                  <th className="px-4 py-2.5 font-medium">Signal ID</th>
                  <th className="px-3 py-2.5 font-medium">Filename</th>
                  <th className="px-3 py-2.5 font-medium">Format</th>
                  <th className="px-3 py-2.5 font-medium">Duration</th>
                  <th className="px-3 py-2.5 font-medium">Sample Rate</th>
                  <th className="px-3 py-2.5 font-medium">Status</th>
                  <th className="px-3 py-2.5 font-medium">Last Analysis</th>
                  <th className="px-3 py-2.5 font-medium">Best Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-panel-hover">
                    <td className="px-4 py-2.5 font-mono text-cyan-accent">{s.id}</td>
                    <td className="px-3 py-2.5 font-mono text-text-primary">{s.filename}</td>
                    <td className="px-3 py-2.5">
                      <StatusBadge status={s.format} />
                    </td>
                    <td className="px-3 py-2.5 font-mono text-text-secondary">
                      {s.duration.toFixed(1)}s
                    </td>
                    <td className="px-3 py-2.5 font-mono text-text-secondary">
                      {s.sampleRate ? `${(s.sampleRate / 1e6).toFixed(1)} MHz` : "—"}
                    </td>
                    <td className="px-3 py-2.5">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="px-3 py-2.5 font-mono text-text-secondary">
                      {s.lastAnalysisId ?? "—"}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-text-primary">
                      {s.bestResult ?? "—"}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-sm text-text-muted">
                      No signals match "{query}".
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