import { ChatMessage } from "@/types/chat";

export const INITIAL_MOCK_MESSAGES: ChatMessage[] = [
  {
    id: "msg-101",
    prestationId: "prest-1", // Mariage Émilie & Marc (Château de Cassis)
    authorId: "mus-1", // Constantin Lau
    authorName: "Constantin Lau",
    content: "Salut l'équipe ! Pour l'ouverture du cocktail, on valide bien L-O-V-E en duo piano/chant ?",
    createdAt: "2026-08-10T14:15:00Z",
    unreadBy: ["mus-2", "mus-5", "mus-6"],
  },
  {
    id: "msg-102",
    prestationId: "prest-1",
    authorId: "mus-2", // Théo Lombard
    authorName: "Théo Lombard",
    content: "Oui parfait ! J'ai aussi importé le fichier HTML iReal Pro dans la setlist.",
    createdAt: "2026-08-10T14:32:00Z",
    unreadBy: ["mus-5", "mus-6"],
  },
  {
    id: "msg-103",
    prestationId: "prest-1",
    authorId: "mus-5", // Marie Delacroix
    authorName: "Marie Delacroix",
    content: "Super ! J'ai bien noté l'entrée des mariés sur 'Ain't No Mountain High Enough'. À samedi !",
    createdAt: "2026-08-10T15:04:00Z",
    unreadBy: [],
  },
  {
    id: "msg-201",
    prestationId: "prest-2", // Domaine Viticole
    authorId: "mus-2", // Théo Lombard
    authorName: "Théo Lombard",
    content: "Hello ! Je m'occupe de passer récupérer le kit sono compact au studio d'Aix.",
    createdAt: "2026-08-11T09:30:00Z",
    unreadBy: ["mus-5"],
  },
];
