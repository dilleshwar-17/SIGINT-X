import { NavLink, useLocation } from "react-router-dom";
import { useMemo } from "react";
import {
  Activity,
  FileUp,
  FolderOpen,
  LayoutDashboard,
  FlaskConical,
  Radio,
  Settings,
  Cpu,
} from "lucide-react";
import { useSigintStore } from "@/store/useSigintStore";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/signals", label: "Signal Library", icon: FolderOpen },
  { to: "/analyze", label: "New Analysis", icon: FileUp },
  { to: "/analyze/:id", label: "Active Analysis", icon: Activity, activePath: ["/analyze/"] },
  { to: "/experiments", label: "Experiments", icon: FlaskConical },
];

const SYSTEM_ITEMS = [
  { to: "/models", label: "Models", icon: Cpu },
  { to: "/settings", label: "Settings", icon: Settings },
];

function NavButton({
  to,
  label,
  icon: Icon,
  end,
  activePath,
}: {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
  activePath?: string[];
}) {
  const location = useLocation();
  const isActive = useMemo(() => {
    if (!activePath?.length) return location.pathname === to;
    return activePath.some((p) => location.pathname.startsWith(p));
  }, [to, activePath, location.pathname]);

  return (
    <NavLink
      to={to}
      end={end}
      className={() =>
        [
          "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
          isActive
            ? "bg-panel-hover text-cyan-accent"
            : "text-text-secondary hover:bg-panel-hover hover:text-text-primary",
        ].join(" ")
      }
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="truncate">{label}</span>
    </NavLink>
  );
}

export function Sidebar() {
  const isDemoMode = useSigintStore((s) => s.isDemoMode);

  return (
    <aside
      aria-label="Main navigation"
      className="hidden h-full w-56 shrink-0 flex-col border-r border-border bg-surface md:flex"
    >
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-4">
        <Radio className="h-5 w-5 text-cyan-accent" aria-hidden="true" />
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-wide">SIGINT-X</div>
          <div className="text-[10px] uppercase tracking-widest text-text-muted">
            Signal Analysis
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Pages">
        {NAV_ITEMS.map((item) => (
          <NavButton key={item.to} {...item} />
        ))}

        <div className="mx-1 my-3 border-t border-border-light pt-3 text-[10px] uppercase tracking-widest text-text-muted">
          System
        </div>
        {SYSTEM_ITEMS.map((item) => (
          <NavButton key={item.to} {...item} />
        ))}
      </nav>

      <div className="border-t border-border px-4 py-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-text-muted">v0.1.0</span>
          {isDemoMode ? (
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden="true" />
              Demo
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-ok">
              <span className="h-1.5 w-1.5 rounded-full bg-ok" aria-hidden="true" />
              Operational
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}