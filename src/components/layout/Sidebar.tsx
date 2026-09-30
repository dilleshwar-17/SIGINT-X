import type { LucideIcon } from "lucide-react";
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
  Plus,
  Waves,
} from "lucide-react";
import { useSigintStore } from "@/store/useSigintStore";

interface NavEntry {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
  activePath?: string[];
}

const NAV_ITEMS: NavEntry[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/signals", label: "Signal Library", icon: FolderOpen },
  { to: "/analyze/:id", label: "Active Analysis", icon: Activity, activePath: ["/analyze/"] },
  { to: "/experiments", label: "Experiments", icon: FlaskConical },
];

const SYSTEM_ITEMS: NavEntry[] = [
  { to: "/models", label: "Models", icon: Cpu },
  { to: "/settings", label: "Settings", icon: Settings },
];

function NavButton({ to, label, icon: Icon, end, activePath }: NavEntry) {
  const location = useLocation();
  const isActive = useMemo(() => {
    if (!activePath?.length) return location.pathname === to;
    return activePath.some((p) => location.pathname.startsWith(p));
  }, [to, activePath, location.pathname]);

  return (
    <NavLink
      to={to}
      end={end}
      className={[
        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition-all duration-200",
        isActive
          ? "bg-gradient-to-r from-cyan-accent/[0.14] to-transparent text-cyan-accent shadow-[inset_0_0_0_1px_rgba(34,211,238,0.16)]"
          : "text-text-secondary hover:bg-white/[0.04] hover:text-text-primary",
      ].join(" ")}
    >
      {isActive && (
        <span
          className="absolute left-0 top-1/2 h-5 w-[2.5px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-cyan-accent to-cyan-dim shadow-[0_0_10px_rgba(34,211,238,0.9)]"
          aria-hidden="true"
        />
      )}
      <Icon
        className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
          isActive ? "text-cyan-accent" : "text-text-muted group-hover:text-cyan-accent/80"
        }`}
        aria-hidden="true"
      />
      <span className="truncate">{label}</span>
    </NavLink>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="mb-1.5 mt-4 px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-text-muted/70 first:mt-0">
      {children}
    </div>
  );
}

export function Sidebar() {
  const isDemoMode = useSigintStore((s) => s.isDemoMode);

  return (
    <aside
      aria-label="Main navigation"
      className="app-chrome hidden h-full w-[248px] shrink-0 flex-col border-r border-border/80 bg-surface/70 backdrop-blur-xl md:flex"
    >
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-border/70 px-5 py-4">
        <span
          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-accent to-violet-dim text-[#04121a] shadow-[0_10px_26px_-10px_rgba(34,211,238,0.85)]"
          aria-hidden="true"
        >
          <Radio className="h-[18px] w-[18px]" />
          <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/30" />
        </span>
        <div className="leading-tight">
          <div className="text-[15px] font-semibold tracking-wide text-text-primary">SIGINT-X</div>
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-text-muted">
            Signal Intelligence
          </div>
        </div>
      </div>

      {/* Primary CTA */}
      <div className="px-4 pt-4">
        <NavLink
          to="/analyze"
          className="group flex items-center justify-center gap-2 rounded-lg border border-cyan-accent/30 bg-gradient-to-br from-cyan-accent/20 to-violet-dim/20 px-3 py-2.5 text-[13px] font-semibold text-text-primary transition-all duration-200 hover:border-cyan-accent/60 hover:from-cyan-accent/30 hover:to-violet-dim/30 hover:shadow-[0_12px_30px_-14px_rgba(34,211,238,0.9)] focus-ring"
        >
          <Plus className="h-4 w-4 text-cyan-accent transition-transform duration-200 group-hover:rotate-90" aria-hidden="true" />
          New Analysis
        </NavLink>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-4" aria-label="Pages">
        {NAV_ITEMS.map((item) => (
          <NavButton key={item.to} {...item} />
        ))}

        <SectionLabel>System</SectionLabel>
        {SYSTEM_ITEMS.map((item) => (
          <NavButton key={item.to} {...item} />
        ))}
      </nav>

      {/* Footer status */}
      <div className="border-t border-border/70 px-4 py-3.5">
        <div
          className="mb-3 flex items-center gap-2.5 rounded-lg border border-border/70 bg-white/[0.02] px-3 py-2"
          role="status"
        >
          <Waves
            className={`h-3.5 w-3.5 shrink-0 ${
              isDemoMode ? "text-warn" : "text-ok"
            }`}
            aria-hidden="true"
          />
          <div className="min-w-0 leading-tight">
            <div className="truncate text-[11px] font-medium text-text-primary">
              {isDemoMode ? "Standby" : "Operational"}
            </div>
            <div className="truncate font-mono text-[9px] text-text-muted">
              {isDemoMode ? "backend offline" : "backend connected"}
            </div>
          </div>
          <span
            className={`ml-auto h-1.5 w-1.5 shrink-0 rounded-full ${
              isDemoMode ? "bg-warn" : "bg-ok"
            }`}
            style={{ animation: "blink 2.4s ease-in-out infinite" }}
            aria-hidden="true"
          />
        </div>
        <div className="flex items-center justify-between font-mono text-[10px] text-text-muted">
          <span>v0.1.0</span>
          <span className="flex items-center gap-1.5">
            <FileUp className="h-3 w-3" aria-hidden="true" />
            build dev
          </span>
        </div>
      </div>
    </aside>
  );
}
