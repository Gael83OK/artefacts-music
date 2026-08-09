import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "mediterranean"
  | "violet"
  | "rose"
  | "neutral"
  | "success"
  | "warning"
  | "confirmed"
  | "pending"
  | "cancelled"
  | "available"
  | "in_use"
  | "maintenance";

interface BadgeProps {
  variant?: BadgeVariant;
  label?: string;
  children?: React.ReactNode;
  size?: "sm" | "md";
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  mediterranean: "bg-mediterranean-50 text-mediterranean-700 border border-mediterranean-200/60",
  violet: "bg-violet-50 text-violet-700 border border-violet-200/60",
  rose: "bg-rose-50 text-rose-700 border border-rose-200/60",
  neutral: "bg-slate-100 text-slate-700 border border-slate-200/60",
  success: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
  warning: "bg-amber-50 text-amber-700 border border-amber-200/60",

  // Legacy mappings
  confirmed: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
  pending: "bg-amber-50 text-amber-700 border border-amber-200/60",
  cancelled: "bg-rose-50 text-rose-700 border border-rose-200/60",
  available: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
  in_use: "bg-mediterranean-50 text-mediterranean-700 border border-mediterranean-200/60",
  maintenance: "bg-rose-50 text-rose-700 border border-rose-200/60",
};

const defaultLabels: Partial<Record<BadgeVariant, string>> = {
  confirmed: "Confirmé",
  pending: "En attente",
  cancelled: "Annulé",
  available: "Disponible",
  in_use: "En utilisation",
  maintenance: "Maintenance",
};

export function Badge({
  variant = "mediterranean",
  label,
  children,
  size = "md",
  className,
}: BadgeProps) {
  const content = children || label || defaultLabels[variant] || "";

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full tracking-tight transition-colors",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        variantStyles[variant],
        className
      )}
    >
      {content}
    </span>
  );
}

