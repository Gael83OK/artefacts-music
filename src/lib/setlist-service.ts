import { Setlist, SetlistItem, SetlistStatus, IRealProFile } from "@/types/setlist";
import { INITIAL_MOCK_SETLISTS } from "./mock-setlists";

const STORAGE_KEY = "artefacts_setlists_db";

function getSetlistsFromStorage(): Setlist[] {
  if (typeof window === "undefined") return INITIAL_MOCK_SETLISTS;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_SETLISTS));
    return INITIAL_MOCK_SETLISTS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_MOCK_SETLISTS;
  }
}

function saveSetlistsToStorage(items: Setlist[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
}

export const setlistService = {
  /** Récupère toutes les setlists */
  getAll(): Setlist[] {
    return getSetlistsFromStorage();
  },

  /** Récupère la setlist d'une prestation */
  getSetlistForPrestation(prestationId: string): Setlist | null {
    const list = getSetlistsFromStorage();
    return list.find((s) => s.prestationId === prestationId) || null;
  },


  /**
   * Vérifie la règle de disponibilité du fichier HTML iReal Pro (Prompt 010) :
   * "Le fichier reste disponible jusqu'à 23 h 59 le lendemain de la date de la prestation."
   */
  isIRealFileAvailable(prestationDateStr: string): boolean {
    if (!prestationDateStr) return false;

    // Date de la prestation (ex: 2026-08-15)
    const prestationDate = new Date(prestationDateStr);
    if (isNaN(prestationDate.getTime())) return true; // fallback si format invalide

    // Date limite : lendemain à 23h59:59
    const expirationDate = new Date(prestationDate);
    expirationDate.setDate(expirationDate.getDate() + 1);
    expirationDate.setHours(23, 59, 59, 999);

    const now = new Date();
    return now <= expirationDate;
  },

  /** Sauvegarde ou met à jour une setlist */
  saveSetlist(
    prestationId: string,
    items: Omit<SetlistItem, "id">[],
    statut: SetlistStatus = "brouillon",
    editorName: string = "Production"
  ): Setlist {
    const setlists = getSetlistsFromStorage();
    const existingIndex = setlists.findIndex((s) => s.prestationId === prestationId);

    const formattedItems: SetlistItem[] = items.map((item, index) => ({
      ...item,
      id: `item-${Date.now()}-${index}`,
      ordre: index + 1,
    }));

    if (existingIndex !== -1) {
      const updated: Setlist = {
        ...setlists[existingIndex],
        items: formattedItems,
        statut,
        updatedAt: new Date().toISOString(),
        updatedBy: editorName,
      };
      setlists[existingIndex] = updated;
      saveSetlistsToStorage(setlists);
      return updated;
    } else {
      const newSetlist: Setlist = {
        id: `setlist-${Date.now()}`,
        prestationId,
        statut,
        items: formattedItems,
        updatedAt: new Date().toISOString(),
        updatedBy: editorName,
      };
      setlists.unshift(newSetlist);
      saveSetlistsToStorage(setlists);
      return newSetlist;
    }
  },

  /** Publication d'une setlist (la rend visible aux musiciens) */
  publishSetlist(prestationId: string, editorName: string = "Production"): Setlist | null {
    const setlist = this.getSetlistForPrestation(prestationId);
    if (!setlist) return null;

    return this.saveSetlist(
      prestationId,
      setlist.items,
      "publiee",
      editorName
    );
  },

  /** Importe ou remplace le fichier HTML iReal Pro */
  importIRealFile(
    prestationId: string,
    fileData: { nom: string; content: string },
    editorName: string = "Production"
  ): Setlist {
    let setlist = this.getSetlistForPrestation(prestationId);
    if (!setlist) {
      setlist = this.saveSetlist(prestationId, [], "brouillon", editorName);
    }

    const irealFile: IRealProFile = {
      id: `ireal-${Date.now()}`,
      nom: fileData.nom,
      content: fileData.content,
      importedAt: new Date().toISOString(),
      importedBy: editorName,
    };

    const setlists = getSetlistsFromStorage();
    const index = setlists.findIndex((s) => s.id === setlist!.id);
    const updated: Setlist = {
      ...setlists[index],
      irealFile,
      updatedAt: new Date().toISOString(),
      updatedBy: editorName,
    };

    setlists[index] = updated;
    saveSetlistsToStorage(setlists);
    return updated;
  },
};
