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
import {
  Calendar,
  Music,
  Mic2,
  MessageSquare,
  Navigation,
  ArrowRight,
  Sparkles,
  FileText,
  Bell,
  User,
  Clock,
  MapPin,
  Users,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, isHybridProduction, activeSpace } = useAuth();
  const profiles = authService.getAvailableProfiles();

  const nowStr = new Date().toISOString().split("T")[0];

  // 1. Détermination automatique de la PROCHAINE PRESTATION (Prompt 018)
  const userPrestations = user
    ? prestationService.getByMusicianId(user.id).filter((p) => p.date >= nowStr)
    : [];

  userPrestations.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const nextPrestation = userPrestations.length > 0 ? userPrestations[0] : null;

  // 2. Chat de la prochaine prestation (DOIT pointer vers la même prestation)
  const nextChatUnreadCount =
    user && nextPrestation
      ? chatService.getUnreadCount(nextPrestation.id, user.id)
      : 0;

  // 3. Trois prochaines dates (Prestations & Répétitions futures, excluant la première déjà affichée)
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
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* 1. EN-TÊTE ET ENCADRÉ PROFIL (Prompt 018) */}
      <div className="space-y-4">
        <PageHeader
          title={user ? `Bonjour ${user.prenom}` : "Bienvenue sur Artefacts Music"}
          subtitle="Votre tableau de bord quotidien — Prochaines dates, chat d'équipe et accès rapides."
          badge={<Badge variant="mediterranean">Artefacts Music</Badge>}
        />

        {/* Encadré Profil discret et cliquable */}
        {isAuthenticated && user ? (
          <Card
            interactive
            onClick={() => router.push("/profil")}
            className="p-4 bg-gradient-to-r from-mediterranean-500 via-mediterranean-600 to-violet-600 text-white border-none shadow-lg"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar
                  name={`${user.prenom} ${user.nom}`}
                  size="md"
                  status="online"
                  className="ring-2 ring-white/40 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-white truncate">
                      {user.prenom} {user.nom}
                    </h3>
                  </div>
                  <p className="text-xs text-white/85 truncate font-medium">
                    {getUserRoleLabel(user)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-md hidden sm:inline">
                  Mon Profil
                </span>
                <ArrowRight className="h-4 w-4 text-white" />
              </div>
            </div>
          </Card>
        ) : (
          /* Sélecteur de profil si non connecté */
          <Card className="p-5 border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              Sélectionnez votre profil pour accéder à votre espace :
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {profiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleProfileClick(p.id, p.isFirstLogin)}
                  className="p-2.5 bg-slate-50 hover:bg-mediterranean-50 border border-slate-200 rounded-xl text-left transition-colors"
                >
                  <div className="font-bold text-xs text-slate-900 truncate">
                    {p.prenom} {p.nom}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {getUserRoleLabel(p)}
                  </div>
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Si utilisateur hybride : sélecteur d'espace */}
        {isHybridProduction && (
          <div className="p-3 bg-violet-50/70 rounded-2xl border border-violet-200/80 flex items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-slate-700">
              Mode actif : <strong className="text-violet-700 uppercase">{activeSpace === "production" ? "Espace Production" : "Espace Musicien"}</strong>
            </span>
            <SpaceSwitcher />
          </div>
        )}
      </div>

      {/* 2. RÉCAPITULATIF DE LA PROCHAINE PRESTATION (Prompt 018) */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          2. Prochaine prestation
        </div>

        {nextPrestation ? (
          <Card className="p-5 sm:p-6 border-mediterranean-300/80 bg-gradient-to-br from-slate-900 via-mediterranean-950 to-slate-900 text-white shadow-xl space-y-4 rounded-3xl">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-mediterranean-500/30 text-mediterranean-200 border border-mediterranean-400/40">
                    📅 {nextPrestation.date}
                  </span>
                  {nextPrestation.formation && (
                    <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-violet-500/30 text-violet-200 border border-violet-400/40">
                      Formation {nextPrestation.formation}
                    </span>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight pt-1">
                  {nextPrestation.titre}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium pt-0.5">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-mediterranean-400" />
                    <span>Jeu : <strong className="text-white font-bold">{nextPrestation.heureDebut}</strong> (Arrivée {nextPrestation.heureArrivee})</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-rose-400" />
                    <span className="text-white font-bold">{nextPrestation.lieu}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Actions : Voir la prestation & Bouton GPS Itinéraire */}
            <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
              <Link href={`/evenement/${nextPrestation.id}`} className="flex-1">
                <Button variant="mediterranean" size="md" className="w-full justify-center text-xs font-bold rounded-xl h-10">
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
                  size="md"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/30 h-10 text-xs font-bold rounded-xl"
                  icon={<Navigation className="h-4 w-4 text-mediterranean-300" />}
                >
                  GPS
                </Button>
              </a>
            </div>
          </Card>
        ) : (
          /* ÉTAT VIDE EXIGÉ PAR LE PROMPT 018 SECTION 15 */
          <Card className="p-6 text-center border-dashed">
            <Calendar className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-900">
              Aucune prochaine prestation programmée.
            </p>
          </Card>
        )}
      </div>

      {/* 3. ACCÈS AU CHAT DE LA PROCHAINE PRESTATION (Pointer vers la MÊME prestation) */}
      {nextPrestation && (
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            3. Chat de la prochaine prestation
          </div>

          <Link href={`/evenement/${nextPrestation.id}/chat`} className="block">
            <Card interactive className="p-4 border-violet-200 bg-gradient-to-r from-violet-50/40 via-white to-white">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 bg-violet-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    <MessageSquare className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold text-slate-900">
                        Chat — {nextPrestation.titre}
                      </span>
                      {nextChatUnreadCount > 0 && (
                        <Badge variant="rose" size="sm">
                          {nextChatUnreadCount} nouveau{nextChatUnreadCount > 1 ? "x" : ""}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      💬 Discussion réservée aux musiciens de ce concert
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-violet-600 shrink-0">
                  <span>Ouvrir le chat</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Card>
          </Link>
        </div>
      )}

      {/* 4. TROIS PROCHAINES DATES (Prestations & Répétitions) */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          4. Trois prochaines dates
        </div>

        {threeNextDates.length === 0 ? (
          <Card className="p-4 text-center text-xs text-slate-500 border-dashed">
            Aucun autre événement à venir.
          </Card>
        ) : (
          <div className="space-y-2">
            {threeNextDates.map((evt) => {
              const formattedDate = new Date(evt.date).toLocaleDateString("fr-FR", {
                weekday: "short",
                day: "numeric",
                month: "short",
              });

              return (
                <Link key={evt.id} href={evt.targetUrl} className="block">
                  <Card interactive className="p-3.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="shrink-0 text-center bg-slate-100 px-2.5 py-1 rounded-xl">
                        <span className="text-[11px] font-extrabold text-slate-900 capitalize block">
                          {formattedDate}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {evt.time}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 truncate">
                            {evt.title}
                          </span>
                          <Badge variant={evt.type === "prestation" ? "mediterranean" : "violet"} size="sm">
                            {evt.type === "prestation" ? "Prestation" : "Répétition"}
                          </Badge>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          📍 {evt.lieu}
                        </div>
                      </div>
                    </div>

                    <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. NOTIFICATIONS RÉCENTES (Prompt 018) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            5. Notifications récentes
          </span>
          <Link
            href="/notifications"
            className="text-xs font-bold text-mediterranean-600 hover:underline flex items-center gap-1"
          >
            <span>Voir toutes les notifications</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentNotifications.length === 0 ? (
          /* ÉTAT VIDE EXIGÉ PAR LE PROMPT 018 SECTION 20 */
          <Card className="p-4 text-center text-xs text-slate-500 border-dashed">
            Aucune notification récente.
          </Card>
        ) : (
          <div className="space-y-2">
            {recentNotifications.map((notif) => (
              <Link
                key={notif.id}
                href={notif.targetUrl || "/notifications"}
                className="block"
              >
                <Card
                  interactive
                  className={`p-3 text-xs flex items-center justify-between gap-3 ${
                    !notif.isRead ? "bg-rose-50/40 border-rose-200" : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Bell className="h-4 w-4 text-rose-500 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">
                        {notif.title}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {notif.message}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 6. TROIS CARTES PRINCIPALES (Administratif, Calendrier, Espace musical) */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          6. Accès principaux
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link href="/administratif">
            <Card interactive className="p-4 bg-gradient-to-br from-rose-50/50 via-white to-white border-rose-200/60 h-full flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900">Administratif</span>
                <FileText className="h-5 w-5 text-rose-600" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500">Actualisation du mois & Fiches de paie</p>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-rose-600 pt-1">
                <span>Ouvrir l&apos;espace</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Card>
          </Link>

          <Link href="/calendrier">
            <Card interactive className="p-4 bg-gradient-to-br from-mediterranean-50/50 via-white to-white border-mediterranean-200/60 h-full flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900">Calendrier</span>
                <Calendar className="h-5 w-5 text-mediterranean-600" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500">Planning complet prestations et répétitions</p>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-mediterranean-600 pt-1">
                <span>Voir l&apos;agenda</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Card>
          </Link>

          <Link href="/espace-musical">
            <Card interactive className="p-4 bg-gradient-to-br from-violet-50/50 via-white to-white border-violet-200/60 h-full flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900">Espace musical</span>
                <Music className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500">Bibliothèque des morceaux, setlists et audios</p>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-violet-600 pt-1">
                <span>Accéder aux morceaux</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}