import type {
  Analysis,
  AnalysisStatus,
  ApiStatus,
  BitStream,
  ConstellationData,
  Experiment,
  Frame,
  ModelInfo,
  Pipeline,
  Signal,
  SignalParameters,
} from "@/types";

export const mockSignals: Signal[] = [
  {
    id: "SIG-001",
    filename: "signal_001.iq",
    format: "IQ",
    sizeBytes: 19293798,
    duration: 4.21,
    sampleRate: 2400000,
    centerFrequency: 900_000_000,
    uploadedAt: "2026-09-08T10:14:00Z",
    status: "ANALYZED",
    lastAnalysisId: "ANL-0042",
    bestResult: "QPSK",
  },
  {
    id: "SIG-002",
    filename: "telemetry_014.wav",
    format: "WAV",
    sizeBytes: 4832911,
    duration: 6.8,
    sampleRate: 48000,
    uploadedAt: "2026-09-07T14:32:00Z",
    status: "ANALYZED",
    lastAnalysisId: "ANL-0039",
    bestResult: "BPSK",
  },
  {
    id: "SIG-003",
    filename: "unknown_001.iq",
    format: "IQ",
    sizeBytes: 10255626,
    duration: 3.1,
    sampleRate: 1600000,
    uploadedAt: "2026-09-06T09:05:00Z",
    status: "ANALYZED",
    lastAnalysisId: "ANL-0037",
    bestResult: "8PSK",
  },
  {
    id: "SIG-004",
    filename: "burst_003.iq",
    format: "IQ",
    sizeBytes: 5112880,
    duration: 1.2,
    sampleRate: 800000,
    uploadedAt: "2026-09-05T16:41:00Z",
    status: "ANALYZED",
    lastAnalysisId: "ANL-0035",
    bestResult: "16QAM",
  },
  {
    id: "SIG-005",
    filename: "hf_beacon_008.wav",
    format: "WAV",
    sizeBytes: 312057,
    duration: 22.4,
    sampleRate: 44100,
    uploadedAt: "2026-09-04T11:20:00Z",
    status: "ANALYSIS_FAILED",
    lastAnalysisId: "ANL-0030",
  },
  {
    id: "SIG-006",
    filename: "sat_telemetry_092.iq",
    format: "IQ",
    sizeBytes: 20447234,
    duration: 5.62,
    sampleRate: 3200000,
    uploadedAt: "2026-09-03T08:52:00Z",
    status: "ANALYZED",
    lastAnalysisId: "ANL-0028",
    bestResult: "QPSK",
  },
];

export const mockParameters: SignalParameters = {
  sampleRate: 2400000,
  sampleRateConfidence: "High",
  sampleRateMethod: "Spectral zero-crossing analysis",
  bandwidth: 180000,
  bandwidthConfidence: "Medium",
  bandwidthMethod: "Occupied bandwidth 99% threshold",
  snr: 14.8,
  snrConfidence: "High",
  snrMethod: "M2M4 estimator",
  symbolRate: 120000,
  symbolRateConfidence: "Medium",
  symbolRateMethod: "Cyclostationary feature detection",
  modulation: "QPSK",
  modulationConfidence: 91.4,
};

