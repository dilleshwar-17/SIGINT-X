import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { DashboardPage } from "@/pages/DashboardPage";
import { SignalLibraryPage } from "@/pages/SignalLibraryPage";
import { NewAnalysisPage } from "@/pages/NewAnalysisPage";
import { ReportPage } from "@/pages/ReportPage";
import { ExperimentsPage } from "@/pages/ExperimentsPage";
import { ModelsPage } from "@/pages/ModelsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { PanelSkeleton } from "@/components/ui/Skeleton";

const AnalysisWorkspacePage = lazy(() =>
  import("@/pages/AnalysisWorkspacePage").then((m) => ({ default: m.AnalysisWorkspacePage })),
);
const PipelineExplorerPage = lazy(() =>
  import("@/pages/PipelineExplorerPage").then((m) => ({ default: m.PipelineExplorerPage })),
);

function ChartPageFallback() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-3">
        <PanelSkeleton rows={2} />
        <PanelSkeleton rows={2} />
        <PanelSkeleton rows={2} />
      </div>
      <div className="space-y-3">
        <PanelSkeleton rows={2} />
        <PanelSkeleton rows={2} />
        <PanelSkeleton rows={2} />
      </div>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/signals" element={<SignalLibraryPage />} />
      <Route path="/analyze" element={<NewAnalysisPage />} />
      <Route
        path="/analyze/:id"
        element={
          <Suspense fallback={<ChartPageFallback />}>
            <AnalysisWorkspacePage />
          </Suspense>
        }
      />
      <Route
        path="/analyze/:id/pipelines"
        element={
          <Suspense fallback={<ChartPageFallback />}>
            <PipelineExplorerPage />
          </Suspense>
        }
      />
      <Route path="/analyze/:id/report" element={<ReportPage />} />
      <Route path="/experiments" element={<ExperimentsPage />} />
      <Route path="/models" element={<ModelsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}