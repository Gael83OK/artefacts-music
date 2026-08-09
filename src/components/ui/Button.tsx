import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "mediterranean" | "violet" | "rose" | "outline" | "ghost" | "secondary";
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
      "bg-mediterranean-500 text-white hover:bg-mediterranean-600 active:bg-mediterranean-700 shadow-sm",
    violet:
      "bg-violet-500 text-white hover:bg-violet-600 active:bg-violet-700 shadow-sm",
    rose:
      "bg-rose-500 text-white hover:bg-rose-600 active:bg-rose-700 shadow-sm",
    secondary:
      "bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300",
    outline:
      "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100",
    ghost:
      "bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200",
  };

  const sizeClasses = {
    sm: "h-8 px-3 text-xs gap-1.5 rounded-lg font-medium",
    md: "h-10 px-4 text-sm gap-2 rounded-xl font-medium",
    lg: "h-12 px-6 text-base gap-2.5 rounded-2xl font-semibold",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mediterranean-500/40",
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
