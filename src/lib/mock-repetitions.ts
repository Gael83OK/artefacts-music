import { Repetition } from "@/types/repetition";

export const INITIAL_MOCK_REPETITIONS: Repetition[] = [
  {
    id: "rep-1",
    titre: "Répétition Quartet — Cassis",
    date: "2026-08-13",
    heureDebut: "19:30",
    heureFin: "22:00",
    lieu: "Studio Artefacts",
    adresse: "Chemin de Traspigut, Rognes",
    objet: "Trio — mise en place des morceaux du cocktail mariage",
    musicianIds: ["mus-1", "mus-2", "mus-5", "mus-6"], // Constantin, Théo, Gaël, Liam
    formation: "Quartet",
    status: "confirme",
    songIds: ["song-1", "song-2", "song-3"], // L-O-V-E, Fly Me to the Moon, Ain't No Mountain
    audios: [
      {
        id: "audio-rep-101",
        titre: "Prise Live 1 — L-O-V-E (Ouverture de bal)",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        dateAjout: "2026-08-13",
        auteur: "Constantin Lounis",
        description: "Enregistrement studio avec solo piano.",
      },
      {
        id: "audio-rep-102",
        titre: "Prise Live 2 — Fly Me to the Moon",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        dateAjout: "2026-08-13",
        auteur: "Théo Lounis",
        description: "Test tempo swing modéré.",
      },
    ],
    syncInfo: {
      source: "manual",
    },
    updatedAt: "2026-08-01T12:00:00Z",
  },
  {
    id: "rep-2",
    titre: "Session Duo Acoustique",
    date: "2026-08-20",
    heureDebut: "18:00",
    heureFin: "20:30",
    lieu: "Studio Artefacts",
    adresse: "Chemin de Traspigut, Rognes",
    objet: "Travailler le nouveau répertoire Pop Lounge",
    musicianIds: ["mus-2", "mus-5"], // Théo, Gaël
    formation: "Duo",
    status: "confirme",
    songIds: ["song-4", "song-5"], // Shallow, Valerie
    audios: [
      {
        id: "audio-rep-201",
        titre: "Répétition V1 — Shallow acoustic",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        dateAjout: "2026-08-05",
        auteur: "Théo Lounis",
        description: "Harmonies de voix Atlantine & Théo.",
      },
    ],
    syncInfo: {
      source: "manual",
    },
    updatedAt: "2026-08-05T14:00:00Z",
  },
  {
    id: "rep-3",
    titre: "Répétition Générale Gala",
    date: "2026-09-03",
    heureDebut: "20:00",
    heureFin: "23:00",
    lieu: "Studio Artefacts",
    adresse: "Chemin de Traspigut, Rognes",
    objet: "Arrangements et fins des medleys d'ouverture",
    musicianIds: ["mus-1", "mus-2", "mus-5"], // Constantin, Théo, Gaël
    formation: "Trio",
    status: "confirme",
    songIds: ["song-3", "song-5"], // Ain't No Mountain, Valerie
    audios: [],
    syncInfo: {
      source: "manual",
    },
    updatedAt: "2026-08-08T16:30:00Z",
  },
];
