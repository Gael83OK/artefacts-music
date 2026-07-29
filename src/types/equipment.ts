/**
 * Modèle Matériel — inventaire Artefacts Music
 */

/** Dépôt principal de stockage */
export type EquipmentDepot = "Rognes";

/** État d'un équipement */
export type EquipmentEtat =
  | "Disponible"
  | "En utilisation"
  | "Maintenance"
  | "Indisponible";

export interface Equipment {
  id: string;
  nom: string;
  categorie: string;
  quantite: number;
  depot: EquipmentDepot;
  etat: EquipmentEtat;
}
