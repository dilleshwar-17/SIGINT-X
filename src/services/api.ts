import axios from "axios";
import type {
  Analysis,
  AnalysisStatus,
  BitStream,
  ConstellationData,
  Frame,
  Pipeline,
  Signal,
  SignalParameters,
} from "@/types";
import { mockApi, mockHypotheses } from "./mockData";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";

export const USE_MOCKS = true;

const client = axios.create({ baseURL: API_BASE, timeout: 30000 });

export async function uploadSignal(file: File): Promise<Signal> {
  if (USE_MOCKS) return mockApi.getSignals().then((s) => s[0]);
  const form = new FormData();
  form.append("file", file);
  const { data } = await client.post<Signal>("/signals", form);
  return data;
}

export async function startAnalysis(config: {
  signalId: string;
  depth: Analysis["depth"];
  mode: Analysis["mode"];
}): Promise<Analysis> {
  if (USE_MOCKS) return mockApi.getAnalysis("ANL-0042");
  const { data } = await client.post<Analysis>("/analyses", config);
  return data;
}

export async function getAnalysis(id: string): Promise<Analysis> {
  if (USE_MOCKS) return mockApi.getAnalysis(id);
  const { data } = await client.get<Analysis>(`/analyses/${id}`);
  return data;
}

export async function getAnalysisStatus(id: string): Promise<AnalysisStatus> {
  if (USE_MOCKS) return mockApi.getAnalysisStatus();
  const { data } = await client.get<{ status: AnalysisStatus }>(`/analyses/${id}/status`);
  return data.status;
}

export async function getSignalFeatures(signalId: string): Promise<SignalParameters> {
  if (USE_MOCKS) return mockApi.getSignalFeatures();
  const { data } = await client.get<SignalParameters>(`/signals/${signalId}/features`);
  return data;
}

export async function getHypotheses(analysisId: string): Promise<unknown[]> {
  if (USE_MOCKS) return mockHypotheses;
  const { data } = await client.get<unknown[]>(`/analyses/${analysisId}/hypotheses`);
  return data;
}

export async function getPipelines(analysisId: string): Promise<Pipeline[]> {
  if (USE_MOCKS) return mockApi.getPipelines();
  const { data } = await client.get<Pipeline[]>(`/analyses/${analysisId}/pipelines`);
  return data;
}

export async function getPipelineDetails(
  analysisId: string,
  pipelineId: string,
): Promise<Pipeline> {
  if (USE_MOCKS) {
    const list = await mockApi.getPipelines();
    return list.find((p) => p.id === pipelineId) ?? list[0];
  }
  const { data } = await client.get<Pipeline>(
    `/analyses/${analysisId}/pipelines/${pipelineId}`,
  );
  return data;
}

export async function getReport(analysisId: string): Promise<unknown> {
  if (USE_MOCKS) return mockApi.getAnalysis(analysisId);
  const { data } = await client.get<unknown>(`/analyses/${analysisId}/report`);
  return data;
}

// Mock-backed convenience functions used frontend-only
export function getDashboardStats() {
  return mockApi.getDashboardStats();
}
export function getRecentAnalyses() {
  return mockApi.getRecentAnalyses();
}
export function getSignals() {
  return mockApi.getSignals();
}
export function getExperiments() {
  return mockApi.getExperiments();
}
export function getModels() {
  return mockApi.getModels();
}
export function getApiStatus() {
  return mockApi.getApiStatus();
}
export function getBitStream(): Promise<BitStream> {
  return mockApi.getBitStream();
}
export function getFrame(): Promise<Frame> {
  return mockApi.getFrame();
}
export function getConstellationData(): Promise<ConstellationData> {
  return mockApi.getConstellationData();
}
export function getAnalysisMock(id: string): Promise<Analysis> {
  return mockApi.getAnalysis(id);
}

export type { AnalysisStatus };