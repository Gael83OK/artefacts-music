import { Song, SongStatus, SongAudio, SongFile } from "@/types/song";
import { INITIAL_MOCK_SONGS } from "./mock-songs";
import { supabase } from "./supabase";

const STORAGE_KEY = "artefacts_songs_db";

function getSongsFromStorage(): Song[] {
  if (typeof window === "undefined") return INITIAL_MOCK_SONGS;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_SONGS));
    return INITIAL_MOCK_SONGS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_MOCK_SONGS;
  }
}

function saveSongsToStorage(songs: Song[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
  }
}

export const songService = {
  /** Récupère tous les morceaux de la bibliothèque */
  getAll(): Song[] {
    return getSongsFromStorage();
  },

  /** Récupère un morceau par ID */
  getById(id: string): Song | null {
    const songs = getSongsFromStorage();
    return songs.find((s) => s.id === id) || null;
  },

  /** Filtrage par statut */
  getByStatus(status: SongStatus): Song[] {
    const songs = getSongsFromStorage();
    return songs.filter((s) => s.statut === status);
  },

  /** Vérifie si un morceau est en favori pour un utilisateur donné */
  isFavorite(songId: string, userId: string): boolean {
    const song = this.getById(songId);
    if (!song || !song.favorisUserIds) return false;
    return song.favorisUserIds.includes(userId);
  },

  /** Active/désactive un morceau en favori individuel pour un utilisateur */
  toggleFavorite(songId: string, userId: string): boolean {
    const songs = getSongsFromStorage();
    const index = songs.findIndex((s) => s.id === songId);
    if (index === -1) return false;

    const current = songs[index];
    const currentFavs = current.favorisUserIds || [];
    let updatedFavs: string[];
    let isFavNow = false;

    if (currentFavs.includes(userId)) {
      updatedFavs = currentFavs.filter((id) => id !== userId);
    } else {
      updatedFavs = [...currentFavs, userId];
      isFavNow = true;
    }

    songs[index] = { ...current, favorisUserIds: updatedFavs };
    saveSongsToStorage(songs);
    return isFavNow;
  },

  /** Création d'un morceau */
  create(data: Omit<Song, "id" | "updatedAt">, creatorName: string = "Production"): Song {
    const songs = getSongsFromStorage();
    const newSong: Song = {
      ...data,
      id: `song-${Date.now()}`,
      files: data.files || [],
      audios: data.audios || [],
      favorisUserIds: data.favorisUserIds || [],
      updatedAt: new Date().toISOString(),
      updatedBy: creatorName,
    };
    songs.unshift(newSong);
    saveSongsToStorage(songs);

    // Sync to Supabase
    if (supabase) {
      supabase
        .from("songs")
        .upsert([{
          id: newSong.id,
          titre: newSong.titre,
          artiste: newSong.artiste,
          statut: newSong.statut,
          arrangement_info: newSong.arrangementInfo || null,
        }])
        .then(() => {});
    }

    return newSong;
  },

  /** Modification des informations d'un morceau */
  update(id: string, data: Partial<Song>, editorName: string = "Production"): Song | null {
    const songs = getSongsFromStorage();
    const index = songs.findIndex((s) => s.id === id);
    if (index === -1) return null;

    const updated: Song = {
      ...songs[index],
      ...data,
      updatedAt: new Date().toISOString(),
      updatedBy: editorName,
    };
    songs[index] = updated;
    saveSongsToStorage(songs);

    if (supabase) {
      supabase
        .from("songs")
        .upsert([{
          id: updated.id,
          titre: updated.titre,
          artiste: updated.artiste,
          statut: updated.statut,
          arrangement_info: updated.arrangementInfo || null,
        }])
        .then(() => {});
    }

    return updated;
  },

  /** Ajout d'une nouvelle version audio tout en conservant les anciennes (Prompt 007) */
  addAudio(
    songId: string,
    audioData: Omit<SongAudio, "id" | "dateAjout">,
    authorName: string = "Production"
  ): Song | null {
    const song = this.getById(songId);
    if (!song) return null;

    const newAudio: SongAudio = {
      ...audioData,
      id: `audio-${Date.now()}`,
      dateAjout: new Date().toISOString().split("T")[0],
      auteur: authorName,
    };

    const currentAudios = song.audios || [];
    const updatedAudios = [newAudio, ...currentAudios];

    return this.update(songId, { audios: updatedAudios }, authorName);
  },

  /** Ajout d'un fichier associé (partition, grille, iReal, etc.) */
  addFile(
    songId: string,
    fileData: Omit<SongFile, "id" | "dateAjout">,
    authorName: string = "Production"
  ): Song | null {
    const song = this.getById(songId);
    if (!song) return null;

    const newFile: SongFile = {
      ...fileData,
      id: `file-${Date.now()}`,
      dateAjout: new Date().toISOString().split("T")[0],
      auteur: authorName,
    };

    const currentFiles = song.files || [];
    const updatedFiles = [newFile, ...currentFiles];

    return this.update(songId, { files: updatedFiles }, authorName);
  },

  /**
   * Suppression ou archivage sécurisé d'un morceau (Prompt 020 & 032)
   * Si le morceau est référencé par une setlist ou une répétition, il est archivé au lieu d'être supprimé.
   */
  delete(id: string): { success: boolean; archived: boolean } {
    const songs = getSongsFromStorage();
    const index = songs.findIndex((s) => s.id === id);
    if (index === -1) return { success: false, archived: false };

    // Si déjà archivé, suppression définitive
    if (songs[index].statut === "archive") {
      songs.splice(index, 1);
      saveSongsToStorage(songs);
      if (supabase) {
        supabase.from("songs").delete().eq("id", id).then(() => {});
      }
      return { success: true, archived: false };
    }

    // Sinon, basculer en archivage pour préserver la cohérence des références
    songs[index] = {
      ...songs[index],
      statut: "archive",
      updatedAt: new Date().toISOString(),
    };
    saveSongsToStorage(songs);

    if (supabase) {
      supabase
        .from("songs")
        .update({ statut: "archive" })
        .eq("id", id)
        .then(() => {});
    }

    return { success: true, archived: true };
  },
};

