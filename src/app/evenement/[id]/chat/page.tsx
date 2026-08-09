"use client";

import React, { useState, useEffect, use, useRef } from "react";
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
  Lock,
  Calendar,
  MapPin,
  FileText,
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
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

    chatService.sendMessage(prestation.id, inputText, user);
    setInputText("");
    setMessages(chatService.getMessages(prestation.id, user));
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between">
        <Link href={`/evenement/${prestation.id}`}>
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="h-4 w-4" />}>
            Voir la prestation
          </Button>
        </Link>

        <Badge variant="mediterranean">
          📅 {prestation.date} • {prestation.lieu}
        </Badge>
      </div>

      <PageHeader
        title={`Chat — ${prestation.titre}`}
        subtitle="Discussion d'organisation réservée à l'équipe de scène"
        badge={<Badge variant="violet">Organisation Prestation</Badge>}
      />

      {/* Fenêtre des Messages */}
      <Card className="flex-1 p-4 overflow-y-auto space-y-3 border-mediterranean-200 bg-slate-50/70">
        {messages.length === 0 ? (
          <div className="py-12 text-center space-y-1">
            <MessageSquare className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-900">Aucun message pour le moment.</p>
            <p className="text-xs text-slate-500">
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
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs space-y-1 shadow-sm ${
                    isMe
                      ? "bg-violet-600 text-white rounded-tr-none"
                      : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 text-[10px] opacity-80">
                    <span className="font-bold">{isMe ? "Vous" : msg.authorName}</span>
                    <span>{timeStr}</span>
                  </div>

                  <p className="leading-relaxed break-words font-medium text-sm">
                    {msg.content}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </Card>

      {/* Barre d'envoi en bas */}
      <form onSubmit={handleSend} className="flex items-center gap-2 pt-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Écrire un message..."
          className="flex-1 h-12 px-4 text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-mediterranean-500/30 shadow-sm"
        />
        <Button
          type="submit"
          variant="mediterranean"
          size="md"
          disabled={!inputText.trim()}
          icon={<Send className="h-4 w-4" />}
          className="h-12 rounded-2xl"
        >
          Envoyer
        </Button>
      </form>
    </div>
  );
}
