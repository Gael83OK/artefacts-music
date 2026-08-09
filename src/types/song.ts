/**
 * Modèle de données Espace Musical / Bibliothèque des Morceaux — Artefacts Music (Prompt 007)
 */

export type SongStatus =
  | "a_travailler"
  | "en_cours"
  | "a_arranger"
  | "arrangement_commence"
  | "pret"
  | "archive";


export type FileType = "audio" | "partition" | "grille" | "ireal" | "autre";

export interface SongAudio {
  id: string;
  titre: string;
  url: string;
  dateAjout: string; // YYYY-MM-DD
  auteur?: string;
  description?: string;
}

export interface SongFile {
  id: string;
  nom: string;
  type: FileType;
  url: string;
  taille?: string;
  dateAjout?: string;
  auteur?: string;
  description?: string;
}

export interface Song {
  id: string;
  titre: string;
  artiste: string;
  statut: SongStatus;
  formations?: string[]; // ex: ["Duo", "Quartet"]
  arrangementInfo?: string; // Text field for structure, intro, outro, key, notes
  prestationIds?: string[]; // Linked prestation IDs
  repetitionIds?: string[]; // Linked repetition IDs
  files?: SongFile[];
  audios?: SongAudio[]; // Multiple audio takes preserving version history
  favorisUserIds?: string[]; // List of userIds who marked this song as favorite

  updatedAt?: string;
  updatedBy?: string;
}
