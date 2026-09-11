import type {
  Analysis,
  BitStream,
  Frame,
  Pipeline,
  SignalParameters,
} from "@/types";

export interface AnalysisReport {
  reportId: string;
  analysisId: string;
  generatedAt: string;
  signal: {
    filename: string;
    format: string;
    sampleRate: number | null;
    centerFrequency: number | null;
  };
  parameters: {
    sampleRate: number | null;
    bandwidth: number | null;
    snr: number | null;
    symbolRate: number | null;
    modulation: string | null;
    modulationConfidence: number | null;
  };
  classification: {
    detectedModulation: string;
    confidence: number;
    alternatives: Array<{ modulation: string; confidence: number }>;
  };
  pipelines: Array<{
    id: string;
    rank: number;
    stages: string;
    score: number;
    status: string;
    decoder: string;
  }>;
  selectedPipeline: {
    id: string;
    stages: string[];
    overall: number | null;
  };
  bitstream: {
    bits: number;
    bytes: number;
    preview: string;
  };
  frame: {
    totalBits: number;
    regions: Array<{ name: string; offset: number; length: number; confidence: number }>;
  };
  limitations: string[];
}

export function buildReport(args: {
  analysis: Analysis;
  parameters: SignalParameters | null;
  pipelines: Pipeline[];
  bitStream: BitStream;
  frame: Frame;
}): AnalysisReport {
  const { analysis, parameters, pipelines, bitStream, frame } = args;
  const best = pipelines.find((p) => p.status === "BEST") ?? pipelines[0];

  return {
    reportId: `RPT-${analysis.id}`,
    analysisId: analysis.id,
    generatedAt: new Date().toISOString(),
    signal: {
      filename: analysis.signalFilename,
      format: analysis.signalFilename.split(".").pop()?.toUpperCase() ?? "IQ",
      sampleRate: parameters?.sampleRate ?? null,
      centerFrequency: null,
    },
    parameters: {
      sampleRate: parameters?.sampleRate ?? null,
      bandwidth: parameters?.bandwidth ?? null,
      snr: parameters?.snr ?? null,
      symbolRate: parameters?.symbolRate ?? null,
      modulation: parameters?.modulation ?? null,
      modulationConfidence: parameters?.modulationConfidence ?? null,
    },
    classification: {
      detectedModulation: parameters?.modulation ?? "UNKNOWN",
      confidence: parameters?.modulationConfidence ?? 0,
      alternatives: [],
    },
    pipelines: pipelines.map((p) => ({
      id: p.id,
      rank: p.rank,
      stages: p.stageNames.join(" + "),
      score: p.score,
      status: p.status,
      decoder: p.decoder,
    })),
    selectedPipeline: {
      id: best?.id ?? "",
      stages: best?.stageNames ?? [],
      overall: best?.evidence?.overall ?? null,
    },
    bitstream: {
      bits: bitStream.length,
      bytes: bitStream.bytes.length,
      preview: bitStream.binary.slice(0, 64),
    },
    frame: {
      totalBits: frame.totalBits,
      regions: frame.regions.map((r) => ({
        name: r.name,
        offset: r.bitOffset,
        length: r.bitLength,
        confidence: r.confidence,
      })),
    },
    limitations: [
      "Symbol rate estimate has medium confidence.",
      "FEC identification is hypothesis-based.",
      "No semantic interpretation was performed.",
    ],
  };
}

export function reportSummary(report: AnalysisReport): string {
  const best = report.selectedPipeline;
  return [
    `SIGINT-X ANALYSIS REPORT`,
    `Analysis: ${report.analysisId}`,
    `Signal: ${report.signal.filename}`,
    ``,
    `Detected modulation: ${report.classification.detectedModulation} (${report.classification.confidence.toFixed(1)}%)`,
    `Sample rate: ${report.parameters.sampleRate ?? "unknown"} Hz`,
    `Bandwidth: ${report.parameters.bandwidth ?? "unknown"} Hz`,
    `SNR: ${report.parameters.snr ?? "unknown"} dB`,
    `Symbol rate: ${report.parameters.symbolRate ?? "unknown"} sym/s`,
    ``,
    `Best pipeline: ${best.stages.join(" → ")}`,
    `Overall evidence: ${best.overall ?? "n/a"}%`,
    ``,
    `Limitations: ${report.limitations.join(" ")}`,
  ].join("\n");
}