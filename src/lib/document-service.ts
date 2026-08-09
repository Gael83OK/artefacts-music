import { CentralDocument, DocCategory } from "@/types/document";
import { AuthUser } from "@/types/auth";
import { INITIAL_MOCK_CENTRAL_DOCUMENTS } from "./mock-documents";
import { prestationService } from "./prestation-service";

const STORAGE_KEY = "artefacts_central_documents_db";

function getDocumentsFromStorage(): CentralDocument[] {
  if (typeof window === "undefined") return INITIAL_MOCK_CENTRAL_DOCUMENTS;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_CENTRAL_DOCUMENTS));
    return INITIAL_MOCK_CENTRAL_DOCUMENTS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_MOCK_CENTRAL_DOCUMENTS;
  }
}

function saveDocumentsToStorage(items: CentralDocument[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
}

export const documentService = {
  /** Récupère tous les documents centraux */
  getAll(): CentralDocument[] {
    return getDocumentsFromStorage();
  },

  /**

   * Vérifie les droits d'accès à un document central (Prompt 017)
   */
  canAccessDocument(doc: CentralDocument, user: AuthUser | null): boolean {
    if (!user) return false;

    const isProduction = user.role === "production" || user.role === "hybrid_production";

    // 1. Documents administratifs personnels (Strictement confidentiels)
    if (doc.categorie === "administratif") {
      if (doc.userId === user.id || isProduction) return true;
      return false;
    }

    // 2. Documents de prestation (Accessibles uniquement si convoqué ou production)
    if (doc.categorie === "prestation" && doc.prestationId) {
      if (isProduction) return true;
      const prest = prestationService.getById(doc.prestationId);
      if (prest) {
        if (prest.responsableId === user.id) return true;
        if (prest.musicianIds && prest.musicianIds.includes(user.id)) return true;
      }
      return false;
    }

    // 3. Documents musicaux, de répétition et autres (Membres Artefacts)
    return true;
  },

  /** Récupère la liste des documents accessibles par un utilisateur */
  getDocumentsForUser(user: AuthUser | null): CentralDocument[] {
    if (!user) return [];
    const list = getDocumentsFromStorage();
    return list.filter((doc) => this.canAccessDocument(doc, user));
  },

  /** Récupère les documents liés à un morceau */
  getBySongId(songId: string, user: AuthUser | null): CentralDocument[] {
    const list = this.getDocumentsForUser(user);
    return list.filter((doc) => doc.songId === songId);
  },

  /** Récupère les documents liés à une prestation */
  getByPrestationId(prestationId: string, user: AuthUser | null): CentralDocument[] {
    const list = this.getDocumentsForUser(user);
    return list.filter((doc) => doc.prestationId === prestationId);
  },

  /** Récupère les documents liés à une répétition */
  getByRepetitionId(repetitionId: string, user: AuthUser | null): CentralDocument[] {
    const list = this.getDocumentsForUser(user);
    return list.filter((doc) => doc.repetitionId === repetitionId);
  },

  /** Ajoute un nouveau document dans le système central */
  addDocument(
    data: Omit<CentralDocument, "id" | "dateAjout">,
    user: AuthUser
  ): CentralDocument {
    const newDoc: CentralDocument = {
      ...data,
      id: `doc-${Date.now()}`,
      dateAjout: new Date().toISOString(),
      addedBy: `${user.prenom} ${user.nom}`,
    };

    const list = getDocumentsFromStorage();
    list.unshift(newDoc);
    saveDocumentsToStorage(list);
    return newDoc;
  },

  /** Modifie uniquement les métadonnées sans altérer le fichier */
  updateMetadata(
    id: string,
    updates: Partial<Pick<CentralDocument, "nom" | "categorie" | "description" | "songId" | "songTitle" | "prestationId" | "prestationTitle" | "repetitionId" | "repetitionTitle">>,
    user: AuthUser
  ): CentralDocument | null {
    const list = getDocumentsFromStorage();
    const index = list.findIndex((doc) => doc.id === id);
    if (index === -1) return null;

    if (!this.canAccessDocument(list[index], user)) return null;

    const updatedDoc: CentralDocument = {
      ...list[index],
      ...updates,
    };

    list[index] = updatedDoc;
    saveDocumentsToStorage(list);
    return updatedDoc;
  },

  /** Supprime un document avec vérification des autorisations */
  deleteDocument(id: string, user: AuthUser): boolean {
    const list = getDocumentsFromStorage();
    const index = list.findIndex((doc) => doc.id === id);
    if (index === -1) return false;

    const doc = list[index];
    if (!this.canAccessDocument(doc, user)) return false;

    // Seul le propriétaire ou la production peut supprimer
    const isProduction = user.role === "production" || user.role === "hybrid_production";
    if (doc.userId && doc.userId !== user.id && !isProduction) {
      return false;
    }

    list.splice(index, 1);
    saveDocumentsToStorage(list);
    return true;
  },
};
