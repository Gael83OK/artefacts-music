/**
 * Modèle de données Matériel et Missions Spécifiques — Artefacts Music (Prompt 009)
 */

export type MissionStatus = "a_faire" | "realise";

export type MaterielStatus = "disponible" | "en_utilisation" | "en_maintenance" | "indisponible";

export interface MaterielSpecifique {
  id: string;
  nom: string;
  categorie: string; // ex: "Son", "Lumière", "Instruments", "Accessoires", "Régie"
  quantite?: number;
  statut: MaterielStatus;
  prestationId?: string; // Prestation à laquelle l'équipement est affecté
  responsableId?: string; // Responsable du matériel
  depot?: string; // ex: "Rognes"
  notes?: string;
  actif?: boolean; // false si archivé
  updatedAt?: string;
  updatedBy?: string;
}

export interface MissionSpecifique {
  id: string;
  prestationId: string;
  titre: string; // ex: "Passer au local de Rognes", "Récupérer la sono", "Ramener les retours"
  description?: string;
  responsableId: string; // Attribué à un musicien (AuthUser.id)
  materielId?: string; // Matériel spécifique associé s'il y a lieu
  statut: MissionStatus; // "a_faire" | "realise"
  updatedAt?: string;
  updatedBy?: string;
}
