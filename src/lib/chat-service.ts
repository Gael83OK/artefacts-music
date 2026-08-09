import { ChatMessage } from "@/types/chat";
import { AuthUser } from "@/types/auth";
import { prestationService } from "./prestation-service";
import { INITIAL_MOCK_MESSAGES } from "./mock-chat";

const STORAGE_KEY = "artefacts_chat_db";

function getMessagesFromStorage(): ChatMessage[] {
  if (typeof window === "undefined") return INITIAL_MOCK_MESSAGES;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_MESSAGES));
    return INITIAL_MOCK_MESSAGES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_MOCK_MESSAGES;
  }
}

function saveMessagesToStorage(messages: ChatMessage[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }
}

export const chatService = {
  /**
   * Vérifie les droits d'accès au chat privé d'une prestation (Prompt 011) :
   * - Musiciens affectés/convoqués
   * - Responsable de prestation
   * - Chargés de production (production & hybrid_production)
   */
  canAccessChat(prestationId: string, user: AuthUser | null): boolean {
    if (!user) return false;

    // La production et les profils hybrides ont accès à toutes les discussions d'organisation
    if (user.role === "production" || user.role === "hybrid_production") {
      return true;
    }

    const prestation = prestationService.getById(prestationId);
    if (!prestation) return false;

    // Est responsable de la prestation
    if (prestation.responsableId === user.id) return true;

    // Est l'un des musiciens confirmés/affectés
    if (prestation.musicianIds && prestation.musicianIds.includes(user.id)) return true;

    return false;
  },

  /** Récupère les messages d'un chat dans l'ordre chronologique */
  getMessages(prestationId: string, user: AuthUser | null): ChatMessage[] {
    if (!this.canAccessChat(prestationId, user)) return [];

    const messages = getMessagesFromStorage();
    return messages
      .filter((m) => m.prestationId === prestationId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },

  /** Envoie un message texte */
  sendMessage(prestationId: string, content: string, user: AuthUser): ChatMessage | null {
    if (!this.canAccessChat(prestationId, user)) return null;

    const prestation = prestationService.getById(prestationId);
    if (!prestation) return null;

    // Déterminer les destinataires pour le marquer comme non lu
    const recipients = new Set<string>();
    if (prestation.responsableId) recipients.add(prestation.responsableId);
    prestation.musicianIds?.forEach((mId) => recipients.add(mId));
    recipients.delete(user.id); // Ne pas marquer non lu pour l'auteur

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      prestationId,
      authorId: user.id,
      authorName: `${user.prenom} ${user.nom}`,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      unreadBy: Array.from(recipients),
    };

    const messages = getMessagesFromStorage();
    messages.push(newMessage);
    saveMessagesToStorage(messages);
    return newMessage;
  },

  /** Marque tous les messages d'un chat comme lus par un utilisateur */
  markAsRead(prestationId: string, userId: string) {
    const messages = getMessagesFromStorage();
    let updated = false;

    const updatedMessages = messages.map((msg) => {
      if (msg.prestationId === prestationId && msg.unreadBy?.includes(userId)) {
        updated = true;
        return {
          ...msg,
          unreadBy: msg.unreadBy.filter((id) => id !== userId),
        };
      }
      return msg;
    });

    if (updated) {
      saveMessagesToStorage(updatedMessages);
    }
  },

  /** Récupère le nombre de messages non lus pour un utilisateur sur une prestation */
  getUnreadCount(prestationId: string, userId: string): number {
    const messages = getMessagesFromStorage();
    return messages.filter(
      (m) => m.prestationId === prestationId && m.unreadBy?.includes(userId)
    ).length;
  },

  /** Suppression d'un message (réservée à la production) */
  deleteMessage(messageId: string, user: AuthUser): boolean {
    if (user.role !== "production" && user.role !== "hybrid_production") {
      return false;
    }

    const messages = getMessagesFromStorage();
    const filtered = messages.filter((m) => m.id !== messageId);
    if (filtered.length === messages.length) return false;

    saveMessagesToStorage(filtered);
    return true;
  },
};
