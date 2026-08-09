/**
 * Configuration de navigation principale
 * Structure pensée pour une future bottom tab bar mobile
 */

import type { NavItemId } from "@/types";
import {
  Home,
  Calendar,
  Music,
  Package,
  User,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  id: NavItemId;
  label: string;
  href: string;
  icon: LucideIcon;
}

/** Items de la barre de navigation inférieure */
export const navItems: NavItem[] = [
  { id: "home", label: "Accueil", href: "/", icon: Home },
  { id: "agenda", label: "Agenda", href: "/agenda", icon: Calendar },
  { id: "prestations", label: "Prestations", href: "/prestations", icon: Music },
  { id: "materiel", label: "Matériel", href: "/materiel", icon: Package },
  { id: "equipe", label: "Équipe", href: "/equipe", icon: User },
];
