"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { chatService } from "@/lib/chat-service";
import { ChatMessage } from "@/types/chat";
import { Prestation } from "@/types/prestation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/context/AuthContext";
import {
  MessageSquare,
  Send,
  Lock,
  Trash2,
  Maximize2,
  Sparkles,
} from "lucide-react";

interface PrestationChatCardProps {
  prestation: Prestation;
}

export function PrestationChatCard({ prestation }: PrestationChatCardProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const hasAccess = chatService.canAccessChat(prestation.id, user);

  const loadMessages = React.useCallback(() => {
    if (hasAccess && user) {
      setMessages(chatService.getMessages(prestation.id, user));
      chatService.markAsRead(prestation.id, user.id);
    }
  }, [prestation.id, user, hasAccess]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!hasAccess) {
    return (
      <Card className="p-5 border-dashed border-slate-300 bg-slate-50/60 text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Lock className="h-4 w-4 text-slate-400" />
          <span>Discussion Privée de Prestation</span>
        </div>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Ce chat est réservé aux musiciens affectés et à l&apos;équipe de production de cette date.
        </p>
      </Card>
    );
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user) return;

    chatService.sendMessage(prestation.id, inputText, user);
    setInputText("");
    loadMessages();
  };

  const handleDelete = (msgId: string) => {
    if (!user) return;
    if (confirm("Voulez-vous vraiment supprimer ce message ?")) {
      chatService.deleteMessage(msgId, user);
      loadMessages();
    }
  };

  const isProduction = user?.role === "production" || user?.role === "hybrid_production";

  return (
    <Card className="p-5 sm:p-6 space-y-4 border-mediterranean-200">
      {/* En-tête du Chat */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Badge variant="mediterranean">Discussion Privée</Badge>
            <span className="text-[11px] font-semibold text-slate-500">
              {messages.length} message{messages.length > 1 ? "s" : ""}
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-mediterranean-600" />
            <span>Chat — {prestation.titre}</span>
          </h3>
        </div>

        <Link href={`/evenement/${prestation.id}/chat`}>
          <Button
            variant="outline"
            size="sm"
            icon={<Maximize2 className="h-3.5 w-3.5" />}
          >
            Plein écran
          </Button>
        </Link>
      </div>

      {/* Fenêtre des messages (Ordre chronologique, scrollable) */}
      <div className="space-y-3 max-h-80 overflow-y-auto p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80">
        {messages.length === 0 ? (
          <div className="py-8 text-center space-y-1">
            <p className="text-xs font-bold text-slate-700">Aucun message pour le moment.</p>
            <p className="text-[11px] text-slate-500">
              Utilisez cet espace pour organiser la prestation.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = user?.id === msg.authorId;
            const timeStr = new Date(msg.createdAt).toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                {!isMe && (
                  <Avatar name={msg.authorName} size="sm" className="mt-1 shrink-0" />
                )}

                <div
                  className={`max-w-[80%] rounded-2xl p-3 text-xs space-y-1 shadow-sm ${
                    isMe
                      ? "bg-violet-600 text-white rounded-tr-none"
                      : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 text-[10px] opacity-80">
                    <span className="font-bold">{isMe ? "Vous" : msg.authorName}</span>
                    <span>{timeStr}</span>
                  </div>

                  <p className="leading-relaxed break-words font-medium">{msg.content}</p>

                  {/* Option de suppression pour la production */}
                  {isProduction && (
                    <div className="pt-1 text-right">
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className={`text-[10px] hover:underline ${
                          isMe ? "text-violet-200" : "text-slate-400 hover:text-rose-600"
                        }`}
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Formulaire de saisie d'un message */}
      <form onSubmit={handleSend} className="flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Écrire un message..."
          className="flex-1 h-10 px-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-mediterranean-500/30"
        />
        <Button
          type="submit"
          variant="mediterranean"
          size="sm"
          disabled={!inputText.trim()}
          icon={<Send className="h-4 w-4" />}
        >
          Envoyer
        </Button>
      </form>
    </Card>
  );
}
