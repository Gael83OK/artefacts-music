/**
 * Configuration de la marque Artefacts Music
 * Référence centralisée pour le logo et les assets visuels
 */

/** Chemin public du logo officiel (dossier public/brand/) */
export const BRAND_LOGO_PATH = "/brand/logo-artefacts-music.jpg" as const;

/** Dimensions natives du fichier source — à respecter pour conserver les proportions */
export const BRAND_LOGO_DIMENSIONS = {
  width: 1024,
  height: 777,
} as const;

/** Ratio largeur / hauteur du logo (≈ 1.32) */
export const BRAND_LOGO_ASPECT_RATIO =
  BRAND_LOGO_DIMENSIONS.width / BRAND_LOGO_DIMENSIONS.height;

/** Texte alternatif pour l'accessibilité */
export const BRAND_LOGO_ALT = "Artefacts Music — logo officiel";

/** Nom de la marque */
export const BRAND_NAME = "Artefacts Music";

/**
 * Tailles prédéfinies pour le logo
 * Les hauteurs sont indicatives ; la largeur est calculée via le ratio natif
 */
export const BRAND_LOGO_SIZES = {
  /** Header, navigation compacte */
  sm: { height: 32 },
  /** Accueil, cartes */
  md: { height: 48 },
  /** Hero, écran d'accueil */
  lg: { height: 72 },
  /** Pleine largeur identité visuelle */
  xl: { height: 120 },
} as const;

export type BrandLogoSize = keyof typeof BRAND_LOGO_SIZES;

/** Calcule la largeur à partir d'une hauteur cible, en conservant le ratio */
export function getBrandLogoWidth(height: number): number {
  return Math.round(height * BRAND_LOGO_ASPECT_RATIO);
}

/** Dimensions width × height pour une taille prédéfinie */
export function getBrandLogoDimensions(size: BrandLogoSize): {
  width: number;
  height: number;
} {
  const height = BRAND_LOGO_SIZES[size].height;
  return { width: getBrandLogoWidth(height), height };
}