export const mockAnalyses: Analysis[] = [
  {
    id: "ANL-0042",
    signalId: "SIG-001",
    signalFilename: "signal_001.iq",
    status: "COMPLETED",
    mode: "automatic",
    depth: "Standard",
    modulationLabel: "QPSK",
    bestPipelineLabel: "QPSK → Viterbi",
    startedAt: "2026-09-08T10:20:00Z",
    completedAt: "2026-09-08T10:20:12Z",
    bestScore: 0.94,
    timeTakenSeconds: 12.4,
  },
  {
    id: "ANL-0039",
    signalId: "SIG-002",
    signalFilename: "telemetry_014.wav",
    status: "COMPLETED",
    mode: "automatic",
    depth: "Quick",
    modulationLabel: "BPSK",
    bestPipelineLabel: "BPSK → Viterbi",
    startedAt: "2026-09-07T14:35:00Z",
    completedAt: "2026-09-07T14:35:06Z",
    bestScore: 0.88,
    timeTakenSeconds: 5.9,
  },
  {
    id: "ANL-0037",
    signalId: "SIG-003",
    signalFilename: "unknown_001.iq",
    status: "COMPLETED",
    mode: "manual",
    depth: "Deep",
    modulationLabel: "8PSK",
    bestPipelineLabel: "8PSK → Reed-Solomon",
    startedAt: "2026-09-06T09:10:00Z",
    completedAt: "2026-09-06T09:10:41Z",
    bestScore: 0.71,
    timeTakenSeconds: 34.2,
  },
  {
    id: "ANL-0035",
    signalId: "SIG-004",
    signalFilename: "burst_003.iq",
    status: "COMPLETED",
    mode: "automatic",
    depth: "Standard",
    modulationLabel: "16QAM",
    bestPipelineLabel: "16QAM → Block → Viterbi",
    startedAt: "2026-09-05T16:45:00Z",
    completedAt: "2026-09-05T16:45:09Z",
    bestScore: 0.83,
    timeTakenSeconds: 8.1,
  },
  {
    id: "ANL-0030",
    signalId: "SIG-005",
    signalFilename: "hf_beacon_008.wav",
    status: "FAILED",
    mode: "automatic",
    depth: "Standard",
    startedAt: "2026-09-04T11:25:00Z",
    completedAt: "2026-09-04T11:25:11Z",
    timeTakenSeconds: 11.2,
  },
  {
    id: "ANL-0028",
    signalId: "SIG-006",
    signalFilename: "sat_telemetry_092.iq",
    status: "COMPLETED",
    mode: "automatic",
    depth: "Deep",
    modulationLabel: "QPSK",
    bestPipelineLabel: "QPSK → Conv. Deinterleave → Viterbi",
    startedAt: "2026-09-03T08:58:00Z",
    completedAt: "2026-09-03T08:59:02Z",
    bestScore: 0.96,
    timeTakenSeconds: 62.0,
  },
];

export const mockPipeline = (): Pipeline => ({
  id: "PLN-001",
  stageNames: ["IQ", "Synchronize", "QPSK", "Convolutional Deinterleave", "Viterbi", "Bit Stream"],
  score: 0.94,
  rank: 1,
  status: "BEST",
  decoder: "Viterbi",
  stages: [
    {
      id: "st-1",
      name: "IQ Input",
      type: "input",
      status: "success",
    },
    {
      id: "st-2",
      name: "Synchronize",
      type: "sync",
      status: "success",
    },
    {
      id: "st-3",
      name: "QPSK Demodulation",
      type: "demod",
      status: "success",
    },
    {
      id: "st-4",
      name: "Convolutional Deinterleave",
      type: "deinterleave",
      status: "success",
    },
    {
      id: "st-5",
      name: "Viterbi",
      type: "decode",
      status: "success",
    },
    {
      id: "st-6",
      name: "Bit Stream",
      type: "output",
      status: "success",
    },
  ],
  evidence: {
    modulationConfidence: 91,
    synchronization: 88,
    decoderValidity: 97,
    frameCorrelation: 93,
    reconstruction: 92,
    overall: 94,
  },
});

export const mockBitStream: BitStream = {
  binary: "0001011010110101011001011010010110100110100101101011010010110",
  bytes: new Uint8Array([
    0x1a, 0xea, 0xd2, 0x95, 0x96, 0x96, 0xb4, 0xb0, 0x5a, 0x6b, 0x5a, 0x5a,
  ]),
  length: 96,
};

