import { Route, Routes } from "react-router-dom";
import { DashboardPage } from "@/pages/DashboardPage";
import { SignalLibraryPage } from "@/pages/SignalLibraryPage";
import { NewAnalysisPage } from "@/pages/NewAnalysisPage";
import { AnalysisWorkspacePage } from "@/pages/AnalysisWorkspacePage";
import { PipelineExplorerPage } from "@/pages/PipelineExplorerPage";
import { ReportPage } from "@/pages/ReportPage";
import { ExperimentsPage } from "@/pages/ExperimentsPage";
import { ModelsPage } from "@/pages/ModelsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/signals" element={<SignalLibraryPage />} />
      <Route path="/analyze" element={<NewAnalysisPage />} />
      <Route path="/analyze/:id" element={<AnalysisWorkspacePage />} />
      <Route path="/analyze/:id/pipelines" element={<PipelineExplorerPage />} />
      <Route path="/analyze/:id/report" element={<ReportPage />} />
      <Route path="/experiments" element={<ExperimentsPage />} />
      <Route path="/models" element={<ModelsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}