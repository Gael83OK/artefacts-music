/**
 * Utilitaires partagés
 */

import type { EventType } from "@/types";

/** Labels français pour les types d'événements */
export const eventTypeLabels: Record<EventType, string> = {
  prestation: "Prestation",
  repetition: "Répétition",
  production: "Production",
  logistique: "Logistique",
};

/** Couleurs Tailwind associées aux types d'événements */
export const eventTypeColors: Record<EventType, string> = {
  prestation: "bg-mediterranean/10 text-mediterranean",
  repetition: "bg-violet/10 text-violet",
  production: "bg-rose/10 text-rose",
  logistique: "bg-light-blue/20 text-mediterranean",
};

/** Formate une date ISO en format lisible (ex: "15 août 2026") */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Formate une date courte (ex: "15 août") */
export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

/** Classe CSS pour fusionner des classes conditionnelles */
export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
