/**
 * Modèle de données Centre de Notifications — Artefacts Music (Prompt 012)
 */

export type NotificationType =
  | "prestation_modification"
  | "prestation_assignment"
  | "prestation_reminder_24h"
  | "chat_message";

export interface NotificationSettings {
  notifyPrestationModifications: boolean; // default true
  notifyPrestationReminder24h: boolean; // default true
  notifyChatMessage: boolean; // default true
}

export interface AppNotification {
  id: string;
  userId: string; // Destinataire individuel strict
  type: NotificationType;
  title: string;
  message: string;
  prestationId?: string;
  targetUrl?: string; // Lien cliquable (ex: /evenement/prest-1 ou /evenement/prest-1/chat)
  isRead: boolean;
  createdAt: string; // Timestamp ISO
}
