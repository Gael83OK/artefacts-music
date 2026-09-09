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
    <div className="space-y-6 max-w-3xl mx-auto pb-8 relative">
      {/* Halo d'ambiance d'aquarelle Artefacts en arrière-plan */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-full max-w-2xl h-80 bg-gradient-to-r from-sky-300/20 via-pink-300/20 to-purple-400/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-subtle" />

      {/* 1. EN-TÊTE ET ENCADRÉ PROFIL (Zone d'identification) */}
      <div className="space-y-4">
        <PageHeader
          title={user ? `Bonjour ${user.prenom}` : "Bienvenue sur Artefacts Music"}
          subtitle="Votre application de gestion scénique — Prochaines dates, chat et logistique."
          badge={<Badge variant="mediterranean" pulse>Artefacts App</Badge>}
        />

        {/* Encadré Profil discret et cliquable */}
        {isAuthenticated && user ? (
          <Card
            interactive
            onClick={() => router.push("/profil")}
            className="p-4 sm:p-5 bg-gradient-to-r from-sky-500 via-purple-600 to-indigo-700 text-white border-white/20 shadow-apple-float rounded-3xl relative overflow-hidden group"
          >
            {/* Bulles d'aquarelle néon interactives */}
            <div className="absolute -right-8 -top-8 w-36 h-36 bg-pink-400/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
            <div className="absolute -left-8 -bottom-8 w-36 h-36 bg-cyan-400/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

            <div className="flex items-center justify-between gap-3 relative z-10">
              <div className="flex items-center gap-4 min-w-0">
                <Avatar
                  name={`${user.prenom} ${user.nom}`}
                  size="md"
                  status="online"
                  className="ring-2 ring-white/60 shadow-lg shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-white truncate tracking-tight">
                      {user.prenom} {user.nom}
                    </h3>
                  </div>
                  <p className="text-xs text-white/90 truncate font-bold flex items-center gap-1.5 pt-0.5">
                    <Sparkles className="h-4 w-4 text-amber-300 animate-pulse shrink-0" />
                    <span>{getUserRoleLabel(user)}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-black px-3.5 py-1.5 rounded-full bg-white/20 text-white backdrop-blur-md border border-white/30 hidden sm:inline shadow-sm">
                  Mon Profil
                </span>
                <div className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:translate-x-1 transition-transform shadow-sm">
                  <ArrowRight className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </Card>
        ) : (
          /* Sélecteur de profil moderne et tactile si non connecté */
          <Card className="p-5 border-white/80 rounded-3xl space-y-3.5 bg-white/85 backdrop-blur-2xl shadow-apple-card">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span>Sélectionnez votre profil pour accéder à votre espace :</span>
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {profiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleProfileClick(p.id, p.isFirstLogin)}
                  className="p-3.5 bg-gradient-to-r from-slate-50/90 via-sky-50/40 to-slate-50/90 hover:from-sky-50 hover:to-purple-50 border border-slate-200/80 hover:border-purple-300/80 rounded-2xl text-left transition-all duration-200 active:scale-[0.98] flex items-center justify-between gap-3 group shadow-sm hover:shadow-card"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={`${p.prenom} ${p.nom}`} size="sm" />
                    <div className="min-w-0">
                      <div className="font-extrabold text-xs text-slate-900 group-hover:text-purple-700 truncate">
                        {p.prenom} {p.nom}
                      </div>
                      <div className="text-[10px] text-slate-500 font-semibold truncate">
                        {getUserRoleLabel(p)}
                      </div>
                    </div>
                  </div>

                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Si utilisateur hybride : sélecteur d'espace */}
        {isHybridProduction && (
          <div className="p-3.5 bg-gradient-to-r from-purple-50/90 via-pink-50/60 to-sky-50/90 backdrop-blur-xl rounded-3xl border border-purple-200/80 flex items-center justify-between gap-3 text-xs shadow-sm">
            <span className="font-bold text-slate-700 text-xs">
              Mode actif : <strong className="text-purple-700 uppercase font-black">{activeSpace === "production" ? "Espace Production" : "Espace Musicien"}</strong>
            </span>
            <SpaceSwitcher />
          </div>
        )}
      </div>

      {/* Ligne dégradée subtile inspirée du logo */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-400/40 via-pink-400/40 to-transparent" />

      {/* 2. PROCHAINE PRESTATION (Information principale utile) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-pink-500 animate-pulse" />
            Prochaine prestation
          </span>
          {nextPrestation && (
            <Link
              href={`/evenement/${nextPrestation.id}`}
              className="text-xs font-extrabold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors bg-purple-50 px-3 py-1 rounded-full border border-purple-100"
            >
              <span>Fiche complète</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {nextPrestation ? (
          <Card className="p-6 sm:p-7 border-white/20 bg-artefacts-hero text-white shadow-artefacts-glow space-y-5 rounded-[2rem] relative overflow-hidden">
            {/* Aquarelles lumineuses dégradées en fond de carte */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-cyan-400/25 via-pink-500/20 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-purple-600/30 via-indigo-500/20 to-transparent rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-start justify-between gap-4 relative z-10">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3.5 py-1 text-xs font-black rounded-full bg-white/15 text-white border border-white/25 backdrop-blur-xl flex items-center gap-2 shadow-sm">
                    <Calendar className="h-3.5 w-3.5 text-cyan-300" />
                    <span>{nextPrestation.date}</span>
                  </span>
                  {nextPrestation.formation && (
                    <span className="px-3.5 py-1 text-xs font-black rounded-full bg-pink-500/30 text-pink-200 border border-pink-400/40 backdrop-blur-xl shadow-sm">
                      Formation {nextPrestation.formation}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight pt-1 leading-tight drop-shadow-sm">
                  {nextPrestation.titre}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-200 font-semibold pt-1">
                  <span className="flex items-center gap-2 bg-black/25 px-3 py-1.5 rounded-2xl backdrop-blur-md border border-white/15">
                    <Clock className="h-4 w-4 text-cyan-300" />
                    <span>Jeu : <strong className="text-white font-black">{nextPrestation.heureDebut}</strong></span>
                  </span>
                  <span className="flex items-center gap-2 bg-black/25 px-3 py-1.5 rounded-2xl backdrop-blur-md border border-white/15">
                    <MapPin className="h-4 w-4 text-pink-400" />
                    <span className="text-white font-black truncate max-w-[220px]">{nextPrestation.lieu}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Actions rapides : Voir prestation, GPS et Chat */}
            <div className="pt-4 border-t border-white/15 flex flex-wrap items-center gap-3 relative z-10">
              <Link href={`/evenement/${nextPrestation.id}`} className="flex-1 min-w-[150px]">
                <Button variant="white" size="md" className="w-full justify-center text-xs font-black rounded-2xl h-11">
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
                  className="h-11 text-xs font-black rounded-2xl border-white/30"
                  icon={<Navigation className="h-4 w-4 text-cyan-300" />}
                >
                  GPS
                </Button>
              </a>

              <Link href={`/evenement/${nextPrestation.id}/chat`}>
                <Button
                  variant="violet"
                  size="md"
                  className="h-11 text-xs font-black rounded-2xl relative gap-2 shadow-glow-violet bg-gradient-to-r from-pink-500 to-purple-600"
                  icon={<MessageSquare className="h-4 w-4" />}
                >
                  <span>Chat</span>
                  {nextChatUnreadCount > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-rose-500 text-white text-[10px] font-black rounded-full ring-2 ring-white/60 shadow-sm">
                      {nextChatUnreadCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <Card className="p-6 text-center bg-white/80 backdrop-blur-xl border-slate-200/80 rounded-3xl shadow-apple-card">
            <Calendar className="h-8 w-8 text-purple-400 mx-auto mb-2" />
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