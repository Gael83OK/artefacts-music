import { AdminDocument, IntermittenceProfile } from "@/types/administratif";

export const INITIAL_INTERMITTENCE_PROFILES: IntermittenceProfile[] = [
  {
    userId: "mus-1", // Constantin
    dateAnniversaire: "2026-09-15",
    cachetBrutParDefaut: 220,
  },
  {
    userId: "mus-2", // Théo
    dateAnniversaire: "2026-10-01",
    cachetBrutParDefaut: 220,
  },
  {
    userId: "mus-3", // Julia
    dateAnniversaire: "2026-06-01",
    cachetBrutParDefaut: 250,
  },
  {
    userId: "mus-4", // Sergio
    dateAnniversaire: "2026-07-15",
    cachetBrutParDefaut: 250,
  },
  {
    userId: "mus-5", // Marie
    dateAnniversaire: "2026-09-01",
    cachetBrutParDefaut: 200,
  },
  {
    userId: "mus-6", // Thomas
    dateAnniversaire: "2026-11-15",
    cachetBrutParDefaut: 200,
  },
];

export const INITIAL_ADMIN_DOCUMENTS: AdminDocument[] = [
  // Documents Constantin (mus-1)
  {
    id: "doc-101",
    userId: "mus-1",
    nom: "Bulletin_de_Paie_Juillet_2026.pdf",
    categorie: "fiches_de_paie",
    date: "2026-07-31",
    periode: "Juillet 2026",
    taille: "320 KB",
    fileUrl: "#",
  },
  {
    id: "doc-102",
    userId: "mus-1",
    nom: "AEM_Juillet_2026_Mariage_Chateau.pdf",
    categorie: "aem",
    date: "2026-07-31",
    periode: "Juillet 2026",
    taille: "180 KB",
    fileUrl: "#",
  },
  {
    id: "doc-103",
    userId: "mus-1",
    nom: "Attestation_Conges_Spectacle_2025_2026.pdf",
    categorie: "conges_spectacle",
    date: "2026-04-15",
    periode: "Année 2025-2026",
    taille: "540 KB",
    fileUrl: "#",
  },

  // Documents Théo (mus-2)
  {
    id: "doc-201",
    userId: "mus-2",
    nom: "Bulletin_de_Paie_Juillet_2026.pdf",
    categorie: "fiches_de_paie",
    date: "2026-07-31",
    periode: "Juillet 2026",
    taille: "310 KB",
    fileUrl: "#",
  },
  {
    id: "doc-202",
    userId: "mus-2",
    nom: "AEM_Domaine_Bégude_Août_2026.pdf",
    categorie: "aem",
    date: "2026-08-01",
    periode: "Août 2026",
    taille: "190 KB",
    fileUrl: "#",
  },

  // Documents Marie (mus-5)
  {
    id: "doc-501",
    userId: "mus-5",
    nom: "Bulletin_de_Paie_Juin_2026.pdf",
    categorie: "fiches_de_paie",
    date: "2026-06-30",
    periode: "Juin 2026",
    taille: "295 KB",
    fileUrl: "#",
  },
  {
    id: "doc-502",
    userId: "mus-5",
    nom: "Attestation_Conges_Spectacle_Marie.pdf",
    categorie: "conges_spectacle",
    date: "2026-05-10",
    periode: "Année 2025-2026",
    taille: "410 KB",
    fileUrl: "#",
  },

  // Documents Thomas (mus-6)
  {
    id: "doc-601",
    userId: "mus-6",
    nom: "Bulletin_de_Paie_Juin_2026.pdf",
    categorie: "fiches_de_paie",
    date: "2026-06-30",
    periode: "Juin 2026",
    taille: "305 KB",
    fileUrl: "#",
  },
];
