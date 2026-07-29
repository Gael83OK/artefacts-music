/**
 * Carte générique — base pour toutes les cartes de l'application
 * Style Apple : coins arrondis, ombre légère, fond blanc
 */

import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  /** Rend la carte cliquable avec effet hover */
  interactive?: boolean;
}

export function Card({ children, className, interactive = false }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-white p-6 shadow-card",
        interactive && "transition-shadow duration-200 hover:shadow-card-hover cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

/** En-tête de carte avec titre et action optionnelle */
interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="mb-4 flex items-start justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {subtitle && (
          <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
