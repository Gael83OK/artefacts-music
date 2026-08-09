import { MissionSpecifique, MaterielSpecifique, MissionStatus, MaterielStatus } from "@/types/materiel";
import { INITIAL_MOCK_MISSIONS, INITIAL_MOCK_MATERIELS } from "./mock-materiel";
import { supabase } from "./supabase";

const MISSIONS_KEY = "artefacts_missions_db";
const MATERIELS_KEY = "artefacts_materiels_db";

function getMissionsFromStorage(): MissionSpecifique[] {
  if (typeof window === "undefined") return INITIAL_MOCK_MISSIONS;
  const stored = localStorage.getItem(MISSIONS_KEY);
  if (!stored) {
    localStorage.setItem(MISSIONS_KEY, JSON.stringify(INITIAL_MOCK_MISSIONS));
    return INITIAL_MOCK_MISSIONS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_MOCK_MISSIONS;
  }
}

function saveMissionsToStorage(items: MissionSpecifique[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(MISSIONS_KEY, JSON.stringify(items));
  }
}

function getMaterielsFromStorage(): MaterielSpecifique[] {
  if (typeof window === "undefined") return INITIAL_MOCK_MATERIELS;
  const stored = localStorage.getItem(MATERIELS_KEY);
  if (!stored) {
    localStorage.setItem(MATERIELS_KEY, JSON.stringify(INITIAL_MOCK_MATERIELS));
    return INITIAL_MOCK_MATERIELS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_MOCK_MATERIELS;
  }
}

function saveMaterielsToStorage(items: MaterielSpecifique[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(MATERIELS_KEY, JSON.stringify(items));
  }
}

