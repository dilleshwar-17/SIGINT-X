import type { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Activity, FileUp, FlaskConical, FolderOpen, LayoutDashboard } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

interface AppShellProps {
  children: ReactNode;
}

const MOBILE_NAV = [
  { key: "dashboard", to: "/", label: "Dashboard", icon: LayoutDashboard },
  { key: "signals", to: "/signals", label: "Signals", icon: FolderOpen },
  { key: "new", to: "/analyze", label: "New", icon: FileUp },
  { key: "active", to: "/analyze", label: "Active", icon: Activity },
  { key: "experiments", to: "/experiments", label: "Experiments", icon: FlaskConical },
];

export function AppShell({ children }: AppShellProps) {
  const { pathname } = useLocation();
  const hasAnalysisId = pathname.startsWith("/analyze/");

  const isMobileItemActive = (key: string) => {
    if (key === "dashboard") return pathname === "/";
    if (key === "signals") return pathname.startsWith("/signals");
    if (key === "experiments") return pathname.startsWith("/experiments");
    if (key === "new") return pathname === "/analyze";
    if (key === "active") return hasAnalysisId;
    return false;
  };

  return (
    <div className="relative flex h-full min-h-screen flex-col md:flex-row">
      <div className="atmosphere" aria-hidden="true" />

      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />

        <div className="relative flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1600px] px-4 py-5 md:px-7 md:py-7">
            {children}
          </div>
        </div>

        <nav
          aria-label="Mobile navigation"
          className="app-chrome sticky bottom-0 z-20 flex shrink-0 items-center justify-around gap-1 border-t border-border bg-surface/85 px-2 py-1.5 backdrop-blur-xl md:hidden"
        >
          {MOBILE_NAV.map((item) => {
            const active = isMobileItemActive(item.key);
            return (
              <NavLink
                key={item.key}
                to={item.to}
                className={[
                  "flex flex-1 flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] transition-all duration-200",
                  active
                    ? "bg-cyan-accent/10 text-cyan-accent shadow-[inset_0_0_0_1px_rgba(34,211,238,0.22)]"
                    : "text-text-muted hover:bg-white/[0.04] hover:text-text-secondary",
                ].join(" ")}
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
