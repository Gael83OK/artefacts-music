import { Indisponibilite } from "@/types/indisponibilite";
import { INITIAL_MOCK_INDISPONIBILITES } from "./mock-indisponibilites";

const STORAGE_KEY = "artefacts_indisponibilites_db";

function getIndisponibilitesFromStorage(): Indisponibilite[] {
  if (typeof window === "undefined") return INITIAL_MOCK_INDISPONIBILITES;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_INDISPONIBILITES));
    return INITIAL_MOCK_INDISPONIBILITES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_MOCK_INDISPONIBILITES;
  }
}

function saveIndisponibilitesToStorage(items: Indisponibilite[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
}

export const indisponibiliteService = {
  /** Récupère toutes les indisponibilités */
  getAll(): Indisponibilite[] {
    return getIndisponibilitesFromStorage();
  },

  /** Récupère toutes les indisponibilités d'un musicien */
  getByUser(userId: string): Indisponibilite[] {
    const list = getIndisponibilitesFromStorage();
    return list.filter((item) => item.userId === userId);
  },


  /** Récupère les indisponibilités d'un musicien pour un mois donné */
  getByUserAndMonth(userId: string, year: number, month: number): Indisponibilite[] {
    const userItems = this.getByUser(userId);
    const monthStr = month < 10 ? `0${month}` : `${month}`;
    const prefix = `${year}-${monthStr}`;

    return userItems.filter((item) => item.date.startsWith(prefix));
  },

  /**
   * Vérifie la règle de conflit pour la production (Prompt 013) :
   * Renvoie true si le musicien est indisponible à la date X.
   */
  hasConflict(userId: string, dateStr: string): boolean {
    const userItems = this.getByUser(userId);
    return userItems.some((item) => item.date === dateStr);
  },

  /** Active ou désactive l'indisponibilité d'une date (Toggle) */
  toggleDate(userId: string, dateStr: string, note?: string): Indisponibilite | null {
    const list = getIndisponibilitesFromStorage();
    const existingIndex = list.findIndex(
      (item) => item.userId === userId && item.date === dateStr
    );

    if (existingIndex !== -1) {
      // Déjà indisponible -> Retirer (Désélectionner)
      list.splice(existingIndex, 1);
      saveIndisponibilitesToStorage(list);
      return null;
    } else {
      // Disponible -> Ajouter l'indisponibilité
      const newIndisp: Indisponibilite = {
        id: `indisp-${Date.now()}`,
        userId,
        date: dateStr,
        note: note?.trim() || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      list.push(newIndisp);
      saveIndisponibilitesToStorage(list);
      return newIndisp;
    }
  },

  /** Modification d'une note facultative */
  updateNote(id: string, note: string): Indisponibilite | null {
    const list = getIndisponibilitesFromStorage();
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const updated: Indisponibilite = {
      ...list[index],
      note: note.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };
    list[index] = updated;
    saveIndisponibilitesToStorage(list);
    return updated;
  },

  /** Suppression directe d'une indisponibilité */
  remove(id: string): boolean {
    const list = getIndisponibilitesFromStorage();
    const filtered = list.filter((item) => item.id !== id);
    if (filtered.length === list.length) return false;

    saveIndisponibilitesToStorage(filtered);
    return true;
  },
};
