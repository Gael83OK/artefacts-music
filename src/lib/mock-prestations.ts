import { Prestation } from "@/types/prestation";

export const INITIAL_MOCK_PRESTATIONS: Prestation[] = [
  {
    id: "prest-1",
    titre: "Mariage Émilie & Marc",
    date: "2026-08-15",
    heureArrivee: "15:00",
    heureDebut: "16:30",
    heureFin: "01:30",
    lieu: "Château de Cassis",
    adresse: "Route des Crêtes, 13260 Cassis",
    infosLieu: "Accès livraison par la grille Sud. Parking réservé aux véhicules de l'équipe derrière le chai.",
    musicianIds: ["mus-1", "mus-2", "mus-5", "mus-6"], // Constantin, Théo, Marie, Thomas
    responsableId: "mus-1", // Constantin est le responsable de cette prestation
    formation: "Quartet",
    dressCode: "Costume sombre / Robe de soirée chic & chaussures de scène noires",
    materielMissions: "Constantin apporte la console numérique Yamaha. Théo gère la liaison In-Ear Sennheiser.",
    remarquesProduction: "Cocktail en extérieur de 16h30 à 19h. Repas et soirée dansante sous le tivoli.",
    demandesSpeciales: "Morceau d'ouverture de bal demandé par les mariés : 'L-O-V-E' (Nat King Cole) tempo modéré.",
    status: "confirme",
    syncInfo: {
      externalId: "gcal_event_20260815_cassis",
      source: "gcal",
      lastSyncedAt: "2026-08-01T10:00:00Z",
    },
    updatedAt: "2026-08-02T14:30:00Z",
    updatedBy: "Julia Fabre",
  },
  {
    id: "prest-2",
    titre: "Soirée Domaine Viticole",
    date: "2026-08-22",
    heureArrivee: "17:30",
    heureDebut: "19:00",
    heureFin: "23:30",
    lieu: "Domaine de la Bégude",
    adresse: "Route des Campans, 83330 du Castellet",
    infosLieu: "Scène installée sur la terrasse haute face aux vignes. Prise 32A disponible sur scène.",
    musicianIds: ["mus-2", "mus-5"], // Théo, Marie
    responsableId: "mus-2", // Théo est responsable de cette prestation
    formation: "Duo",
    dressCode: "Style décontracté chic (Tons neutres, lin ou costume bleu méditerranéen)",
    materielMissions: "Kit sono compact Duo + 2 micros HF Shure",
    remarquesProduction: "Ambiance Lounge Pop / Acoustic pour les invités du domaine.",
    demandesSpeciales: "Reprise acoustique de 'Fly Me to the Moon' pendant la dégustation.",
    status: "confirme",
    syncInfo: {
      externalId: "prod_tool_8849",
      source: "production_tool",
      lastSyncedAt: "2026-08-05T09:15:00Z",
    },
    updatedAt: "2026-08-05T09:15:00Z",
    updatedBy: "Sergio Rossi",
  },
  {
    id: "prest-3",
    titre: "Gala Privé Corporate",
    date: "2026-09-05",
    heureArrivee: "16:00",
    heureDebut: "18:00",
    heureFin: "00:00",
    lieu: "Hôtel InterContinental Hotel Dieu",
    adresse: "1 Place Daviel, 13002 Marseille",
    infosLieu: "Accès quai de déchargement par la rue de la Prison. Pass d'accès exigé par la sécurité.",
    musicianIds: ["mus-1", "mus-2", "mus-5"], // Constantin, Théo, Marie
    responsableId: "mus-1",
    formation: "Trio",
    dressCode: "Tenue de gala noire (Smoking ou costume noir, chemise blanche, nœud papillon)",
    materielMissions: "Backline complet fourni sur place par la régie hôtel. Prévoir uniquement vos instruments personnels.",
    remarquesProduction: "Prestation haut de gamme. Test son strict à 16h45 précises.",
    demandesSpeciales: "Pas de demandes particulières client à ce jour.",
    status: "option",
    syncInfo: {
      source: "manual",
    },
    updatedAt: "2026-08-08T11:00:00Z",
  },
];
