/**
 * Modèle de données Prestation — Artefacts Music (Prompt 004)
 */

export type PrestationStatus = "option" | "confirme" | "annule";

export interface ExternalSyncInfo {
  externalId?: string;
  source?: "gcal" | "production_tool" | "manual" | string;
  lastSyncedAt?: string;
}

export interface Prestation {
  id: string;
  titre: string;
  date: string; // YYYY-MM-DD
  heureArrivee: string; // HH:MM
  heureDebut: string; // HH:MM
  heureFin: string; // HH:MM
  lieu: string;
  adresse: string;
  infosLieu?: string;
  musicianIds: string[]; // List of participating Musician IDs
  responsableId: string; // Must be one of musicianIds
  formation: "Duo" | "Trio" | "Quartet" | "XXL" | string;
  dressCode?: string;
  materielMissions?: string;
  remarquesProduction?: string;
  demandesSpeciales?: string;
  status: PrestationStatus;

  // Préparation pour la synchronisation externe (agenda groupe, Drive, etc.)
  syncInfo?: ExternalSyncInfo;

  // Suivi des modifications (déclenchement futur des notifications)
  updatedAt?: string;
  updatedBy?: string;
}
