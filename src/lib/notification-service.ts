import { AppNotification, NotificationSettings, NotificationType } from "@/types/notification";
import { INITIAL_MOCK_NOTIFICATIONS, DEFAULT_NOTIFICATION_SETTINGS } from "./mock-notifications";

const NOTIFICATIONS_KEY = "artefacts_notifications_db";
const SETTINGS_KEY = "artefacts_notif_settings_db";
const MAX_VISIBLE_NOTIFICATIONS = 20; // Règle Prompt 012 : Limite des 20 éléments les plus récents

function getNotificationsFromStorage(): AppNotification[] {
  if (typeof window === "undefined") return INITIAL_MOCK_NOTIFICATIONS;
  const stored = localStorage.getItem(NOTIFICATIONS_KEY);
  if (!stored) {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(INITIAL_MOCK_NOTIFICATIONS));
    return INITIAL_MOCK_NOTIFICATIONS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_MOCK_NOTIFICATIONS;
  }
}

function saveNotificationsToStorage(items: AppNotification[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(items));
  }
}

function getSettingsFromStorage(userId: string): NotificationSettings {
  if (typeof window === "undefined") return DEFAULT_NOTIFICATION_SETTINGS;
  const stored = localStorage.getItem(`${SETTINGS_KEY}_${userId}`);
  if (!stored) return DEFAULT_NOTIFICATION_SETTINGS;
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
}

export const notificationService = {
  /** Récupère toutes les notifications */
  getAll(): AppNotification[] {
    return getNotificationsFromStorage();
  },

  /**

   * Récupère les notifications d'un utilisateur destinataire strict (Prompt 012)
   * Conserve au maximum les 20 plus récentes.
   */
  getNotifications(userId: string): AppNotification[] {
    const list = getNotificationsFromStorage();
    const userNotifs = list
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return userNotifs.slice(0, MAX_VISIBLE_NOTIFICATIONS);
  },

  /** Récupère le nombre de notifications non lues */
  getUnreadCount(userId: string): number {
    const userNotifs = this.getNotifications(userId);
    return userNotifs.filter((n) => !n.isRead).length;
  },

  /** Marque une notification comme lue */
  markAsRead(notificationId: string) {
    const list = getNotificationsFromStorage();
    const updated = list.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n));
    saveNotificationsToStorage(updated);
  },

  /** Marque toutes les notifications d'un utilisateur comme lues */
  markAllAsRead(userId: string) {
    const list = getNotificationsFromStorage();
    const updated = list.map((n) => (n.userId === userId ? { ...n, isRead: true } : n));
    saveNotificationsToStorage(updated);
  },

  /** Récupère les paramètres individuels de notification */
  getSettings(userId: string): NotificationSettings {
    return getSettingsFromStorage(userId);
  },

  /** Met à jour les paramètres de notification */
  updateSettings(userId: string, settings: NotificationSettings) {
    if (typeof window !== "undefined") {
      localStorage.setItem(`${SETTINGS_KEY}_${userId}`, JSON.stringify(settings));
    }
  },

  /** Génère une notification ciblée en vérifiant les préférences de l'utilisateur */
  createNotification(data: Omit<AppNotification, "id" | "isRead" | "createdAt">): AppNotification | null {
    const settings = this.getSettings(data.userId);

    // Vérification des préférences utilisateur (Prompt 012)
    if (data.type === "prestation_modification" && !settings.notifyPrestationModifications) return null;
    if (data.type === "prestation_reminder_24h" && !settings.notifyPrestationReminder24h) return null;
    if (data.type === "chat_message" && !settings.notifyChatMessage) return null;

    const newNotif: AppNotification = {
      ...data,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    const list = getNotificationsFromStorage();
    list.unshift(newNotif);

    // Appliquer la rétention max 20 éléments par utilisateur
    const userList = list.filter((n) => n.userId === data.userId);
    if (userList.length > MAX_VISIBLE_NOTIFICATIONS) {
      const oldestToKeep = userList[MAX_VISIBLE_NOTIFICATIONS - 1];
      const filtered = list.filter(
        (n) => n.userId !== data.userId || new Date(n.createdAt) >= new Date(oldestToKeep.createdAt)
      );
      saveNotificationsToStorage(filtered);
    } else {
      saveNotificationsToStorage(list);
    }

    return newNotif;
  },

  /** Notification lors de la modification importante d'une prestation */
  notifyPrestationModification(prestationId: string, targetUserIds: string[], title: string, message: string) {
    targetUserIds.forEach((uId) => {
      this.createNotification({
        userId: uId,
        type: "prestation_modification",
        title,
        message,
        prestationId,
        targetUrl: `/evenement/${prestationId}`,
      });
    });
  },

  /** Notification de nouveau message de chat */
  notifyChatMessage(prestationId: string, targetUserIds: string[], title: string, message: string) {
    targetUserIds.forEach((uId) => {
      this.createNotification({
        userId: uId,
        type: "chat_message",
        title,
        message,
        prestationId,
        targetUrl: `/evenement/${prestationId}/chat`,
      });
    });
  },
};
