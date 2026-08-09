/**
 * Utilitaires de formatage et de valeurs de repli sûres — Artefacts Music (Prompt 022)
 * Empêche tout affichage d'undefined, null ou de champs vides isolés.
 */

export function safeDisplayLieu(lieu?: string | null): string {
  if (!lieu || !lieu.trim()) return "Lieu à définir";
  return lieu.trim();
}

export function safeDisplayHoraire(heure?: string | null): string {
  if (!heure || !heure.trim()) return "Horaire à définir";
  return heure.trim();
}

export function safeDisplayResponsable(responsableName?: string | null): string {
  if (!responsableName || !responsableName.trim()) return "Responsable à définir";
  return responsableName.trim();
}

export function safeDisplayArtiste(artiste?: string | null): string {
  if (!artiste || !artiste.trim()) return "Artiste non précisé";
  return artiste.trim();
}

export function safeDisplayTitre(titre?: string | null): string {
  if (!titre || !titre.trim()) return "Titre non renseigné";
  return titre.trim();
}
