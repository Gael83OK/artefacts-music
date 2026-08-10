"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
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
  Maximize2,
  Trash2,
  CheckCheck,
} from "lucide-react";

interface PrestationChatCardProps {
  prestation: Prestation;
}

export function PrestationChatCard({ prestation }: PrestationChatCardProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isInitialScrollDone = useRef(false);

  const hasAccess = chatService.canAccessChat(prestation.id, user);

  const loadMessages = React.useCallback(() => {
    if (hasAccess && user) {
      const fetched = chatService.getMessages(prestation.id, user);
      setMessages(fetched);
      chatService.markAsRead(prestation.id, user.id);
    }
  }, [prestation.id, user, hasAccess]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Scroll automatique en bas à l'ouverture (immédiat) puis lors d'un nouveau message (fluide)
  useLayoutEffect(() => {
    if (messages.length > 0 && scrollContainerRef.current) {
      if (!isInitialScrollDone.current) {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        isInitialScrollDone.current = true;
      } else {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages]);

  if (!hasAccess) {
    return (
      <Card className="p-5 border-dashed border-slate-300 bg-slate-50/60 text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-xs font-extrabold text-slate-700 uppercase tracking-wider">
          <Lock className="h-4 w-4 text-slate-400" />
          <span>Discussion Privée de Prestation</span>
        </div>
        <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
          Ce chat est réservé aux musiciens affectés et à l&apos;équipe de production de cette date.
        </p>
      </Card>
    );
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user) return;

    const sent = chatService.sendMessage(prestation.id, inputText, user);
    if (sent) {
      setInputText("");
      loadMessages();
      // Garder le focus sur le champ de saisie
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
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
    <Card className="p-4 sm:p-5 space-y-3.5 border-violet-200/90 rounded-3xl shadow-lg bg-white">
      {/* En-tête du Chat */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white flex items-center justify-center shadow-sm">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-900 tracking-tight">
                Chat — {prestation.titre}
              </h3>
              <Badge variant="violet" size="sm">
                {messages.length} message{messages.length > 1 ? "s" : ""}
              </Badge>
            </div>
            <p className="text-[10px] text-slate-500 font-semibold">
              Fil de discussion en direct
            </p>
          </div>
        </div>

        <Link href={`/evenement/${prestation.id}/chat`}>
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-extrabold rounded-xl"
            icon={<Maximize2 className="h-3.5 w-3.5" />}
          >
            Plein écran
          </Button>
        </Link>
      </div>

      {/* Fenêtre des messages (Ordre chronologique : plus ancien en haut, plus récent en bas) */}
      <div
        ref={scrollContainerRef}
        className="space-y-3 max-h-80 min-h-[180px] overflow-y-auto p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/80 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="py-10 text-center space-y-1.5">
            <div className="h-10 w-10 bg-slate-200/60 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <MessageSquare className="h-5 w-5" />
            </div>
            <p className="text-xs font-black text-slate-800">Aucun message pour le moment.</p>
            <p className="text-[11px] text-slate-500 font-medium max-w-xs mx-auto">
              Envoyez un premier message pour organiser la prestation avec l&apos;équipe.
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
                className={`flex items-end gap-2 ${
                  isMe ? "justify-end" : "justify-start"
                } animate-fade-in`}
              >
                {!isMe && (
                  <Avatar name={msg.authorName} size="sm" className="mb-0.5 shrink-0" />
                )}

                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs space-y-1 shadow-sm transition-all ${
                    isMe
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-xs"
                      : "bg-white text-slate-900 border border-slate-200/90 rounded-bl-xs"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 text-[10px] opacity-80">
                    <span className="font-extrabold">{isMe ? "Vous" : msg.authorName}</span>
                    <span className="flex items-center gap-1">
                      <span>{timeStr}</span>
                      {isMe && <CheckCheck className="h-3 w-3 text-violet-200 inline" />}
                    </span>
                  </div>

                  <p className="leading-relaxed break-words font-semibold text-xs">{msg.content}</p>

                  {/* Option de suppression pour la production */}
                  {isProduction && (
                    <div className="pt-0.5 text-right">
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className={`text-[10px] font-bold hover:underline ${
                          isMe ? "text-violet-200 hover:text-white" : "text-slate-400 hover:text-rose-600"
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
      <form onSubmit={handleSend} className="flex items-center gap-2 pt-1">
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Écrire un message..."
          className="flex-1 h-11 min-h-[44px] px-4 text-xs sm:text-sm bg-slate-50 border border-slate-200/90 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all font-medium"
        />
        <Button
          type="submit"
          variant="violet"
          size="md"
          disabled={!inputText.trim()}
          icon={<Send className="h-4 w-4" />}
          className="h-11 min-h-[44px] rounded-2xl font-black px-4 shrink-0"
        >
          Envoyer
        </Button>
      </form>
    </Card>
  );
}
