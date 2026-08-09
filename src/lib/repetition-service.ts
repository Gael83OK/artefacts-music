import { Repetition } from "@/types/repetition";
import { INITIAL_MOCK_REPETITIONS } from "./mock-repetitions";
import { authService } from "./auth-service";
import { songService } from "./song-service";


const STORAGE_KEY = "artefacts_repetitions_db";

function getRepetitionsFromStorage(): Repetition[] {
  if (typeof window === "undefined") return INITIAL_MOCK_REPETITIONS;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_REPETITIONS));
    return INITIAL_MOCK_REPETITIONS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_MOCK_REPETITIONS;
  }
}

function saveRepetitionsToStorage(items: Repetition[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
}

export const repetitionService = {
  /** Récupère toutes les répétitions */
  getAll(): Repetition[] {
    return getRepetitionsFromStorage();
  },

  /** Récupère une répétition par ID */
  getById(id: string): Repetition | null {
    const items = getRepetitionsFromStorage();
    return items.find((r) => r.id === id) || null;
  },

  /** Récupère les répétitions auxquelles participe un musicien */
  getByMusicianId(musicianId: string): Repetition[] {
    const items = getRepetitionsFromStorage();
    return items.filter((r) => r.musicianIds.includes(musicianId));
  },

  /** Création d'une répétition */
  create(
    data: Omit<Repetition, "id" | "updatedAt">,
    creatorName: string = "Production"
  ): Repetition {
    const items = getRepetitionsFromStorage();
    const newRepetition: Repetition = {
      ...data,
      id: `rep-${Date.now()}`,
      updatedAt: new Date().toISOString(),
      updatedBy: creatorName,
    };
    items.unshift(newRepetition);
    saveRepetitionsToStorage(items);
    return newRepetition;
  },

  /** Modification d'une répétition */
  update(
    id: string,
    data: Partial<Repetition>,
    editorName: string = "Production"
  ): Repetition | null {
    const items = getRepetitionsFromStorage();
    const index = items.findIndex((r) => r.id === id);
    if (index === -1) return null;

    const updated: Repetition = {
      ...items[index],
      ...data,
      updatedAt: new Date().toISOString(),
      updatedBy: editorName,
    };
    items[index] = updated;
    saveRepetitionsToStorage(items);
    return updated;
  },

  /** Ajoute un morceau de la bibliothèque à une répétition */
  addSongToRepetition(repetitionId: string, songId: string, editorName: string = "Production"): Repetition | null {
    const rep = this.getById(repetitionId);
    if (!rep) return null;

    const currentSongs = rep.songIds || [];
    if (currentSongs.includes(songId)) return rep;

    return this.update(repetitionId, { songIds: [...currentSongs, songId] }, editorName);
  },

  /** Retire un morceau d'une répétition */
  removeSongFromRepetition(repetitionId: string, songId: string, editorName: string = "Production"): Repetition | null {
    const rep = this.getById(repetitionId);
    if (!rep) return null;

    const currentSongs = rep.songIds || [];
    return this.update(
      repetitionId,
      { songIds: currentSongs.filter((id) => id !== songId) },
      editorName
    );
  },

  /** Ajoute une nouvelle prise audio à la répétition (et optionnellement au morceau central) */
  addAudioToRepetition(
    repetitionId: string,
    audioData: { titre: string; url: string; description?: string },
    authorName: string = "Artiste",
    songId?: string
  ): Repetition | null {
    const rep = this.getById(repetitionId);
    if (!rep) return null;

    const newAudio = {
      id: `audio-rep-${Date.now()}`,
      titre: audioData.titre,
      url: audioData.url,
      dateAjout: new Date().toISOString().split("T")[0],
      auteur: authorName,
      description: audioData.description,
    };

    const currentAudios = rep.audios || [];
    const updatedAudios = [newAudio, ...currentAudios];

    // Si lié à un morceau, enregistrer aussi dans la bibliothèque centrale
    if (songId) {
      songService.addAudio(
        songId,
        {
          titre: `${audioData.titre} (Répétition ${rep.date})`,
          url: audioData.url,
          description: audioData.description,
        },
        authorName
      );
    }

    return this.update(repetitionId, { audios: updatedAudios }, authorName);
  },

  /** Suppression d'une répétition */
  delete(id: string): boolean {
    const items = getRepetitionsFromStorage();
    const filtered = items.filter((r) => r.id !== id);
    if (filtered.length === items.length) return false;
    saveRepetitionsToStorage(filtered);
    return true;
  },
};