export const mockFrame: Frame = {
  totalBits: 1120,
  regions: [
    {
      id: "r1",
      name: "Preamble",
      bitOffset: 0,
      bitLength: 32,
      correlation: 0.97,
      confidence: 98,
      semantic: "Synchronization preamble",
    },
    {
      id: "r2",
      name: "Header",
      bitOffset: 32,
      bitLength: 64,
      correlation: 0.94,
      confidence: 93,
    },
    {
      id: "r3",
      name: "Payload",
      bitOffset: 96,
      bitLength: 1024,
      correlation: 0.92,
      confidence: 91,
    },
  ],
};

export const mockConstellation: ConstellationData = {
  iSamples: [
    0.95, 0.9, 1.02, 0.88, 0.92, 1.05, 0.86, 0.98, -0.9, -0.95, -1.02, -0.87,
    0.91, -0.89, 0.96, -0.93, 1.01, 0.85, 0.9, 0.88, -0.94, -0.92, -1.04, 0.87,
    -0.9, 0.93, -0.95, 0.89, 1.04, 0.86, -0.91, 0.99, 0.87, -0.88, 0.95, -1.0,
    -0.86, 0.92, -0.97, 0.9, 1.03, -0.93, 0.88, -0.9, 0.94, -1.02, -0.84, 0.91,
  ],
  qSamples: [
    0.92, 0.88, 1.0, 0.85, 0.94, 0.91, 0.9, 0.96, 0.9, 0.86, 0.95, 0.88, -0.92,
    -0.89, -0.94, -0.91, -0.9, -0.87, -0.95, -0.88, 0.93, -0.9, 0.89, -0.92,
    0.95, 0.87, 0.9, 0.93, -0.88, -0.94, 0.9, -0.89, -0.92, 0.91, -0.86, 0.94,
    -0.9, 0.88, -0.93, 0.9, -0.87, 0.92, -0.95, 0.89, 0.91, -0.88, -0.94, 0.93,
  ],
  referencePoints: [
    { x: 1, y: 1, label: "QPSK+45°" },
    { x: -1, y: 1, label: "QPSK+135°" },
    { x: -1, y: -1, label: "QPSK-135°" },
    { x: 1, y: -1, label: "QPSK-45°" },
  ],
};

export const mockExperiments: Experiment[] = [
  {
    id: "EXP-01",
    name: "Modulation Classification",
    description: "CNN-based classification across 7 modulation types",
    dataset: "Synthetic RF Dataset v2",
    model: "M2Net-v0.3",
    accuracy: 0.947,
    f1: 0.941,
    top1: 0.947,
    top3: 0.986,
    date: "2026-08-20",
    version: "v0.3.1",
  },
  {
    id: "EXP-02",
    name: "SNR Robustness",
    description: "Performance degrader sweep from +20 to -5 dB",
    dataset: "AWGN Sweep v1",
    model: "M2Net-v0.3",
    accuracy: 0.812,
    f1: 0.798,
    date: "2026-08-18",
    version: "v0.3.1",
  },
  {
    id: "EXP-03",
    name: "Symbol Rate Estimation",
    description: "Cyclostationary estimator error vs. observation window",
    dataset: "Symbol Rate Bench v1",
    model: "CSD-Estimator",
    accuracy: 0.968,
    f1: 0.965,
    ber: 0.012,
    date: "2026-08-15",
    version: "v0.2.0",
  },
  {
    id: "EXP-04",
    name: "Pipeline Discovery",
    description: "End-to-end decoding pipeline candidate generation",
    dataset: "Pipeline Discovery Bench v1",
    model: "HypothesisEngine-v0.1",
    accuracy: 0.886,
    f1: 0.874,
    date: "2026-08-10",
    version: "v0.1.0",
  },
  {
    id: "EXP-05",
    name: "FEC Detection",
    description: "Forward error correction family identification",
    dataset: "FEC Bench v1",
    model: "FECDetect-v0.2",
    accuracy: 0.921,
    f1: 0.914,
    date: "2026-08-05",
    version: "v0.2.0",
  },
];

