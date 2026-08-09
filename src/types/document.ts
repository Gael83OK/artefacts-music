/**
 * Modèle de données Espace Documents Central — Artefacts Music (Prompt 017)
 */

export type DocCategory =
  | "administratif"
  | "musical"
  | "prestation"
  | "repetition"
  | "autre";

export type DocType = "pdf" | "audio" | "html" | "office" | "autre";

export interface ExternalDocSync {
  source: "google_drive" | "manual" | string;
  externalId?: string;
  externalPath?: string;
  lastSyncedAt?: string;
}

export interface CentralDocument {
  id: string;
  nom: string;
  type: DocType;
  categorie: DocCategory;
  dateAjout: string; // ISO String
  addedBy: string;
  taille?: string; // ex: "1.2 MB"
  fileUrl: string;
  
  // Relations de contexte (Pas de duplication physique de fichier)
  userId?: string; // Propriétaire si document administratif personnel
  songId?: string;
  songTitle?: string;
  prestationId?: string;
  prestationTitle?: string;
  repetitionId?: string;
  repetitionTitle?: string;
  
  description?: string;
  externalSync?: ExternalDocSync; // Préparé pour future synchronisation Drive
}
