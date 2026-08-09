/**
 * Modèle de données Chat Privé par Prestation — Artefacts Music (Prompt 011)
 */

export interface ChatMessage {
  id: string;
  prestationId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string; // Timestamp ISO (ex: "2026-08-14T10:15:00Z")
  unreadBy?: string[]; // Identifiants des utilisateurs n'ayant pas encore lu ce message
}
