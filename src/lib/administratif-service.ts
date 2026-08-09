import {
  AdminDocument,
  IntermittenceProfile,
  AdminMonthSummary,
  IntermittencePeriodSummary,
} from "@/types/administratif";
import { Prestation } from "@/types/prestation";
import { INITIAL_ADMIN_DOCUMENTS, INITIAL_INTERMITTENCE_PROFILES } from "./mock-administratif";
import { prestationService } from "./prestation-service";

const PROFILES_KEY = "artefacts_intermittence_profiles";
const DOCUMENTS_KEY = "artefacts_admin_documents";

function getProfiles(): IntermittenceProfile[] {
  if (typeof window === "undefined") return INITIAL_INTERMITTENCE_PROFILES;
  const stored = localStorage.getItem(PROFILES_KEY);
  if (!stored) {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(INITIAL_INTERMITTENCE_PROFILES));
    return INITIAL_INTERMITTENCE_PROFILES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_INTERMITTENCE_PROFILES;
  }
}

function saveProfiles(profiles: IntermittenceProfile[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  }
}

function getDocuments(): AdminDocument[] {
  if (typeof window === "undefined") return INITIAL_ADMIN_DOCUMENTS;
  const stored = localStorage.getItem(DOCUMENTS_KEY);
  if (!stored) {
    localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(INITIAL_ADMIN_DOCUMENTS));
    return INITIAL_ADMIN_DOCUMENTS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_ADMIN_DOCUMENTS;
  }
}

export const administratifService = {
  /** Récupère le profil d'intermittence d'un musicien */
  getIntermittenceProfile(userId: string): IntermittenceProfile {
    const profiles = getProfiles();
    const existing = profiles.find((p) => p.userId === userId);
    if (existing) return existing;

    // Profil par défaut si non renseigné
    const defaultProfile: IntermittenceProfile = {
      userId,
      dateAnniversaire: "2026-09-15",
      cachetBrutParDefaut: 200,
    };
    return defaultProfile;
  },

  /** Modifie la date anniversaire d'intermittence d'un musicien */
  updateAnniversaryDate(userId: string, newDateStr: string): IntermittenceProfile {
    const profiles = getProfiles();
    const index = profiles.findIndex((p) => p.userId === userId);
    let updatedProfile: IntermittenceProfile;

    if (index !== -1) {
      updatedProfile = { ...profiles[index], dateAnniversaire: newDateStr };
      profiles[index] = updatedProfile;
    } else {
      updatedProfile = {
        userId,
        dateAnniversaire: newDateStr,
        cachetBrutParDefaut: 200,
      };
      profiles.push(updatedProfile);
    }

    saveProfiles(profiles);
    return updatedProfile;
  },

  /** Calcule les dates de début et de fin de la période d'intermittence (12 mois) */
  calculateIntermittencePeriod(dateAnniversaireStr: string): { dateDebut: string; dateFin: string } {
    const anniv = new Date(dateAnniversaireStr);
    if (isNaN(anniv.getTime())) {
      // Fallback
      return { dateDebut: "2026-09-15", dateFin: "2027-09-14" };
    }

    const startYear = anniv.getFullYear();
    const startDate = new Date(startYear, anniv.getMonth(), anniv.getDate());
    const endDate = new Date(startYear + 1, anniv.getMonth(), anniv.getDate() - 1);

    const dateDebut = startDate.toISOString().split("T")[0];
    const dateFin = endDate.toISOString().split("T")[0];

    return { dateDebut, dateFin };
  },

  /** Récupère les documents administratifs associés strictement à un musicien */
  getDocumentsForUser(userId: string): AdminDocument[] {
    const docs = getDocuments();
    return docs.filter((d) => d.userId === userId);
  },

  /** Calcule les statistiques du mois en cours */
  getAdminMonthSummary(userId: string): AdminMonthSummary {
    const allPrestations = prestationService.getByMusicianId(userId);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const monthPrestations = allPrestations.filter((p) => {
      const d = new Date(p.date);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    });

    const todayStr = now.toISOString().split("T")[0];

    const realisees = monthPrestations.filter((p) => p.date <= todayStr && p.status === "confirme");
    const prevues = monthPrestations.filter((p) => p.date > todayStr && p.status !== "annule");

    const profile = this.getIntermittenceProfile(userId);
    const cachetBrut = profile.cachetBrutParDefaut || 200;

    const montantBrutRealise = realisees.length > 0 ? realisees.length * cachetBrut : null;
    const montantBrutEstime = prevues.length > 0 ? prevues.length * cachetBrut : null;

    return {
      prestationsRealiseesCount: realisees.length,
      prestationsPrevuesCount: prevues.length,
      montantBrutRealise,
      montantBrutEstime,
    };
  },

  /** Calcule les statistiques de la période d'intermittence */
  getIntermittenceSummary(userId: string): IntermittencePeriodSummary {
    const profile = this.getIntermittenceProfile(userId);
    const { dateDebut, dateFin } = this.calculateIntermittencePeriod(profile.dateAnniversaire);
    const todayStr = new Date().toISOString().split("T")[0];

    const allPrestations = prestationService.getByMusicianId(userId);

    const periodPrestations = allPrestations.filter(
      (p) => p.date >= dateDebut && p.date <= dateFin
    );

    const realisees = periodPrestations.filter((p) => p.date <= todayStr && p.status === "confirme");
    const prevues = periodPrestations.filter((p) => p.date > todayStr && p.status !== "annule");

    return {
      dateDebut,
      dateFin,
      prestationsRealiseesCount: realisees.length,
      prestationsPrevuesCount: prevues.length,
    };
  },

  /** Récupère l'historique des prestations réalisées */
  getHistoryForUser(userId: string): (Prestation & { montantBrut?: number })[] {
    const allPrestations = prestationService.getByMusicianId(userId);
    const todayStr = new Date().toISOString().split("T")[0];
    const profile = this.getIntermittenceProfile(userId);
    const cachet = profile.cachetBrutParDefaut || 200;

    return allPrestations
      .filter((p) => p.date <= todayStr && p.status === "confirme")
      .map((p) => ({
        ...p,
        montantBrut: cachet,
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  },

  /** Récupère le calendrier prévisionnel des prestations à venir */
  getPrevisionnelCalendarForUser(userId: string): Prestation[] {
    const allPrestations = prestationService.getByMusicianId(userId);
    const todayStr = new Date().toISOString().split("T")[0];

    return allPrestations
      .filter((p) => p.date > todayStr && p.status !== "annule")
      .sort((a, b) => a.date.localeCompare(b.date));
  },
};
