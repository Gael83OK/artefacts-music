import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "mediterranean" | "violet" | "rose" | "outline" | "ghost" | "secondary" | "glass" | "white";
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
  ...props
}: ButtonProps) {
  const variantClasses = {
    mediterranean:
      "bg-gradient-to-r from-mediterranean-500 to-mediterranean-600 text-white hover:from-mediterranean-600 hover:to-mediterranean-700 active:from-mediterranean-700 active:to-mediterranean-800 shadow-sm shadow-mediterranean-500/25 hover:shadow-md hover:shadow-mediterranean-500/35",
    violet:
      "bg-gradient-to-r from-violet-500 to-violet-600 text-white hover:from-violet-600 hover:to-violet-700 active:from-violet-700 active:to-violet-800 shadow-sm shadow-violet-500/25 hover:shadow-md hover:shadow-violet-500/35",
    rose:
      "bg-gradient-to-r from-rose-500 to-rose-600 text-white hover:from-rose-600 hover:to-rose-700 active:from-rose-700 active:to-rose-800 shadow-sm shadow-rose-500/25 hover:shadow-md hover:shadow-rose-500/35",
    secondary:
      "bg-slate-100/90 text-slate-800 hover:bg-slate-200/90 active:bg-slate-300 backdrop-blur-sm",
    outline:
      "border border-slate-200/90 bg-white/90 text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 shadow-sm backdrop-blur-sm",
    ghost:
      "bg-transparent text-slate-700 hover:bg-slate-100/80 active:bg-slate-200/80",
    glass:
      "bg-white/20 backdrop-blur-xl border border-white/30 text-white hover:bg-white/30 active:bg-white/40 shadow-glass",
    white:
      "bg-white text-slate-900 hover:bg-slate-50 active:bg-slate-100 shadow-md shadow-slate-900/10 font-bold",
  };

  const sizeClasses = {
    sm: "h-8 min-h-[36px] px-3 text-xs gap-1.5 rounded-xl font-bold",
    md: "h-10 min-h-[44px] px-4 text-xs sm:text-sm gap-2 rounded-xl font-extrabold tracking-tight",
    lg: "h-12 min-h-[48px] px-6 text-sm sm:text-base gap-2.5 rounded-2xl font-black tracking-tight",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mediterranean-500/40 select-none",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
