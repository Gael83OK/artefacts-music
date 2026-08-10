"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/lib/auth-service";
import { getUserRoleLabel } from "@/lib/mock-users";
import { SpaceSwitcher } from "@/components/auth/SpaceSwitcher";
import { prestationService } from "@/lib/prestation-service";
import { repetitionService } from "@/lib/repetition-service";
import { chatService } from "@/lib/chat-service";
import { notificationService } from "@/lib/notification-service";
import { DashboardInteractiveGrid } from "@/components/home/DashboardInteractiveGrid";
import {
  Calendar,
  MessageSquare,
  Navigation,
  ArrowRight,
  Clock,
  MapPin,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, isHybridProduction, activeSpace } = useAuth();
  const profiles = authService.getAvailableProfiles();

  const nowStr = new Date().toISOString().split("T")[0];

  // 1. Détermination automatique de la PROCHAINE PRESTATION
  const userPrestations = user
    ? prestationService.getByMusicianId(user.id).filter((p) => p.date >= nowStr)
    : [];

  userPrestations.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const nextPrestation = userPrestations.length > 0 ? userPrestations[0] : null;

  // 2. Chat de la prochaine prestation
  const nextChatUnreadCount =
    user && nextPrestation
      ? chatService.getUnreadCount(nextPrestation.id, user.id)
      : 0;

  // 3. Trois prochaines dates (Prestations & Répétitions futures)
  const otherPrestations = userPrestations.slice(1);
  const userRehearsals = repetitionService
    .getAll()
    .filter((r) => r.date >= nowStr)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Combinaison des événements
  const combinedUpcomingEvents = [
    ...otherPrestations.map((p) => ({
      id: p.id,
      type: "prestation" as const,
      date: p.date,
      time: p.heureDebut,
      lieu: p.lieu,
      title: p.titre,
      targetUrl: `/evenement/${p.id}`,
    })),
    ...userRehearsals.map((r) => ({
      id: r.id,
      type: "repetition" as const,
      date: r.date,
      time: r.heureDebut,
      lieu: r.lieu,
      title: r.titre,
      targetUrl: `/repetitions/${r.id}`,
    })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const threeNextDates = combinedUpcomingEvents.slice(0, 3);

  // 4. Notifications récentes (3 dernières notifications)
  const recentNotifications = user
    ? notificationService.getNotifications(user.id).slice(0, 3)
    : [];

  const handleProfileClick = (profileId: string, isFirstLogin: boolean) => {
    if (isAuthenticated && user?.id === profileId) {
      router.push("/profil");
      return;
    }

    if (isFirstLogin) {
      router.push(`/auth/premiere-connexion?userId=${profileId}`);
    } else {
      router.push(`/auth/connexion?userId=${profileId}`);
    }
  };

  return (
    <div className="space-y-5 max-w-3xl mx-auto pb-6">
      {/* 1. EN-TÊTE ET ENCADRÉ PROFIL (Zone d'identification) */}
      <div className="space-y-3.5">
        <PageHeader
          title={user ? `Bonjour ${user.prenom}` : "Bienvenue sur Artefacts Music"}
          subtitle="Votre tableau de bord mobile — Prochaines dates, chat et accès rapides."
          badge={<Badge variant="mediterranean">Artefacts Music</Badge>}
        />

        {/* Encadré Profil discret et cliquable */}
        {isAuthenticated && user ? (
          <Card
            interactive
            onClick={() => router.push("/profil")}
            className="p-3.5 sm:p-4 bg-gradient-to-r from-mediterranean-500 via-mediterranean-600 to-violet-600 text-white border-none shadow-md rounded-2xl"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar
                  name={`${user.prenom} ${user.nom}`}
                  size="md"
                  status="online"
                  className="ring-2 ring-white/40 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-white truncate">
                      {user.prenom} {user.nom}
                    </h3>
                  </div>
                  <p className="text-[11px] text-white/85 truncate font-medium">
                    {getUserRoleLabel(user)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-md hidden sm:inline">
                  Mon Profil
                </span>
                <ArrowRight className="h-4 w-4 text-white" />
              </div>
            </div>
          </Card>
        ) : (
          /* Sélecteur de profil moderne et tactile si non connecté */
          <Card className="p-4 sm:p-5 border-slate-200/90 rounded-3xl space-y-3 bg-white shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Sélectionnez votre profil pour accéder à votre espace :</span>
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {profiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleProfileClick(p.id, p.isFirstLogin)}
                  className="p-2.5 bg-slate-50/90 hover:bg-mediterranean-50/70 border border-slate-200/90 hover:border-mediterranean-300 rounded-2xl text-left transition-all duration-150 active:scale-[0.98] flex items-center justify-between gap-2.5 group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar name={`${p.prenom} ${p.nom}`} size="sm" />
                    <div className="min-w-0">
                      <div className="font-extrabold text-xs text-slate-900 group-hover:text-mediterranean-700 truncate">
                        {p.prenom} {p.nom}
                      </div>
                      <div className="text-[10px] text-slate-500 font-semibold truncate">
                        {getUserRoleLabel(p)}
                      </div>
                    </div>
                  </div>

                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-mediterranean-600 shrink-0" />
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Si utilisateur hybride : sélecteur d'espace */}
        {isHybridProduction && (
          <div className="p-2.5 bg-violet-50/70 rounded-2xl border border-violet-200/80 flex items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-slate-700 text-[11px]">
              Mode actif : <strong className="text-violet-700 uppercase">{activeSpace === "production" ? "Espace Production" : "Espace Musicien"}</strong>
            </span>
            <SpaceSwitcher />
          </div>
        )}
      </div>

      {/* 2. PROCHAINE PRESTATION (Information principale utile) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
            Prochaine prestation
          </span>
          {nextPrestation && (
            <Link
              href={`/evenement/${nextPrestation.id}`}
              className="text-xs font-extrabold text-mediterranean-600 hover:underline flex items-center gap-1"
            >
              <span>Détails</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {nextPrestation ? (
          <Card className="p-4 sm:p-5 border-mediterranean-300/80 bg-gradient-to-br from-slate-900 via-mediterranean-950 to-slate-900 text-white shadow-lg space-y-3.5 rounded-3xl">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-mediterranean-500/30 text-mediterranean-200 border border-mediterranean-400/40">
                    📅 {nextPrestation.date}
                  </span>
                  {nextPrestation.formation && (
                    <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-violet-500/30 text-violet-200 border border-violet-400/40">
                      Formation {nextPrestation.formation}
                    </span>
                  )}
                </div>

                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight pt-1">
                  {nextPrestation.titre}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-medium pt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-mediterranean-400" />
                    <span>Jeu : <strong className="text-white font-bold">{nextPrestation.heureDebut}</strong></span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-rose-400" />
                    <span className="text-white font-bold truncate max-w-[180px]">{nextPrestation.lieu}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Actions rapides : Voir prestation, GPS et Chat */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2">
              <Link href={`/evenement/${nextPrestation.id}`} className="flex-1 min-w-[130px]">
                <Button variant="mediterranean" size="sm" className="w-full justify-center text-xs font-black rounded-xl h-9">
                  Voir la prestation
                </Button>
              </Link>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  nextPrestation.adresse || nextPrestation.lieu
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/30 h-9 text-xs font-black rounded-xl"
                  icon={<Navigation className="h-3.5 w-3.5 text-mediterranean-300" />}
                >
                  GPS
                </Button>
              </a>

              <Link href={`/evenement/${nextPrestation.id}/chat`}>
                <Button
                  variant="violet"
                  size="sm"
                  className="h-9 text-xs font-black rounded-xl relative gap-1.5"
                  icon={<MessageSquare className="h-3.5 w-3.5" />}
                >
                  <span>Chat</span>
                  {nextChatUnreadCount > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.2 bg-rose-500 text-white text-[10px] font-extrabold rounded-full">
                      {nextChatUnreadCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <Card className="p-5 text-center border-dashed bg-white">
            <Calendar className="h-7 w-7 text-slate-400 mx-auto mb-1.5" />
            <p className="text-xs font-black text-slate-900">
              Aucune prochaine prestation programmée.
            </p>
          </Card>
        )}
      </div>

      {/* 3. GRILLE INTERACTIVE ET DIVULGATION PROGRESSIVE */}
      <DashboardInteractiveGrid
        threeNextDates={threeNextDates}
        nextPrestation={nextPrestation}
        nextChatUnreadCount={nextChatUnreadCount}
        recentNotifications={recentNotifications}
      />
    </div>
  );
}