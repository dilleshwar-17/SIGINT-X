import { FileText, Download, FileJson, Copy } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { ConfidenceBar } from "@/components/analysis/ConfidenceBar";

const sections = [
  { n: 1, title: "Signal Information", content: ["Filename: unknown_001.iq", "Format: Complex IQ", "Size: 18.4 MB"] },
  { n: 2, title: "Signal Parameters", content: ["Sample Rate: 2.400 MHz", "Bandwidth: 180 kHz", "SNR: 14.8 dB", "Symbol Rate: 120 kSym/s"] },
  { n: 3, title: "Visual Analysis", content: ["Spectrum, waterfall and constellation attached in full workspace."] },
  { n: 4, title: "AI Classification", content: ["QPSK — 91.4% confidence", "Alternatives: 8PSK 5.8%, BPSK 2.1%, 16QAM 0.7%"] },
  { n: 5, title: "Candidate Pipelines", content: ["#1 QPSK → Conv. Deinterleave → Viterbi (0.94)", "#2 QPSK → Block → Viterbi (0.71)", "#3 8PSK → Block → RS (0.38)"] },
  { n: 6, title: "Selected Pipeline", content: ["QPSK → Convolutional Deinterleave → Viterbi"] },
  { n: 7, title: "Evidence", content: ["Modulation 91% · Synchronization 88% · Decoder validity 97% · Frame correlation 93% · Reconstruction 92%"] },
  { n: 8, title: "Bit Stream Analysis", content: ["Prevalence: 96 decoded bits, no decisive semantic structure."] },
  { n: 9, title: "Frame Structure", content: ["Preamble 32 bits · Header 64 bits · Payload 1024 bits"] },
  { n: 10, title: "Limitations", content: ["Symbol rate estimate has medium confidence.", "FEC identification is hypothesis-based.", "No semantic interpretation was performed."] },
];

export function ReportPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="Analysis Report"
        subtitle="Explainable summary of the autonomous analysis."
        actions={
          <>
            <Button variant="secondary" size="sm">
              <Download className="h-3.5 w-3.5" aria-hidden="true" /> Export PDF
            </Button>
            <Button variant="secondary" size="sm">
              <FileJson className="h-3.5 w-3.5" aria-hidden="true" /> Export JSON
            </Button>
            <Button variant="secondary" size="sm">
              <Copy className="h-3.5 w-3.5" aria-hidden="true" /> Copy Summary
            </Button>
          </>
        }
      />

      <Panel title="SIGINT-X Analysis Report" icon={<FileText className="h-3.5 w-3.5" aria-hidden="true" />}>
        <div className="space-y-6">
          {sections.map((s) => (
            <section key={s.n} aria-label={`Section ${s.n}: ${s.title}`}>
              <h3 className="mb-2 border-b border-border pb-1 font-mono text-xs font-semibold uppercase tracking-widest text-cyan-accent">
                {s.n}. {s.title}
              </h3>
              <ul className="space-y-1 text-sm text-text-secondary">
                {s.content.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Panel>

      <Panel title="Selected Pipeline Evidence">
        <div className="space-y-3">
          <ConfidenceBar label="Overall" value={94} />
          <ConfidenceBar label="Modulation" value={91} />
          <ConfidenceBar label="Decoder validity" value={97} />
        </div>
      </Panel>
    </div>
  );
}