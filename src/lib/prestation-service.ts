import { Prestation } from "@/types/prestation";
import { AuthUser } from "@/types/auth";
import { INITIAL_MOCK_PRESTATIONS } from "./mock-prestations";
import { authService } from "./auth-service";

const STORAGE_KEY = "artefacts_prestations_db";

function getPrestationsFromStorage(): Prestation[] {
  if (typeof window === "undefined") return INITIAL_MOCK_PRESTATIONS;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_PRESTATIONS));
    return INITIAL_MOCK_PRESTATIONS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_MOCK_PRESTATIONS;
  }
}

function savePrestationsToStorage(items: Prestation[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
}

export const prestationService = {
  /** Récupère toutes les prestations */
  getAll(): Prestation[] {
    return getPrestationsFromStorage();
  },

  /** Récupère une prestation par ID */
  getById(id: string): Prestation | null {
    const items = getPrestationsFromStorage();
    return items.find((p) => p.id === id) || null;
  },

  /** Récupère les prestations auxquelles participe un musicien */
  getByMusicianId(musicianId: string): Prestation[] {
    const items = getPrestationsFromStorage();
    return items.filter((p) => p.musicianIds.includes(musicianId));
  },

  /** Récupère l'équipe des musiciens d'une prestation */
  getMusiciansForPrestation(prestationId: string): AuthUser[] {
    const prestation = this.getById(prestationId);
    if (!prestation) return [];
    return prestation.musicianIds
      .map((id) => authService.getProfileById(id))
      .filter((u): u is AuthUser => u !== null);
  },

  /** Récupère le profil du responsable de la prestation */
  getResponsableForPrestation(prestationId: string): AuthUser | null {
    const prestation = this.getById(prestationId);
    if (!prestation || !prestation.responsableId) return null;
    return authService.getProfileById(prestation.responsableId);
  },

  /** Création d'une prestation */
  create(
    data: Omit<Prestation, "id" | "updatedAt">,
    creatorName: string = "Production"
  ): Prestation {
    const items = getPrestationsFromStorage();

    // Règle d'intégrité : Le responsable doit faire partie des musiciens participants
    if (data.responsableId && !data.musicianIds.includes(data.responsableId)) {
      data.musicianIds.push(data.responsableId);
    }

    const newPrestation: Prestation = {
      ...data,
      id: `prest-${Date.now()}`,
      updatedAt: new Date().toISOString(),
      updatedBy: creatorName,
      syncInfo: data.syncInfo || { source: "manual" },
    };

    items.unshift(newPrestation);
    savePrestationsToStorage(items);
    return newPrestation;
  },

  /** Modification d'une prestation (avec traçabilité pour futures notifications) */
  update(
    id: string,
    data: Partial<Prestation>,
    editorName: string = "Production"
  ): Prestation | null {
    const items = getPrestationsFromStorage();
    const index = items.findIndex((p) => p.id === id);

    if (index === -1) return null;

    const current = items[index];

    // Règle d'intégrité : Si le responsable change, s'assurer qu'il est dans musicianIds
    let updatedMusicianIds = data.musicianIds || current.musicianIds;
    const updatedResponsableId = data.responsableId || current.responsableId;

    if (updatedResponsableId && !updatedMusicianIds.includes(updatedResponsableId)) {
      updatedMusicianIds = [...updatedMusicianIds, updatedResponsableId];
    }

    const updatedPrestation: Prestation = {
      ...current,
      ...data,
      musicianIds: updatedMusicianIds,
      responsableId: updatedResponsableId,
      updatedAt: new Date().toISOString(),
      updatedBy: editorName,
    };

    items[index] = updatedPrestation;
    savePrestationsToStorage(items);
    return updatedPrestation;
  },

  /** Suppression / Archivage sécurisé d'une prestation */
  delete(id: string): boolean {
    const items = getPrestationsFromStorage();
    const filtered = items.filter((p) => p.id !== id);
    if (filtered.length === items.length) return false;
    savePrestationsToStorage(filtered);
    return true;
  },

  /** Archivage doux (status: annule) */
  archive(id: string, editorName: string = "Production"): Prestation | null {
    return this.update(id, { status: "annule" }, editorName);
  },
};