export const mockModels: ModelInfo[] = [
  {
    id: "MDL-001",
    name: "Modulation Classifier",
    version: "v0.3.1",
    classes: 7,
    validationAccuracy: 0.947,
    dataset: "Synthetic RF Dataset",
    status: "Production",
  },
  {
    id: "MDL-002",
    name: "Symbol Rate Estimator",
    version: "v0.2.0",
    classes: 0,
    validationAccuracy: 0.968,
    dataset: "Symbol Rate Bench",
    status: "Production",
  },
  {
    id: "MDL-003",
    name: "FEC Detector",
    version: "v0.2.0",
    classes: 5,
    validationAccuracy: 0.921,
    dataset: "FEC Bench",
    status: "Development",
  },
];

export const apiStatus: ApiStatus = {
  reachable: false,
  backendVersion: "unavailable",
  modelVersion: "v0.3.1 (mock)",
};

const latency = (ms?: number) =>
  new Promise((resolve) => setTimeout(resolve, ms ?? 250 + Math.random() * 500));

export const mockApi = {
  async uploadSignal(): Promise<Signal> {
    await latency();
    return mockSignals[0];
  },
  async getDashboardStats(): Promise<{
    totalSignals: number;
    completedAnalyses: number;
    successfulPipelines: number;
    averageAnalysisTimeSeconds: number;
  }> {
    await latency();
    return {
      totalSignals: 124,
      completedAnalyses: 108,
      successfulPipelines: 93,
      averageAnalysisTimeSeconds: 14.2,
    };
  },
  async getRecentAnalyses(): Promise<Analysis[]> {
    await latency();
    return mockAnalyses;
  },
  async getSignals(): Promise<Signal[]> {
    await latency();
    return mockSignals;
  },
  async getAnalysis(id: string): Promise<Analysis> {
    await latency(500);
    const found = mockAnalyses.find((a) => a.id === id);
    return (
      found ?? {
        id,
        signalId: "SIG-001",
        signalFilename: "unknown_001.iq",
        status: "COMPLETED",
        mode: "automatic",
        depth: "Standard",
        startedAt: new Date().toISOString(),
        bestScore: 0.94,
        timeTakenSeconds: 12.4,
      }
    );
  },
  async getAnalysisStatus(): Promise<AnalysisStatus> {
    await latency(150);
    return "COMPLETED";
  },
  async getSignalFeatures(): Promise<SignalParameters> {
    await latency();
    return mockParameters;
  },
  async getConstellationData(): Promise<ConstellationData> {
    await latency();
    return mockConstellation;
  },
  async getPipelines(): Promise<Pipeline[]> {
    await latency();
    return [
      mockPipeline(),
      {
        id: "PLN-002",
        stageNames: ["IQ", "Synchronize", "QPSK", "Block Deinterleave", "Viterbi", "Bit Stream"],
        score: 0.71,
        rank: 2,
        status: "CANDIDATE",
        decoder: "Viterbi",
        stages: [],
      },
      {
        id: "PLN-003",
        stageNames: ["IQ", "Synchronize", "8PSK", "Block Deinterleave", "Reed-Solomon", "Bit Stream"],
        score: 0.38,
        rank: 3,
        status: "FAILED",
        decoder: "Reed-Solomon",
        stages: [],
      },
    ];
  },
  async getExperiments(): Promise<Experiment[]> {
    await latency();
    return mockExperiments;
  },
  async getModels(): Promise<ModelInfo[]> {
    await latency();
    return mockModels;
  },
  async getApiStatus(): Promise<ApiStatus> {
    await latency(100);
    return apiStatus;
  },
  async getBitStream(): Promise<BitStream> {
    await latency();
    return mockBitStream;
  },
  async getFrame(): Promise<Frame> {
    await latency();
    return mockFrame;
  },
};