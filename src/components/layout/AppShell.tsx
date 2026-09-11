import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Activity, FileUp, FlaskConical, FolderOpen, LayoutDashboard } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

interface AppShellProps {
  children: ReactNode;
}

const MOBILE_NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/signals", label: "Signals", icon: FolderOpen },
  { to: "/analyze", label: "New", icon: FileUp },
  { to: "/analyze", label: "Active", icon: Activity },
  { to: "/experiments", label: "Experiments", icon: FlaskConical },
];

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-full min-h-screen flex-col bg-bg text-text-primary md:flex-row">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-5">{children}</div>
        <nav
          aria-label="Mobile navigation"
          className="flex shrink-0 items-center justify-around gap-1 border-t border-border bg-surface px-2 py-2 md:hidden"
        >
          {MOBILE_NAV.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  "flex flex-col items-center gap-0.5 rounded px-2 py-1 text-[10px]",
                  isActive ? "text-cyan-accent" : "text-text-muted",
                ].join(" ")
              }
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}