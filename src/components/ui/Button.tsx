import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "mediterranean" | "violet" | "rose" | "outline" | "ghost" | "secondary" | "glass" | "white" | "gold";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export function Button({
  variant = "mediterranean",
  size = "md",
  icon,
  children,
  className,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const variantStyles: Record<string, React.CSSProperties> = {
    mediterranean: {
      background: "linear-gradient(135deg, #818CF8, #6D5DFA)",
      color: "#fff",
      boxShadow: "0 4px 20px rgba(122,90,248,0.35)",
    },
    violet: {
      background: "linear-gradient(135deg, #8B6DFA, #6D4EE8)",
      color: "#fff",
      boxShadow: "0 4px 20px rgba(139,109,250,0.4)",
    },
    rose: {
      background: "linear-gradient(135deg, #F06292, #C2185B)",
      color: "#fff",
      boxShadow: "0 4px 20px rgba(240,98,146,0.35)",
    },
    gold: {
      background: "linear-gradient(135deg, #FCD34D, #F59E0B)",
      color: "#1A1200",
      boxShadow: "0 4px 20px rgba(245,158,11,0.35)",
    },
    secondary: {
      background: "rgba(255,255,255,0.08)",
      color: "var(--text-secondary)",
      border: "1px solid rgba(255,255,255,0.1)",
    },
    outline: {
      background: "transparent",
      color: "var(--text-primary)",
      border: "1px solid rgba(255,255,255,0.12)",
    },
    ghost: {
      background: "transparent",
      color: "var(--text-secondary)",
    },
    glass: {
      background: "rgba(255,255,255,0.1)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.15)",
      color: "#fff",
    },
    white: {
      background: "rgba(255,255,255,0.95)",
      color: "#0E0C1A",
      boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
      fontWeight: 700,
    },
  };

  const sizeClasses = {
    sm: "h-8 min-h-[36px] px-3 text-xs gap-1.5 rounded-xl font-bold",
    md: "h-10 min-h-[44px] px-4 text-xs sm:text-sm gap-2 rounded-xl font-extrabold tracking-tight",
    lg: "h-12 min-h-[48px] px-6 text-sm sm:text-base gap-2.5 rounded-2xl font-black tracking-tight",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center transition-all duration-150 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none select-none",
        sizeClasses[size],
        className
      )}
      style={{ ...variantStyles[variant], ...style }}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
