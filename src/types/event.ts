/**
 * Modèle Événement — prestation, répétition ou événement planifié
 */

/** Statut de cycle de vie d'un événement */
export type EventStatus = "En attente" | "Confirmé" | "Terminé";

/** Morceau d'une setlist */
export interface SetlistItem {
  id: string;
  titre: string;
  artiste: string;
  duree: string;
  ordre: number;
}

export interface Event {
  id: string;
  titre: string;
  /** Date au format ISO (YYYY-MM-DD) */
  date: string;
  heureDebut: string;
  heureFin: string;
  /** Référence vers un Venue.id */
  lieuId: string;
  /** Référence vers une Formation.id */
  formationId: string;
  /** Références vers Musician.id */
  musicienIds: string[];
  /** Référence vers Musician.id — responsable du matériel à l'aller */
  responsableMaterielId: string;
  /** Référence vers Musician.id — responsable du retour matériel */
  responsableRetourMaterielId: string;
  /** Références vers Equipment.id */
  materielAPrevoirIds: string[];
  setlist: SetlistItem[];
  remarques?: string;
  statut: EventStatus;
}
