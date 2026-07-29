/**
 * Types legacy — utilisés par l'interface actuelle
 * À supprimer lors de la migration vers les nouveaux modèles
 */

/** @deprecated Utiliser EventStatus de event.ts */
export type LegacyEventStatus = "confirmed" | "pending" | "cancelled";

/** @deprecated Utiliser VenueType et les nouveaux modèles Event */
export type EventType = "prestation" | "repetition" | "production" | "logistique";

/** @deprecated Utiliser Event de event.ts */
export interface LegacyEvent {
  id: string;
  title: string;
  type: EventType;
  date: string;
  time: string;
  location: string;
  status: LegacyEventStatus;
  musicians?: string[];
}

/** @deprecated Utiliser Musician de musician.ts */
export interface LegacyMusician {
  id: string;
  name: string;
  instrument: string;
  email: string;
  phone: string;
  avatar?: string;
}

/** @deprecated Utiliser Equipment de equipment.ts */
export interface LegacyEquipment {
  id: string;
  name: string;
  category: string;
  status: "available" | "in_use" | "maintenance";
  location: string;
}

/** Élément du planning hebdomadaire (UI accueil) */
export interface WeekPlanItem {
  id: string;
  day: string;
  dayShort: string;
  events: { title: string; time: string; type: EventType }[];
}

/** Navigation — identifiants des routes principales */
export type NavItemId = "home" | "agenda" | "prestations" | "materiel" | "profil";
