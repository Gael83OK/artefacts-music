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
            className="p-4 sm:p-5 bg-gradient-to-r from-mediterranean-600 via-mediterranean-500 to-violet-600 text-white border-none shadow-glass-elevated rounded-2xl relative overflow-hidden group"
          >
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
            <div className="flex items-center justify-between gap-3 relative z-10">
              <div className="flex items-center gap-3.5 min-w-0">
                <Avatar
                  name={`${user.prenom} ${user.nom}`}
                  size="md"
                  status="online"
                  className="ring-2 ring-white/50 shadow-md shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white truncate tracking-tight">
                      {user.prenom} {user.nom}
                    </h3>
                  </div>
                  <p className="text-xs text-white/90 truncate font-semibold flex items-center gap-1.5 pt-0.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse shrink-0" />
                    <span>{getUserRoleLabel(user)}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-black px-3 py-1.5 rounded-full bg-white/20 text-white backdrop-blur-md border border-white/30 hidden sm:inline shadow-sm">
                  Mon Profil
                </span>
                <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </Card>
        ) : (
          /* Sélecteur de profil moderne et tactile si non connecté */
          <Card className="p-4 sm:p-5 border-slate-200/90 rounded-3xl space-y-3 bg-white/90 backdrop-blur-xl shadow-glass">
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
                  className="p-3 bg-slate-50/90 hover:bg-mediterranean-50/80 border border-slate-200/90 hover:border-mediterranean-300 rounded-2xl text-left transition-all duration-200 active:scale-[0.98] flex items-center justify-between gap-2.5 group shadow-sm hover:shadow-card"
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

                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-mediterranean-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Si utilisateur hybride : sélecteur d'espace */}
        {isHybridProduction && (
          <div className="p-3 bg-violet-50/80 backdrop-blur-md rounded-2xl border border-violet-200/90 flex items-center justify-between gap-3 text-xs shadow-sm">
            <span className="font-semibold text-slate-700 text-xs">
              Mode actif : <strong className="text-violet-700 uppercase font-black">{activeSpace === "production" ? "Espace Production" : "Espace Musicien"}</strong>
            </span>
            <SpaceSwitcher />
          </div>
        )}
      </div>

      {/* 2. PROCHAINE PRESTATION (Information principale utile) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-mediterranean-500 animate-pulse" />
            Prochaine prestation
          </span>
          {nextPrestation && (
            <Link
              href={`/evenement/${nextPrestation.id}`}
              className="text-xs font-extrabold text-mediterranean-600 hover:text-mediterranean-700 flex items-center gap-1 transition-colors"
            >
              <span>Fiche complète</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {nextPrestation ? (
          <Card className="p-5 sm:p-6 border-white/20 bg-stage-gradient text-white shadow-glow-lg space-y-4 rounded-3xl relative overflow-hidden">
            {/* Effet de reflet lumineux en arrière-plan */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-mediterranean-400/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 text-xs font-extrabold rounded-full bg-white/15 text-white border border-white/25 backdrop-blur-md flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-mediterranean-300" />
                    <span>{nextPrestation.date}</span>
                  </span>
                  {nextPrestation.formation && (
                    <span className="px-3 py-1 text-xs font-extrabold rounded-full bg-violet-500/30 text-violet-200 border border-violet-400/40 backdrop-blur-md">
                      Formation {nextPrestation.formation}
                    </span>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight pt-1 leading-tight">
                  {nextPrestation.titre}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-200 font-semibold pt-1">
                  <span className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/10">
                    <Clock className="h-4 w-4 text-mediterranean-300" />
                    <span>Jeu : <strong className="text-white font-extrabold">{nextPrestation.heureDebut}</strong></span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/10">
                    <MapPin className="h-4 w-4 text-rose-400" />
                    <span className="text-white font-extrabold truncate max-w-[200px]">{nextPrestation.lieu}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Actions rapides : Voir prestation, GPS et Chat */}
            <div className="pt-4 border-t border-white/15 flex flex-wrap items-center gap-2.5 relative z-10">
              <Link href={`/evenement/${nextPrestation.id}`} className="flex-1 min-w-[140px]">
                <Button variant="white" size="md" className="w-full justify-center text-xs font-black rounded-xl">
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
                  variant="glass"
                  size="md"
                  className="h-10 text-xs font-black rounded-xl border-white/20"
                  icon={<Navigation className="h-4 w-4 text-mediterranean-300" />}
                >
                  GPS
                </Button>
              </a>

              <Link href={`/evenement/${nextPrestation.id}/chat`}>
                <Button
                  variant="violet"
                  size="md"
                  className="h-10 text-xs font-black rounded-xl relative gap-1.5 shadow-glow-violet"
                  icon={<MessageSquare className="h-4 w-4" />}
                >
                  <span>Chat</span>
                  {nextChatUnreadCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 bg-rose-500 text-white text-[10px] font-black rounded-full ring-2 ring-white/50">
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