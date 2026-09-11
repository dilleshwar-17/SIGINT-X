import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { AppRoutes } from "@/router";
import { getApiStatus } from "@/services/api";
import { useSigintStore } from "@/store/useSigintStore";

export default function App() {
  const location = useLocation();
  const setApiStatus = useSigintStore((s) => s.setApiStatus);

  useEffect(() => {
    getApiStatus().then(setApiStatus).catch(() => setApiStatus({ reachable: false }));
  }, [setApiStatus]);

  return (
    <AppShell>
      <main id="main-content" className="h-full" key={location.pathname}>
        <AppRoutes />
      </main>
    </AppShell>
  );
}