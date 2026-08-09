import { AuthUser } from "@/types/auth";
import { SearchResultItem, GroupedSearchResults, SearchResultCategory } from "@/types/search";
import { authService } from "./auth-service";
import { prestationService } from "./prestation-service";
import { repetitionService } from "./repetition-service";
import { songService } from "./song-service";
import { administratifService } from "./administratif-service";
import { getUserRoleLabel } from "./mock-users";

const RECENT_SEARCHES_KEY = "artefacts_recent_searches_db";
const MAX_RECENT_SEARCHES = 5; // Règle Prompt 016 : 5 dernières recherches

/** Normalise une chaîne (supprime accents et casse) */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Calcul simple de distance de Levenshtein pour tolérance aux fautes de frappe (ex: Shalow -> Shallow) */
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/** Calcule le score de correspondance (1 = exact, 2 = commence par, 3 = contient, 4 = tolérance fautes, 0 = aucun) */
function getMatchScore(target: string, query: string): number {
  const normTarget = normalizeString(target);
  const normQuery = normalizeString(query);

  if (!normQuery || !normTarget) return 0;
  if (normTarget === normQuery) return 1;
  if (normTarget.startsWith(normQuery)) return 2;
  if (normTarget.includes(normQuery)) return 3;

  // Verification tolérance fautes de frappe sur les mots
  const targetWords = normTarget.split(/\s+/);
  const queryWords = normQuery.split(/\s+/);

  for (const qWord of queryWords) {
    if (qWord.length < 3) continue;
    for (const tWord of targetWords) {
      if (tWord.length < 3) continue;
      const dist = levenshteinDistance(tWord, qWord);
      if (dist <= 2) return 4; // Tolérance max 2 erreurs
    }
  }

  return 0;
}

