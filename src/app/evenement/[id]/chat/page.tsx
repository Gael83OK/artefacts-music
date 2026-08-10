"use client";

import React, { useState, useEffect, use, useRef, useLayoutEffect } from "react";
import Link from "next/link";
import { prestationService } from "@/lib/prestation-service";
import { chatService } from "@/lib/chat-service";
import { Prestation } from "@/types/prestation";
import { ChatMessage } from "@/types/chat";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { AccessDeniedCard } from "@/components/ui/AccessDeniedCard";
import { useAuth } from "@/context/AuthContext";

import {
  ArrowLeft,
  MessageSquare,
  Send,
  CheckCheck,
} from "lucide-react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PrestationChatPage({ params }: PageProps) {
  const { id } = use(params);
  const { user } = useAuth();

  const [prestation, setPrestation] = useState<Prestation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isInitialScrollDone = useRef(false);

  useEffect(() => {
    const p = prestationService.getById(id);
    if (p) {
      setPrestation(p);
      if (user && chatService.canAccessChat(p.id, user)) {
        setMessages(chatService.getMessages(p.id, user));
        chatService.markAsRead(p.id, user.id);
      }
    }
  }, [id, user]);

  // Arrivée naturelle en bas de la conversation à l'ouverture, puis scroll fluide pour nouveaux messages
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

  if (!prestation) {
    return (
      <div className="space-y-6 text-center py-12">
        <h2 className="text-xl font-bold text-slate-900">Prestation introuvable</h2>
        <Link href="/calendrier">
          <Button variant="mediterranean" icon={<ArrowLeft className="h-4 w-4" />}>
            Retour au calendrier
          </Button>
        </Link>
      </div>
    );
  }

  const hasAccess = chatService.canAccessChat(prestation.id, user);

  if (!hasAccess) {
    return <AccessDeniedCard />;
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user) return;

    const sent = chatService.sendMessage(prestation.id, inputText, user);
    if (sent) {
      setInputText("");
      setMessages(chatService.getMessages(prestation.id, user));
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto flex flex-col h-[calc(100vh-7.5rem)] pb-4">
      {/* Barre supérieure de retour */}
      <div className="flex items-center justify-between gap-2">
        <Link href={`/evenement/${prestation.id}`}>
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="h-4 w-4" />} className="text-xs font-extrabold">
            Voir la prestation
          </Button>
        </Link>

        <Badge variant="mediterranean" className="text-xs font-extrabold">
          📅 {prestation.date} • {prestation.lieu}
        </Badge>
      </div>

      <PageHeader
        title={`Chat — ${prestation.titre}`}
        subtitle="Discussion d'organisation réservée à l'équipe de scène"
        badge={<Badge variant="violet">Organisation Prestation</Badge>}
        className="mb-2 pb-2"
      />

      {/* Fenêtre des Messages (Plein écran scrollable, plus ancien en haut -> plus récent en bas) */}
      <Card className="flex-1 p-4 overflow-y-auto space-y-3.5 border-mediterranean-200/90 bg-slate-50/80 rounded-3xl shadow-lg relative flex flex-col justify-between">
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto space-y-3 pr-1">
          {messages.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <div className="h-12 w-12 bg-slate-200/60 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <MessageSquare className="h-6 w-6" />
              </div>
              <p className="text-sm font-black text-slate-900">Aucun message pour le moment.</p>
              <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto">
                Posez vos questions sur la setlist, la sonorisation ou l&apos;organisation.
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
                  className={`flex items-end gap-2.5 ${
                    isMe ? "justify-end" : "justify-start"
                  } animate-fade-in`}
                >
                  {!isMe && (
                    <Avatar name={msg.authorName} size="sm" className="mb-0.5 shrink-0" />
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs space-y-1 shadow-sm ${
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

                    <p className="leading-relaxed break-words font-semibold text-xs sm:text-sm">
                      {msg.content}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </Card>

      {/* Barre d'envoi en bas */}
      <form onSubmit={handleSend} className="flex items-center gap-2 pt-1">
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Écrire un message..."
          className="flex-1 h-12 min-h-[48px] px-4 text-xs sm:text-sm bg-white border border-slate-200/90 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 shadow-sm font-medium"
        />
        <Button
          type="submit"
          variant="violet"
          size="md"
          disabled={!inputText.trim()}
          icon={<Send className="h-4 w-4" />}
          className="h-12 min-h-[48px] rounded-2xl font-black px-5"
        >
          Envoyer
        </Button>
      </form>
    </div>
  );
}
