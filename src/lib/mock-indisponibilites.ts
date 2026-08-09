import { Indisponibilite } from "@/types/indisponibilite";

export const INITIAL_MOCK_INDISPONIBILITES: Indisponibilite[] = [
  {
    id: "indisp-101",
    userId: "mus-1", // Constantin Lau
    date: "2026-08-20",
    note: "Mariage familial",
    createdAt: "2026-08-01T10:00:00Z",
    updatedAt: "2026-08-01T10:00:00Z",
  },
  {
    id: "indisp-102",
    userId: "mus-1",
    date: "2026-08-21",
    note: "Mariage familial",
    createdAt: "2026-08-01T10:00:00Z",
    updatedAt: "2026-08-01T10:00:00Z",
  },
  {
    id: "indisp-201",
    userId: "mus-2", // Théo Lombard
    date: "2026-08-28",
    note: "Session enregistrement studio perso",
    createdAt: "2026-08-03T14:00:00Z",
    updatedAt: "2026-08-03T14:00:00Z",
  },
  {
    id: "indisp-501",
    userId: "mus-5", // Marie Delacroix
    date: "2026-08-14",
    note: "Congé personnel",
    createdAt: "2026-08-05T09:00:00Z",
    updatedAt: "2026-08-05T09:00:00Z",
  },
];
