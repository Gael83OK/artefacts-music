import { MissionSpecifique, MaterielSpecifique } from "@/types/materiel";

export const INITIAL_MOCK_MATERIELS: MaterielSpecifique[] = [
  {
    id: "mat-101",
    nom: "Kit Sono RCF 2000W",
    categorie: "Son",
    quantite: 2,
    statut: "en_utilisation",
    prestationId: "prest-1", // Mariage Cassis
    responsableId: "mus-1", // Constantin
    depot: "Rognes",
    notes: "Console numérique Yamaha + 2 Enceintes RCF 715",
    actif: true,
  },
  {
    id: "mat-102",
    nom: "Liaison In-Ear Sennheiser EW-D",
    categorie: "Son",
    quantite: 4,
    statut: "en_utilisation",
    prestationId: "prest-1",
    responsableId: "mus-2", // Théo
    depot: "Rognes",
    notes: "4 boîtiers récepteurs In-Ear",
    actif: true,
  },
  {
    id: "mat-103",
    nom: "Kit Sono Compact Duo",
    categorie: "Son",
    quantite: 1,
    statut: "en_utilisation",
    prestationId: "prest-2", // Domaine Viticole
    responsableId: "mus-2", // Théo
    depot: "Rognes",
    notes: "Caisson actif + 2 satellites",
    actif: true,
  },
  {
    id: "mat-104",
    nom: "Console numérique Behringer X32",
    categorie: "Régie",
    quantite: 1,
    statut: "disponible",
    depot: "Rognes",
    notes: "Stocké au local de Rognes",
    actif: true,
  },
  {
    id: "mat-105",
    nom: "Micros HF Shure QLXD",
    categorie: "Son",
    quantite: 4,
    statut: "en_maintenance",
    depot: "Rognes",
    notes: "Changement de fréquence à effectuer",
    actif: true,
  },
  {
    id: "mat-106",
    nom: "Clavier Nord Stage 3",
    categorie: "Instruments",
    quantite: 1,
    statut: "disponible",
    depot: "Rognes",
    notes: "Avec stand et pédale de sustain",
    actif: true,
  },
];

export const INITIAL_MOCK_MISSIONS: MissionSpecifique[] = [
  {
    id: "miss-1",
    prestationId: "prest-1", // Mariage Émilie & Marc (Château de Cassis)
    titre: "Passer au local de Rognes",
    description: "Récupérer le kit sono RCF 2000W et la console Yamaha avant 14h00.",
    responsableId: "mus-1", // Constantin
    materielId: "mat-101",
    statut: "a_faire",
    updatedAt: "2026-08-02T14:30:00Z",
    updatedBy: "Julia Lounis",
  },
  {
    id: "miss-2",
    prestationId: "prest-1", // Mariage Émilie & Marc
    titre: "Récupérer la liaison In-Ear Sennheiser",
    description: "Vérifier la charge des batteries et les fréquences radio.",
    responsableId: "mus-2", // Théo
    materielId: "mat-102",
    statut: "a_faire",
    updatedAt: "2026-08-02T14:30:00Z",
    updatedBy: "Julia Lounis",
  },
  {
    id: "miss-3",
    prestationId: "prest-2", // Domaine Viticole
    titre: "Récupérer la sono compacte Duo",
    description: "Récupérer le kit compact au studio d'Aix-en-Provence.",
    responsableId: "mus-2", // Théo
    materielId: "mat-103",
    statut: "realise",
    updatedAt: "2026-08-05T09:15:00Z",
    updatedBy: "Théo Lounis",
  },
];
