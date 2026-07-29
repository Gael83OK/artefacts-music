/**
 * Types centralisés pour Artefacts Music
 * Réexporte les modèles métier et les types legacy (UI en cours de migration)
 */

export type { MusicianRole, FormationName, Musician } from "./musician";
export type { Formation } from "./formation";
export type { VenueType, Venue } from "./venue";
export type { EventStatus, SetlistItem, Event } from "./event";
export type { EquipmentDepot, EquipmentEtat, Equipment } from "./equipment";

export type {
  LegacyEventStatus,
  EventType,
  LegacyEvent,
  LegacyMusician,
  LegacyEquipment,
  WeekPlanItem,
  NavItemId,
} from "./legacy";
