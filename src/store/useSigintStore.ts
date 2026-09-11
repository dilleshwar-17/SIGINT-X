import { create } from "zustand";
import type {
  Analysis,
  AnalysisStatus,
  ApiStatus,
  BitStream,
  Frame,
  Hypothesis,
  ModulationPrediction,
  Pipeline,
  Signal,
  SignalParameters,
} from "@/types";

interface VisualizationSettings {
  chartDensity: "auto" | "low" | "medium" | "high";
  maxPoints: number;
  refreshRateMs: number;
}

interface SigintState {
  currentSignal: Signal | null;
  currentAnalysis: Analysis | null;
  analysisStatus: AnalysisStatus | null;
  signalParameters: SignalParameters | null;
  modulationPrediction: ModulationPrediction | null;
  hypotheses: Hypothesis[];
  pipelines: Pipeline[];
  selectedPipeline: Pipeline | null;
  bitStream: BitStream | null;
  frame: Frame | null;
  apiStatus: ApiStatus | null;
  visualizationSettings: VisualizationSettings;
  isDemoMode: boolean;

  setCurrentSignal: (signal: Signal | null) => void;
  setCurrentAnalysis: (analysis: Analysis | null) => void;
  setAnalysisStatus: (status: AnalysisStatus | null) => void;
  setSignalParameters: (params: SignalParameters | null) => void;
  setModulationPrediction: (pred: ModulationPrediction | null) => void;
  setHypotheses: (h: Hypothesis[]) => void;
  setPipelines: (p: Pipeline[]) => void;
  setSelectedPipeline: (p: Pipeline | null) => void;
  setBitStream: (b: BitStream | null) => void;
  setFrame: (f: Frame | null) => void;
  setApiStatus: (s: ApiStatus) => void;
  setVisualizationSettings: (s: Partial<VisualizationSettings>) => void;
  setDemoMode: (on: boolean) => void;
}

export const useSigintStore = create<SigintState>((set) => ({
  currentSignal: null,
  currentAnalysis: null,
  analysisStatus: null,
  signalParameters: null,
  modulationPrediction: null,
  hypotheses: [],
  pipelines: [],
  selectedPipeline: null,
  bitStream: null,
  frame: null,
  apiStatus: null,
  visualizationSettings: {
    chartDensity: "auto",
    maxPoints: 50000,
    refreshRateMs: 2000,
  },
  isDemoMode: false,

  setCurrentSignal: (signal) => set({ currentSignal: signal }),
  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
  setAnalysisStatus: (status) => set({ analysisStatus: status }),
  setSignalParameters: (params) => set({ signalParameters: params }),
  setModulationPrediction: (pred) => set({ modulationPrediction: pred }),
  setHypotheses: (hypotheses) => set({ hypotheses }),
  setPipelines: (pipelines) => set({ pipelines }),
  setSelectedPipeline: (selectedPipeline) => set({ selectedPipeline }),
  setBitStream: (bitStream) => set({ bitStream }),
  setFrame: (frame) => set({ frame }),
  setApiStatus: (apiStatus) => set({ apiStatus }),
  setVisualizationSettings: (settings) =>
    set((state) => ({
      visualizationSettings: { ...state.visualizationSettings, ...settings },
    })),
  setDemoMode: (isDemoMode) => set({ isDemoMode }),
}));