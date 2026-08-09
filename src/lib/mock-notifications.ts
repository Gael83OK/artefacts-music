import { AppNotification, NotificationSettings } from "@/types/notification";

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  notifyPrestationModifications: true,
  notifyPrestationReminder24h: true,
  notifyChatMessage: true,
};

export const INITIAL_MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-101",
    userId: "mus-1", // Constantin Lau
    type: "prestation_modification",
    title: "Modification de votre prestation du 15 août",
    message: "L'heure d'arrivée a été modifiée : 17h00 → 18h00 au Château de Cassis.",
    prestationId: "prest-1",
    targetUrl: "/evenement/prest-1",
    isRead: false,
    createdAt: "2026-08-10T09:30:00Z",
  },
  {
    id: "notif-102",
    userId: "mus-1",
    type: "prestation_reminder_24h",
    title: "Demain : Prestation Mariage Émilie & Marc",
    message: "Rappel J-1 : Arrivée prévue à 18h00 au Château de Cassis. Pensez à vérifier votre matériel logistique.",
    prestationId: "prest-1",
    targetUrl: "/evenement/prest-1",
    isRead: false,
    createdAt: "2026-08-14T08:00:00Z",
  },
  {
    id: "notif-103",
    userId: "mus-2", // Théo Lombard
    type: "prestation_assignment",
    title: "Nouvelle prestation attribuée",
    message: "Vous êtes prévu pour la prestation du 15 août à Cassis (Formation Quartet).",
    prestationId: "prest-1",
    targetUrl: "/evenement/prest-1",
    isRead: true,
    createdAt: "2026-08-01T10:00:00Z",
  },
  {
    id: "notif-104",
    userId: "mus-5", // Marie Delacroix
    type: "chat_message",
    title: "Nouveau message dans le chat du Mariage Cassis",
    message: "Théo Lombard : 'J'ai aussi importé le fichier HTML iReal Pro dans la setlist.'",
    prestationId: "prest-1",
    targetUrl: "/evenement/prest-1/chat",
    isRead: false,
    createdAt: "2026-08-10T14:32:00Z",
  },
];
