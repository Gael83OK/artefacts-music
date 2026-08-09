/**
 * Modèle Lieu — venues et sites de prestation
 */

/** Types de lieux conformes au MASTERPLAN */
export type VenueType =
  | "Mariage"
  | "Domaine viticole"
  | "Événement privé"
  | "Événement public"
  | "Répétition";

export interface Venue {
  id: string;
  nom: string;
  type: VenueType;
  adresse: string;
  ville: string;
}
