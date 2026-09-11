export type AnalysisStatus =
  | "QUEUED"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export type SignalStatus =
  | "UPLOADED"
  | "ANALYZED"
  | "ANALYSIS_FAILED"
  | "READY"
  | "PROCESSING";

export type SignalFormat = "IQ" | "WAV" | "RAW";

export type ConfidenceLevel = "High" | "Medium" | "Low";

export type ModulationType =
  | "QPSK"
  | "8PSK"
  | "BPSK"
  | "16QAM"
  | "64QAM"
  | "FSK"
  | "ASK"
  | "OOK"
  | "GMSK"
  | "UNKNOWN";

export type AnalysisDepth = "Quick" | "Standard" | "Deep";
export type AnalysisMode = "automatic" | "manual";

export type SystemState = "OPERATIONAL" | "ANALYSIS_RUNNING" | "ANALYSIS_COMPLETE";

export interface Signal {
  id: string;
  filename: string;
  format: SignalFormat;
  sizeBytes: number;
  duration: number; // seconds
  sampleRate?: number;
  centerFrequency?: number;
  uploadedAt: string;
  status: SignalStatus;
  lastAnalysisId?: string;
  bestResult?: string;
}

export interface SignalParameters {
  sampleRate: number;
  sampleRateConfidence: ConfidenceLevel;
  sampleRateMethod?: string;
  bandwidth: number;
  bandwidthConfidence: ConfidenceLevel;
  bandwidthMethod?: string;
  snr: number;
  snrConfidence: ConfidenceLevel;
  snrMethod?: string;
  symbolRate: number;
  symbolRateConfidence: ConfidenceLevel;
  symbolRateMethod?: string;
  modulation: string;
  modulationConfidence: number;
}

export interface ModulationPrediction {
  detectedModulation: string;
  topConfidence: number;
  topLevel: ConfidenceLevel;
  alternatives: Array<{
    modulation: string;
    confidence: number;
  }>;
}

export interface EvidenceItem {
  id: string;
  label: string;
  status: "verified" | "partial" | "failed";
  details?: string;
  confidence?: number;
}

export interface Hypothesis {
  id: string;
  description: string;
  status: "pending" | "generating" | "complete" | "failed";
  candidates: number;
}

export interface PipelineStage {
  id: string;
  name: string;
  type:
    | "input"
    | "preprocess"
    | "sync"
    | "demod"
    | "deinterleave"
    | "decode"
    | "validate"
    | "output";
  status: "pending" | "running" | "success" | "failed" | "partial";
  reason?: string;
}

export interface Pipeline {
  id: string;
  stageNames: string[];
  score: number;
  rank: number;
  status: "BEST" | "CANDIDATE" | "FAILED";
  decoder: string;
  stages: PipelineStage[];
  evidence?: PipelineEvidence;
}

export interface PipelineEvidence {
  modulationConfidence: number;
  synchronization: number;
  decoderValidity: number;
  frameCorrelation: number;
  reconstruction: number;
  overall: number;
}

export interface BitStream {
  binary: string;
  bytes: Uint8Array;
  length: number;
}

export interface FrameRegion {
  id: string;
  name: string;
  bitOffset: number;
  bitLength: number;
  correlation: number;
  confidence: number;
  semantic?: string;
}

export interface Frame {
  totalBits: number;
  regions: FrameRegion[];
}

export interface Analysis {
  id: string;
  signalId: string;
  signalFilename: string;
  status: AnalysisStatus;
  modulationLabel?: string;
  bestPipelineLabel?: string;
  mode: AnalysisMode;
  depth: AnalysisDepth;
  startedAt: string;
  completedAt?: string;
  parameters?: SignalParameters;
  modulation?: ModulationPrediction;
  evidence?: EvidenceItem[];
  hypotheses?: Hypothesis[];
  pipelines?: Pipeline[];
  selectedPipelineId?: string;
  bitStream?: BitStream;
  frame?: Frame;
  bestScore?: number;
  timeTakenSeconds?: number;
}

export interface SpectrumData {
  frequencies: number[];
  magnitudes: number[];
  peakIndices: number[];
  bandwidth: number;
}

export interface WaterfallData {
  frequencies: number[];
  times: number[];
  intensities: number[][];
}

export interface ConstellationData {
  iSamples: number[];
  qSamples: number[];
  referencePoints?: Array<{ x: number; y: number; label: string }>;
}

export interface WaveformData {
  time: number[];
  i: number[];
  q: number[];
}

export interface Experiment {
  id: string;
  name: string;
  description: string;
  dataset: string;
  model: string;
  accuracy: number;
  f1: number;
  ber?: number;
  top1?: number;
  top3?: number;
  date: string;
  version: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  version: string;
  classes: number;
  validationAccuracy: number;
  dataset: string;
  status: "Production" | "Development" | "Deprecated";
}

export interface ApiStatus {
  reachable: boolean;
  backendVersion?: string;
  modelVersion?: string;
}