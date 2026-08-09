import { ComponentType } from "react";

export type NavCategory = "operations" | "personal" | "management";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  category: NavCategory;
  badge?: string | number;
  badgeVariant?: "mediterranean" | "violet" | "rose" | "neutral";
  description?: string;
  isBottomTab?: boolean; // Featured in mobile bottom bar
}

