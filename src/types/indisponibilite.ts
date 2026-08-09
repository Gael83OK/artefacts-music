/**
 * Modèle de données Mes Indisponibilités — Artefacts Music (Prompt 013)
 */

export interface Indisponibilite {
  id: string;
  userId: string; // Identifiant du musicien propriétaire
  date: string; // YYYY-MM-DD
  note?: string; // Note facultative (ex: "Mariage familial", "Tournée perso")
  externalSyncId?: string; // Identifiant externe réservé aux futures synchronisations
  createdAt: string;
  updatedAt: string;
}
