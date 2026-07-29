/**
 * Badge de statut — affiche l'état d'un événement ou d'un équipement
 */

import { cn } from "@/lib/utils";

type BadgeVariant = "confirmed" | "pending" | "cancelled" | "available" | "in_use" | "maintenance";

interface BadgeProps {
  variant: BadgeVariant;
  label: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  cancelled: "bg-red-100 text-red-600",
  available: "bg-green-100 text-green-700",
  in_use: "bg-mediterranean/10 text-mediterranean",
  maintenance: "bg-rose/10 text-rose",
};

const defaultLabels: Record<BadgeVariant, string> = {
  confirmed: "Confirmé",
  pending: "En attente",
  cancelled: "Annulé",
  available: "Disponible",
  in_use: "En utilisation",
  maintenance: "Maintenance",
};

export function Badge({ variant, label }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant]
      )}
    >
      {label || defaultLabels[variant]}
    </span>
  );
}
