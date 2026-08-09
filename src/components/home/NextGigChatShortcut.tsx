"use client";

import React from "react";
import Link from "next/link";
import { prestationService } from "@/lib/prestation-service";
import { chatService } from "@/lib/chat-service";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MessageSquare, ArrowRight, Calendar } from "lucide-react";

export function NextGigChatShortcut() {
  const { user } = useAuth();
  if (!user) return null;

  // Récupérer la prochaine prestation à venir pour cet utilisateur
  const userPrestations = prestationService.getByMusicianId(user.id);

  const now = new Date().toISOString().split("T")[0];

  const upcoming = userPrestations
    .filter((p) => p.date >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (upcoming.length === 0) return null;

  const nextGig = upcoming[0];
  const unreadCount = chatService.getUnreadCount(nextGig.id, user.id);

  const formattedDate = new Date(nextGig.date).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <Link href={`/evenement/${nextGig.id}/chat`} className="block">
      <Card interactive className="p-4 border-mediterranean-200 bg-gradient-to-r from-mediterranean-50/40 via-white to-white">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 bg-mediterranean-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
              <MessageSquare className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-bold text-slate-900">
                  Chat de la prochaine prestation
                </span>
                {unreadCount > 0 && (
                  <Badge variant="rose" size="sm">
                    {unreadCount} nouveau{unreadCount > 1 ? "x" : ""}
                  </Badge>
                )}
              </div>

              <div className="text-xs text-slate-500 truncate">
                💬 {nextGig.titre} • <span className="capitalize">{formattedDate}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold text-mediterranean-600 shrink-0">
            <span className="hidden sm:inline">Ouvrir la discussion</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
