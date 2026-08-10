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
  | "maintenance"
  | "amber"
  | "emerald"
  | "slate";

interface BadgeProps {
  variant?: BadgeVariant;
  label?: string;
  children?: React.ReactNode;
  size?: "sm" | "md";
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  mediterranean: "bg-mediterranean-50/80 text-mediterranean-700 border border-mediterranean-200/80",
  violet: "bg-violet-50/80 text-violet-700 border border-violet-200/80",
  rose: "bg-rose-50/80 text-rose-700 border border-rose-200/80",
  neutral: "bg-slate-100/90 text-slate-700 border border-slate-200/80",
  success: "bg-emerald-50/80 text-emerald-700 border border-emerald-200/80",
  warning: "bg-amber-50/80 text-amber-700 border border-amber-200/80",
  amber: "bg-amber-50/80 text-amber-700 border border-amber-200/80",
  emerald: "bg-emerald-50/80 text-emerald-700 border border-emerald-200/80",
  slate: "bg-slate-100/90 text-slate-700 border border-slate-200/80",

  // Mappings statut
  confirmed: "bg-emerald-50/80 text-emerald-700 border border-emerald-200/80",
  pending: "bg-amber-50/80 text-amber-700 border border-amber-200/80",
  cancelled: "bg-rose-50/80 text-rose-700 border border-rose-200/80",
  available: "bg-emerald-50/80 text-emerald-700 border border-emerald-200/80",
  in_use: "bg-mediterranean-50/80 text-mediterranean-700 border border-mediterranean-200/80",
  maintenance: "bg-rose-50/80 text-rose-700 border border-rose-200/80",
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
        "inline-flex items-center font-extrabold rounded-full tracking-tight transition-colors backdrop-blur-sm",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs",
        variantStyles[variant],
        className
      )}
    >
      {content}
    </span>
  );
}
