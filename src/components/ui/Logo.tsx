/**
 * Logo Artefacts Music — placeholder temporaire
 *
 * @deprecated Utiliser BrandLogo (src/components/brand/BrandLogo.tsx)
 * une fois les écrans migrés vers le logo officiel.
 * Asset : public/brand/logo-artefacts-music.png
 */

interface LogoProps {
  /** Taille du logo : sm pour la nav, lg pour l'accueil */
  size?: "sm" | "md" | "lg";
  /** Afficher le texte à côté de l'icône */
  showText?: boolean;
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-14 w-14 text-xl",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className="flex items-center gap-3">
      {/* Icône stylisée — note de musique dans un cercle dégradé */}
      <div
        className={`${sizeClasses[size]} flex items-center justify-center rounded-2xl bg-gradient-to-br from-mediterranean via-violet to-rose shadow-card`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-1/2 w-1/2 text-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 18V5l12-2v13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="6" cy="18" r="3" fill="currentColor" />
          <circle cx="18" cy="16" r="3" fill="currentColor" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`${textSizeClasses[size]} font-semibold tracking-tight text-gray-900`}
          >
            Artefacts
          </span>
          <span className="text-xs font-medium text-mediterranean">Music</span>
        </div>
      )}
    </div>
  );
}
