/**
 * Modèle de données Setlists et Intégration iReal Pro — Artefacts Music (Prompt 010)
 */

export type SetlistStatus = "brouillon" | "publiee";

export interface SetlistItem {
  id: string;
  songId: string; // Référence au morceau dans la bibliothèque centrale (Prompt 007)
  ordre: number; // Ordre de passage (1-indexed)
  isDemandeClient?: boolean; // Indicateur "Demande Mariés / Client"
  notes?: string; // Consigne particulière pour la prestation
}

export interface IRealProFile {
  id: string;
  nom: string;
  content: string; // HTML exporté depuis iReal Pro
  importedAt: string; // Timestamp ISO
  importedBy: string; // Prénom & nom du responsable de prestation ou producteur
}

export interface Setlist {
  id: string;
  prestationId: string;
  statut: SetlistStatus;
  items: SetlistItem[];
  irealFile?: IRealProFile;
  updatedAt: string;
  updatedBy: string;
}
