/**
 * Modèle de données Répétition — Artefacts Music (Prompt 008)
 */
import { Prestation } from "./prestation";
import { SongAudio } from "./song";

export type RepetitionStatus = "confirme" | "option" | "annule";

export interface Repetition {
  id: string;
  titre: string;
  date: string; // YYYY-MM-DD
  heureDebut: string; // HH:MM
  heureFin: string; // HH:MM
  lieu: string;
  adresse?: string;
  objet: string; // Texte libre (ex: "Travailler le nouveau répertoire", "Trio — mise en place", "Arrangements et fins")
  musicianIds: string[]; // Musiciens convoqués à la répétition
  formation?: string;
  status: RepetitionStatus;

  // Morceaux de la bibliothèque centrale travaillés lors de cette session
  songIds?: string[];

  // Audios enregistrés ou importés lors de cette répétition
  audios?: SongAudio[];

  // Préparation pour la synchronisation externe & indisponibilités
  syncInfo?: {
    externalId?: string;
    source?: string;
    lastSyncedAt?: string;
  };

  updatedAt?: string;
  updatedBy?: string;
}

export type CalendarItemType = "prestation" | "repetition";

export interface CalendarItem {
  id: string;
  type: CalendarItemType;
  date: string;
  heureDebut: string;
  isToday: boolean;
  isNext: boolean;
  prestation?: Prestation;
  repetition?: Repetition;
}