export const searchService = {
  /**
   * Effectue une recherche globale multi-domaines avec contrôle strict des permissions (Prompt 016)
   */
  search(query: string, user: AuthUser | null): GroupedSearchResults {
    if (!query || !query.trim() || !user) {
      return {};
    }

    const cleanQuery = query.trim();
    const results: SearchResultItem[] = [];

    // 1. MORCEAUX (Bibliothèque Musicale)
    const songs = songService.getAll();
    songs.forEach((song) => {
      const score = Math.max(
        getMatchScore(song.titre, cleanQuery),
        getMatchScore(song.artiste || "", cleanQuery),
        getMatchScore(song.arrangementInfo || "", cleanQuery)
      );

      if (score > 0) {
        results.push({
          id: `song-${song.id}`,
          category: "morceau",
          title: song.titre,
          subtitle: `${song.artiste || "Artefacts"}`,
          badge: song.statut,
          targetUrl: `/espace-musical/${song.id}`,
          matchPriority: score,
        });
      }
    });


    // 2. PRESTATIONS (Filtrées selon les autorisations de l'utilisateur)
    const allPrestations = prestationService.getAll();
    allPrestations.forEach((prest) => {
      // Permission check: Production ou Responsable ou Musicien convoqué
      const hasPermission =
        user.role === "production" ||
        user.role === "hybrid_production" ||
        prest.responsableId === user.id ||
        (prest.musicianIds && prest.musicianIds.includes(user.id));

      if (!hasPermission) return;

      const score = Math.max(
        getMatchScore(prest.titre, cleanQuery),
        getMatchScore(prest.lieu, cleanQuery),
        getMatchScore(prest.adresse || "", cleanQuery),
        getMatchScore(prest.date, cleanQuery)

      );

      if (score > 0) {
        results.push({
          id: `prest-${prest.id}`,
          category: "prestation",
          title: prest.titre,
          subtitle: `📅 ${prest.date} • ${prest.lieu}`,
          badge: prest.formation,
          targetUrl: `/evenement/${prest.id}`,
          matchPriority: score,
        });
      }
    });

    // 3. RÉPÉTITIONS
    const rehearsals = repetitionService.getAll();
    rehearsals.forEach((reh) => {
      const score = Math.max(
        getMatchScore(reh.titre, cleanQuery),
        getMatchScore(reh.lieu, cleanQuery),
        getMatchScore(reh.objet || "", cleanQuery),
        getMatchScore(reh.date, cleanQuery)
      );

      if (score > 0) {
        results.push({
          id: `reh-${reh.id}`,
          category: "repetition",
          title: reh.titre,
          subtitle: `🎙️ ${reh.date} à ${reh.heureDebut} • ${reh.lieu}`,
          badge: reh.objet ? "Objectif fixé" : undefined,
          targetUrl: `/repetitions/${reh.id}`,
          matchPriority: score,
        });
      }
    });

    // 4. MUSICIENS & MEMBRES
    const members = authService.getAvailableProfiles();
    members.forEach((member) => {
      const roleLabel = getUserRoleLabel(member);
      const score = Math.max(
        getMatchScore(`${member.prenom} ${member.nom}`, cleanQuery),
        getMatchScore(roleLabel, cleanQuery),
        getMatchScore(member.ville || "", cleanQuery),
        getMatchScore(member.instrument || "", cleanQuery)
      );

      if (score > 0) {
        results.push({
          id: `member-${member.id}`,
          category: "musician",
          title: `${member.prenom} ${member.nom}`,
          subtitle: `🎸 ${member.instrument || "Musique"} • ${member.ville || "PACA"}`,
          badge: roleLabel,
          targetUrl: "/annuaire",
          matchPriority: score,
        });
      }
    });

    // 5. DOCUMENTS (Strictement restreints à l'utilisateur)
    const userDocs = administratifService.getDocumentsForUser(user.id);
    userDocs.forEach((doc) => {
      const score = Math.max(
        getMatchScore(doc.nom, cleanQuery),
        getMatchScore(doc.categorie, cleanQuery),
        getMatchScore(doc.periode || "", cleanQuery)
      );

      if (score > 0) {
        results.push({
          id: `doc-${doc.id}`,
          category: "document",
          title: doc.nom,
          subtitle: `📄 ${doc.categorie} • ${doc.periode || doc.date}`,
          badge: doc.categorie,
          targetUrl: "/administratif",
          matchPriority: score,
        });
      }
    });


    // Tri par score de priorité (1 = exact → 4 = tolérance), puis par ordre alphabétique
    results.sort((a, b) => {
      if (a.matchPriority !== b.matchPriority) {
        return a.matchPriority - b.matchPriority;
      }
      return a.title.localeCompare(b.title);
    });

    // Regroupement par catégorie
    const grouped: GroupedSearchResults = {};
    results.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category]!.push(item);
    });

    return grouped;
  },

  /** Historique des 5 dernières recherches (Prompt 016) */
  getRecentSearches(userId: string): string[] {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(`${RECENT_SEARCHES_KEY}_${userId}`);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  },

  addRecentSearch(userId: string, query: string) {
    if (!query || !query.trim()) return;
    const clean = query.trim();
    const history = this.getRecentSearches(userId);

    const filtered = history.filter((q) => q.toLowerCase() !== clean.toLowerCase());
    filtered.unshift(clean);

    if (typeof window !== "undefined") {
      localStorage.setItem(
        `${RECENT_SEARCHES_KEY}_${userId}`,
        JSON.stringify(filtered.slice(0, MAX_RECENT_SEARCHES))
      );
    }
  },

  removeRecentSearch(userId: string, query: string) {
    const history = this.getRecentSearches(userId);
    const filtered = history.filter((q) => q !== query);
    if (typeof window !== "undefined") {
      localStorage.setItem(`${RECENT_SEARCHES_KEY}_${userId}`, JSON.stringify(filtered));
    }
  },

  clearRecentSearches(userId: string) {
    if (typeof window !== "undefined") {
      localStorage.removeItem(`${RECENT_SEARCHES_KEY}_${userId}`);
    }
  },
};
