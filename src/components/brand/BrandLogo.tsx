/**
 * Logo officiel Artefacts Music
 *
 * Composant prêt pour le header, l'accueil et l'identité visuelle.
 * Utilise next/image pour préserver qualité et proportions.
 *
 * @example
 * // Header compact
 * <BrandLogo size="sm" priority />
 *
 * @example
 * // Hero accueil
 * <BrandLogo size="lg" priority />
 */

import Image from "next/image";
import {
  BRAND_LOGO_PATH,
  BRAND_LOGO_ALT,
  BRAND_LOGO_DIMENSIONS,
  getBrandLogoDimensions,
  type BrandLogoSize,
} from "@/lib/brand";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  /** Taille prédéfinie — voir BRAND_LOGO_SIZES dans src/lib/brand.ts */
  size?: BrandLogoSize;
  /** Chargement prioritaire (above the fold) */
  priority?: boolean;
  /** Classes CSS additionnelles sur le conteneur */
  className?: string;
}

export function BrandLogo({
  size = "md",
  priority = false,
  className,
}: BrandLogoProps) {
  const { width, height } = getBrandLogoDimensions(size);

  return (
    <div
      className={cn("relative inline-flex shrink-0 items-center", className)}
      style={{ width, height }}
    >
      <Image
        src={BRAND_LOGO_PATH}
        alt={BRAND_LOGO_ALT}
        width={width}
        height={height}
        priority={priority}
        /* object-contain garantit le respect des proportions sans déformation */
        className="h-full w-full object-contain object-left"
        /* sizes aide Next.js à servir la bonne résolution */
        sizes={`(max-width: 768px) ${width}px, ${width}px`}
      />
    </div>
  );
}

/** Export des constantes utiles pour un usage direct (metadata, OG, etc.) */
export {
  BRAND_LOGO_PATH,
  BRAND_LOGO_ALT,
  BRAND_LOGO_DIMENSIONS,
  BRAND_LOGO_ASPECT_RATIO,
} from "@/lib/brand";
