import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "text-[#04121a] font-semibold bg-gradient-to-br from-cyan-accent to-cyan-dim hover:from-white hover:to-cyan-accent hover:shadow-[0_10px_28px_-12px_rgba(34,211,238,0.85)] active:translate-y-px",
  secondary:
    "border border-border-light/80 bg-white/[0.03] text-text-primary hover:border-cyan-dim/60 hover:bg-cyan-accent/[0.08] hover:shadow-[0_8px_24px_-14px_rgba(34,211,238,0.6)] active:translate-y-px",
  ghost:
    "text-text-secondary hover:bg-white/[0.05] hover:text-text-primary active:translate-y-px",
  danger: "border border-err/40 bg-err/10 text-err hover:bg-err/20 hover:shadow-[0_8px_24px_-14px_rgba(248,113,113,0.7)]",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-2.5 py-1 text-[11px] gap-1.5",
  md: "px-3.5 py-1.5 text-[13px]",
  lg: "px-5 py-2.5 text-sm",
};

export function Button({
  variant = "secondary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-lg whitespace-nowrap transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 focus-ring ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
