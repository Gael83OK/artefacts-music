/**
 * Modèle de données Recherche Globale — Artefacts Music (Prompt 016)
 */

export type SearchResultCategory =
  | "morceau"
  | "prestation"
  | "repetition"
  | "musician"
  | "document";

export interface SearchResultItem {
  id: string;
  category: SearchResultCategory;
  title: string;
  subtitle?: string;
  badge?: string;
  targetUrl: string;
  matchPriority: number; // 1 = exact, 2 = débu, 3 = contient, 4 = tolérance fautes
}

export type GroupedSearchResults = Partial<Record<SearchResultCategory, SearchResultItem[]>>;
