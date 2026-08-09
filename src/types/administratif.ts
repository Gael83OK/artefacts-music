/**
 * Modèle de données Espace Administratif — Artefacts Music (Prompt 006)
 */

export type AdminDocCategory = "fiches_de_paie" | "aem" | "conges_spectacle" | "autres";

export interface AdminDocument {
  id: string;
  userId: string; // Propriétaire du document (sécurité stricte par musicien)
  nom: string;
  categorie: AdminDocCategory;
  date: string; // YYYY-MM-DD
  periode?: string; // ex: "Juillet 2026"
  taille?: string; // ex: "450 KB"
  fileUrl?: string;
}

export interface IntermittenceProfile {
  userId: string;
  dateAnniversaire: string; // YYYY-MM-DD
  cachetBrutParDefaut?: number; // Montant brut par prestation (ex: 180 €)
}

export interface AdminMonthSummary {
  prestationsRealiseesCount: number;
  prestationsPrevuesCount: number;
  montantBrutRealise: number | null;
  montantBrutEstime: number | null;
}

export interface IntermittencePeriodSummary {
  dateDebut: string; // YYYY-MM-DD
  dateFin: string; // YYYY-MM-DD
  prestationsRealiseesCount: number;
  prestationsPrevuesCount: number;
}
