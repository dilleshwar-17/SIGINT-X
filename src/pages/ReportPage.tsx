import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FileText, FileJson, Copy, Check, FileDown } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { ConfidenceBar } from "@/components/analysis/ConfidenceBar";
import { ReportSection } from "@/components/reports/ReportSection";
import { PanelSkeleton } from "@/components/ui/Skeleton";
import {
  getAnalysisMock,
  getBitStream,
  getFrame,
  getPipelines,
  getSignalFeatures,
} from "@/services/api";
import { buildReport, reportSummary, type AnalysisReport } from "@/services/reportBuilder";

export function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      getAnalysisMock(id),
      getSignalFeatures("SIG-001"),
      getPipelines(id),
      getBitStream(),
      getFrame(),
    ]).then(([analysis, parameters, pipelines, bitStream, frame]) => {
      setReport(buildReport({ analysis, parameters, pipelines, bitStream, frame }));
    });
  }, [id]);

  const exportJson = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.reportId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /**
   * Renders the report through the browser's own print pipeline, which offers
   * "Save as PDF". Text stays vector and selectable, unlike a canvas snapshot.
   */
  const exportPdf = () => {
    if (!report || exporting) return;
    setExporting(true);

    const previousTitle = document.title;
    const slug = report.reportId.replace(/[^\w.-]+/g, "_");
    document.title = `${slug}`;

    // Let the state update (and the spinner paint) land before the modal
    // print dialog blocks the main thread.
    window.setTimeout(() => {
      window.print();
      document.title = previousTitle;
      setExporting(false);
    }, 120);
  };

  const copySummary = async () => {
    if (!report) return;
    try {
      await navigator.clipboard.writeText(reportSummary(report));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      <PageHeader
        eyebrow="Deliverable"
        title="Analysis Report"
        subtitle="Explainable summary of the autonomous analysis."
        actions={
          <>
            <Button
              variant="primary"
              size="sm"
              onClick={exportPdf}
              disabled={!report || exporting}
              title="Open the print dialog and choose 'Save as PDF'"
            >
              <FileDown className="h-3.5 w-3.5" aria-hidden="true" />
              {exporting ? "Preparing…" : "Export PDF"}
            </Button>
            <Button variant="secondary" size="sm" onClick={exportJson} disabled={!report}>
              <FileJson className="h-3.5 w-3.5" aria-hidden="true" /> Export JSON
            </Button>
            <Button variant="secondary" size="sm" onClick={copySummary} disabled={!report}>
              {copied ? (
                <Check className="h-3.5 w-3.5 text-ok" aria-hidden="true" />
              ) : (
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {copied ? "Copied" : "Copy Summary"}
            </Button>
          </>
        }
      />

      {report && (
        <p role="status" className="print-only mb-4 border-b border-border pb-3 text-[11px] text-text-muted">
          <span className="font-semibold text-text-primary">{report.reportId}</span> ·{" "}
          {report.analysisId} · generated {new Date(report.generatedAt).toLocaleString()} · SIGINT-X
        </p>
      )}

      {report ? (
        <>
          <Panel title="SIGINT-X Analysis Report" icon={<FileText className="h-3.5 w-3.5" aria-hidden="true" />}>
            <div className="space-y-6">
              <ReportSection number={1} title="Signal Information">
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li>Filename: <span className="font-mono text-text-primary">{report.signal.filename}</span></li>
                  <li>Format: {report.signal.format}</li>
                  <li>Sample rate: <span className="font-mono">{report.signal.sampleRate?.toLocaleString() ?? "unknown"} Hz</span></li>
                </ul>
              </ReportSection>

              <ReportSection number={2} title="Signal Parameters">
                <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-text-secondary sm:grid-cols-4">
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-text-muted">Sample Rate</dt>
                    <dd className="font-mono text-text-primary">{(report.parameters.sampleRate ?? 0) / 1e6} MHz</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-text-muted">Bandwidth</dt>
                    <dd className="font-mono text-text-primary">{(report.parameters.bandwidth ?? 0) / 1e3} kHz</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-text-muted">SNR</dt>
                    <dd className="font-mono text-text-primary">{report.parameters.snr} dB</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-text-muted">Symbol Rate</dt>
                    <dd className="font-mono text-text-primary">{(report.parameters.symbolRate ?? 0) / 1e3} kSym/s</dd>
                  </div>
                </dl>
              </ReportSection>

              <ReportSection number={3} title="Visual Analysis">
                <p className="text-sm text-text-secondary">
                  Interactive spectrum, waterfall and constellation are available in the
                  analysis workspace and are reproducible on demand.
                </p>
              </ReportSection>

              <ReportSection number={4} title="AI Classification">
                <p className="text-sm text-text-secondary">
                  Detected modulation:{" "}
                  <span className="font-mono text-cyan-accent">
                    {report.classification.detectedModulation}
                  </span>{" "}
                  ({report.classification.confidence.toFixed(1)}% confidence).
                </p>
              </ReportSection>

              <ReportSection number={5} title="Candidate Pipelines">
                <ul className="space-y-1 font-mono text-xs text-text-secondary">
                  {report.pipelines.map((p) => (
                    <li key={p.id}>
                      #{p.rank} {p.stages} — {p.decoder} · {(p.score * 100).toFixed(0)}%
                    </li>
                  ))}
                </ul>
              </ReportSection>

              <ReportSection number={6} title="Selected Pipeline">
                <p className="font-mono text-sm text-text-primary">
                  {report.selectedPipeline.stages.join(" → ")}
                </p>
              </ReportSection>

              <ReportSection number={7} title="Evidence">
                <div className="max-w-sm space-y-2">
                  <ConfidenceBar label="Overall" value={report.selectedPipeline.overall ?? 0} />
                </div>
              </ReportSection>

              <ReportSection number={8} title="Bit Stream Analysis">
                <p className="text-sm text-text-secondary">
                  <span className="font-mono text-text-primary">{report.bitstream.bits} bits</span>{" "}
                  decoded ({report.bitstream.bytes} bytes); no semantic structure was asserted.
                </p>
              </ReportSection>

              <ReportSection number={9} title="Frame Structure">
                <ul className="space-y-1 text-sm text-text-secondary">
                  {report.frame.regions.map((r) => (
                    <li key={r.name}>
                      {r.name}: {r.length} bits @ offset {r.offset} ({r.confidence}% confidence)
                    </li>
                  ))}
                </ul>
              </ReportSection>

              <ReportSection number={10} title="Limitations">
                <ul className="space-y-1 text-sm text-warn">
                  {report.limitations.map((l) => (
                    <li key={l}>• {l}</li>
                  ))}
                </ul>
              </ReportSection>
            </div>
          </Panel>

          <Panel title="Selected Pipeline Evidence">
            <div className="max-w-sm space-y-3">
              <ConfidenceBar label="Overall" value={report.selectedPipeline.overall ?? 0} />
            </div>
          </Panel>
        </>
      ) : (
        <Panel title="SIGINT-X Analysis Report">
          <div className="space-y-3">
            <PanelSkeleton rows={4} />
            <PanelSkeleton rows={4} />
            <PanelSkeleton rows={4} />
          </div>
        </Panel>
      )}
    </div>
  );
}