export const materielService = {
  /** Récupère toutes les missions logistiques */
  getAllMissions(): MissionSpecifique[] {
    return getMissionsFromStorage();
  },

  /** Récupère les missions spécifiques d'une prestation */
  getMissionsForPrestation(prestationId: string): MissionSpecifique[] {
    const missions = getMissionsFromStorage();
    return missions.filter((m) => m.prestationId === prestationId);
  },

  /** Récupère tous les équipements spécifiques du parc */
  getMateriels(): MaterielSpecifique[] {
    const items = getMaterielsFromStorage();
    return items.filter((m) => m.actif !== false);
  },

  /** Récupère un équipement par son ID */
  getMaterielById(id: string): MaterielSpecifique | null {
    const items = getMaterielsFromStorage();
    return items.find((m) => m.id === id) || null;
  },

  /** Création d'un équipement matériel */
  createMateriel(
    data: Omit<MaterielSpecifique, "id" | "updatedAt">,
    creatorName: string = "Production"
  ): MaterielSpecifique {
    const items = getMaterielsFromStorage();
    const newMateriel: MaterielSpecifique = {
      ...data,
      id: `mat-${Date.now()}`,
      actif: true,
      updatedAt: new Date().toISOString(),
      updatedBy: creatorName,
    };
    items.unshift(newMateriel);
    saveMaterielsToStorage(items);

    if (supabase) {
      supabase
        .from("equipment")
        .upsert([{
          id: newMateriel.id,
          nom: newMateriel.nom,
          categorie: newMateriel.categorie,
          quantite: newMateriel.quantite || 1,
          statut: newMateriel.statut,
          depot: newMateriel.depot || "Rognes",
          notes: newMateriel.notes || null,
        }])
        .then(() => {});
    }

    return newMateriel;
  },

  /** Modification d'un équipement matériel */
  updateMateriel(
    id: string,
    data: Partial<MaterielSpecifique>,
    editorName: string = "Production"
  ): MaterielSpecifique | null {
    const items = getMaterielsFromStorage();
    const index = items.findIndex((m) => m.id === id);
    if (index === -1) return null;

    const updated: MaterielSpecifique = {
      ...items[index],
      ...data,
      updatedAt: new Date().toISOString(),
      updatedBy: editorName,
    };
    items[index] = updated;
    saveMaterielsToStorage(items);

    if (supabase) {
      supabase
        .from("equipment")
        .upsert([{
          id: updated.id,
          nom: updated.nom,
          categorie: updated.categorie,
          quantite: updated.quantite || 1,
          statut: updated.statut,
          depot: updated.depot || "Rognes",
          notes: updated.notes || null,
        }])
        .then(() => {});
    }

    return updated;
  },

  /** Modification rapide du statut d'un équipement */
  updateMaterielStatus(
    id: string,
    newStatus: MaterielStatus,
    editorName: string = "Production"
  ): MaterielSpecifique | null {
    return this.updateMateriel(id, { statut: newStatus }, editorName);
  },

  /**
   * Suppression ou archivage sécurisé d'un équipement (Prompt 033)
   * Si l'élément est référencé par une mission logistique, il passe en archivage (actif: false, statut: "indisponible")
   * pour préserver l'historique de la mission.
   */
  deleteMateriel(id: string): { success: boolean; archived: boolean } {
    const items = getMaterielsFromStorage();
    const index = items.findIndex((m) => m.id === id);
    if (index === -1) return { success: false, archived: false };

    // Vérifier si le matériel est utilisé dans l'historique des missions
    const missions = getMissionsFromStorage();
    const isUsedInMissions = missions.some((m) => m.materielId === id);

    if (isUsedInMissions || items[index].actif === false) {
      // Basculer en archivage / indisponible
      items[index] = {
        ...items[index],
        actif: false,
        statut: "indisponible",
        updatedAt: new Date().toISOString(),
      };
      saveMaterielsToStorage(items);

      if (supabase) {
        supabase
          .from("equipment")
          .update({ statut: "indisponible" })
          .eq("id", id)
          .then(() => {});
      }

      return { success: true, archived: true };
    }

    // Sinon suppression définitive possible
    items.splice(index, 1);
    saveMaterielsToStorage(items);

    if (supabase) {
      supabase.from("equipment").delete().eq("id", id).then(() => {});
    }

    return { success: true, archived: false };
  },

  /** Bascule le statut d'une mission entre "a_faire" et "realise" */
  toggleMissionStatus(id: string, editorName: string = "Artiste"): MissionSpecifique | null {
    const missions = getMissionsFromStorage();
    const index = missions.findIndex((m) => m.id === id);
    if (index === -1) return null;

    const current = missions[index];
    const newStatus: MissionStatus = current.statut === "a_faire" ? "realise" : "a_faire";

    const updated: MissionSpecifique = {
      ...current,
      statut: newStatus,
      updatedAt: new Date().toISOString(),
      updatedBy: editorName,
    };

    missions[index] = updated;
    saveMissionsToStorage(missions);

    if (supabase) {
      supabase
        .from("materiel_missions")
        .update({ statut: newStatus })
        .eq("id", id)
        .then(() => {});
    }

    return updated;
  },

  /** Création d'une mission spécifique */
  createMission(
    data: Omit<MissionSpecifique, "id" | "updatedAt">,
    creatorName: string = "Production"
  ): MissionSpecifique {
    const missions = getMissionsFromStorage();
    const newMission: MissionSpecifique = {
      ...data,
      id: `miss-${Date.now()}`,
      updatedAt: new Date().toISOString(),
      updatedBy: creatorName,
    };
    missions.unshift(newMission);
    saveMissionsToStorage(missions);

    if (supabase) {
      supabase
        .from("materiel_missions")
        .upsert([{
          id: newMission.id,
          prestation_id: newMission.prestationId,
          titre: newMission.titre,
          responsable_id: newMission.responsableId,
          statut: newMission.statut,
          description: newMission.description || null,
        }])
        .then(() => {});
    }

    return newMission;
  },

  /** Modification d'une mission spécifique */
  updateMission(
    id: string,
    data: Partial<MissionSpecifique>,
    editorName: string = "Production"
  ): MissionSpecifique | null {
    const missions = getMissionsFromStorage();
    const index = missions.findIndex((m) => m.id === id);
    if (index === -1) return null;

    const updated: MissionSpecifique = {
      ...missions[index],
      ...data,
      updatedAt: new Date().toISOString(),
      updatedBy: editorName,
    };
    missions[index] = updated;
    saveMissionsToStorage(missions);

    if (supabase) {
      supabase
        .from("materiel_missions")
        .upsert([{
          id: updated.id,
          prestation_id: updated.prestationId,
          titre: updated.titre,
          responsable_id: updated.responsableId,
          statut: updated.statut,
          description: updated.description || null,
        }])
        .then(() => {});
    }

    return updated;
  },

  /** Suppression d'une mission */
  deleteMission(id: string): boolean {
    const missions = getMissionsFromStorage();
    const filtered = missions.filter((m) => m.id !== id);
    if (filtered.length === missions.length) return false;
    saveMissionsToStorage(filtered);

    if (supabase) {
      supabase.from("materiel_missions").delete().eq("id", id).then(() => {});
    }

    return true;
  },
};
