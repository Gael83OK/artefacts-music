"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
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
  ChevronRight,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, isHybridProduction, activeSpace } = useAuth();
  const profiles = authService.getAvailableProfiles();

  const nowStr = new Date().toISOString().split("T")[0];

  const userPrestations = user
    ? prestationService.getByMusicianId(user.id).filter((p) => p.date >= nowStr)
    : [];
  userPrestations.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const nextPrestation = userPrestations.length > 0 ? userPrestations[0] : null;

  const nextChatUnreadCount =
    user && nextPrestation
      ? chatService.getUnreadCount(nextPrestation.id, user.id)
      : 0;

  const otherPrestations = userPrestations.slice(1);
  const userRehearsals = repetitionService
    .getAll()
    .filter((r) => r.date >= nowStr)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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
    <div className="space-y-5 max-w-2xl mx-auto pb-6 animate-fade-in">

      {/* ── 1. SECTION IDENTITÉ ─────────────────────────────── */}
      <section className="space-y-3 pt-1">

        {/* Greeting + badge Artefacts */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Badge variant="mediterranean" pulse>Artefacts App</Badge>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-tight mt-1.5">
              {user ? (
                <>
                  Bonjour,{" "}
                  <span className="text-gradient-artefacts">{user.prenom}</span>
                  {" "}👋
                </>
              ) : (
                <span className="text-gradient-hero">Bienvenue</span>
              )}
            </h1>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Votre scène, vos dates, votre équipe — tout ici.
            </p>
          </div>
        </div>

        {/* Carte profil connecté */}
        {isAuthenticated && user ? (
          <button
            onClick={() => router.push("/profil")}
            className="w-full text-left rounded-3xl p-4 relative overflow-hidden transition-all duration-300 active:scale-[0.98] group"
            style={{
              background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 40%, #312E81 70%, #0EA5E9 100%)",
              boxShadow: "0 10px 40px -8px rgba(49,46,129,0.5), 0 0 0 1px rgba(255,255,255,0.08) inset",
            }}
          >
            {/* Orbes lumineux interactifs */}
            <div
              className="absolute -right-10 -top-10 w-40 h-40 rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-150"
              style={{ background: "radial-gradient(circle, rgba(56,189,248,0.25) 0%, transparent 70%)" }}
            />
            <div
              className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-150"
              style={{ background: "radial-gradient(circle, rgba(236,72,153,0.22) 0%, transparent 70%)" }}
            />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-24 rounded-full pointer-events-none opacity-40"
              style={{ background: "radial-gradient(ellipse, rgba(122,90,248,0.3) 0%, transparent 70%)" }}
            />

            {/* Ligne de shimmer */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="relative z-10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar
                  name={`${user.prenom} ${user.nom}`}
                  size="md"
                  status="online"
                  className="ring-2 ring-white/20 shadow-lg shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-black text-white tracking-tight truncate">
                    {user.prenom} {user.nom}
                  </h3>
                  <p className="text-xs text-white/60 font-medium flex items-center gap-1.5 mt-0.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{getUserRoleLabel(user)}</span>
                  </p>
                </div>
              </div>

              <div
                className="h-9 w-9 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <ChevronRight className="h-4 w-4 text-white/80" />
              </div>
            </div>
          </button>
        ) : (
          /* Sélecteur de profils si non connecté */
          <div
            className="rounded-3xl p-5 space-y-3"
            style={{
              background: "rgba(255,255,255,0.80)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.7)",
              boxShadow: "0 8px 32px rgba(15,23,42,0.06), 0 0 0 1px rgba(255,255,255,0.5) inset",
            }}
          >
            <p className="text-xs font-bold text-slate-700 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-500" />
              Choisissez votre espace
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {profiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleProfileClick(p.id, p.isFirstLogin)}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-2xl transition-all duration-200 active:scale-[0.97] text-left group"
                  style={{
                    background: "rgba(248,250,252,0.8)",
                    border: "1px solid rgba(226,232,240,0.8)",
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={`${p.prenom} ${p.nom}`} size="sm" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate group-hover:text-violet-700 transition-colors">
                        {p.prenom} {p.nom}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium truncate">
                        {getUserRoleLabel(p)}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-violet-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Switcher hybride */}
        {isHybridProduction && (
          <div
            className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl text-xs"
            style={{
              background: "linear-gradient(135deg, rgba(122,90,248,0.06) 0%, rgba(56,189,248,0.04) 100%)",
              border: "1px solid rgba(122,90,248,0.12)",
            }}
          >
            <span className="font-medium text-slate-600">
              Mode actif :{" "}
              <strong className="text-violet-700 font-black">
                {activeSpace === "production" ? "Production" : "Musicien"}
              </strong>
            </span>
            <SpaceSwitcher />
          </div>
        )}
      </section>

      {/* Séparateur dégradé Artefacts */}
      <div className="divider-gradient-artefacts" />

      {/* ── 2. PROCHAINE PRESTATION ───────────────────────────── */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: "linear-gradient(135deg, #38BDF8, #EC4899)", boxShadow: "0 0 6px rgba(56,189,248,0.6)" }}
            />
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              Prochaine prestation
            </span>
          </div>
          {nextPrestation && (
            <Link
              href={`/evenement/${nextPrestation.id}`}
              className="flex items-center gap-1 text-[11px] font-bold text-violet-600 transition-all active:scale-95"
            >
              Fiche complète
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {nextPrestation ? (
          <div
            className="rounded-[2rem] p-6 space-y-5 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0B0F1A 0%, #1A1744 35%, #2D2880 65%, #0369A1 100%)",
              boxShadow: "0 20px 60px -10px rgba(11,15,26,0.6), 0 0 0 1px rgba(255,255,255,0.06) inset, 0 0 40px -10px rgba(56,189,248,0.2)",
            }}
          >
            {/* Orbes d'aquarelle */}
            <div
              className="absolute -top-8 -right-8 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(56,189,248,0.2) 0%, transparent 65%)" }}
            />
            <div
              className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 65%)" }}
            />
            <div
              className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full pointer-events-none opacity-60"
              style={{ background: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 65%)" }}
            />

            {/* Ligne shimmer haut */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            {/* Contenu */}
            <div className="relative z-10 space-y-4">
              {/* Méta : date + formation */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="px-3 py-1 text-[11px] font-bold rounded-full flex items-center gap-1.5"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <Calendar className="h-3.5 w-3.5 text-cyan-300" />
                  {nextPrestation.date}
                </span>
                {nextPrestation.formation && (
                  <span
                    className="px-3 py-1 text-[11px] font-bold rounded-full"
                    style={{
                      background: "rgba(236,72,153,0.2)",
                      border: "1px solid rgba(236,72,153,0.3)",
                      color: "#FBCFE4",
                    }}
                  >
                    Formation {nextPrestation.formation}
                  </span>
                )}
              </div>

              {/* Titre */}
              <h2 className="text-[1.6rem] font-black text-white tracking-tight leading-tight drop-shadow-sm">
                {nextPrestation.titre}
              </h2>

              {/* Heure + lieu */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className="flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold"
                  style={{
                    background: "rgba(0,0,0,0.3)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    backdropFilter: "blur(8px)",
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  <Clock className="h-4 w-4 text-cyan-300" />
                  <span>
                    Jeu : <strong className="text-white font-black">{nextPrestation.heureDebut}</strong>
                  </span>
                </span>
                <span
                  className="flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold max-w-[220px]"
                  style={{
                    background: "rgba(0,0,0,0.3)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    backdropFilter: "blur(8px)",
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  <MapPin className="h-4 w-4 text-pink-400 shrink-0" />
                  <span className="text-white font-black truncate">{nextPrestation.lieu}</span>
                </span>
              </div>
            </div>

            {/* Séparateur interne */}
            <div
              className="relative z-10"
              style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }}
            />

            {/* Actions rapides */}
            <div className="relative z-10 flex flex-wrap items-center gap-2.5">
              <Link href={`/evenement/${nextPrestation.id}`} className="flex-1 min-w-[140px]">
                <button
                  className="w-full h-11 rounded-2xl text-xs font-black text-slate-900 transition-all duration-200 active:scale-95"
                  style={{
                    background: "rgba(255,255,255,0.95)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                  }}
                >
                  Voir la prestation
                </button>
              </Link>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  nextPrestation.adresse || nextPrestation.lieu
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button
                  className="h-11 px-5 rounded-2xl text-xs font-black text-white flex items-center gap-2 transition-all duration-200 active:scale-95"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <Navigation className="h-4 w-4 text-cyan-300" />
                  GPS
                </button>
              </a>

              <Link href={`/evenement/${nextPrestation.id}/chat`}>
                <button
                  className="h-11 px-5 rounded-2xl text-xs font-black text-white flex items-center gap-2 transition-all duration-200 active:scale-95 relative"
                  style={{
                    background: "linear-gradient(135deg, #EC4899, #7A5AF8)",
                    boxShadow: "0 4px 20px rgba(122,90,248,0.4)",
                  }}
                >
                  <MessageSquare className="h-4 w-4" />
                  Chat
                  {nextChatUnreadCount > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.5 bg-white text-rose-600 text-[9px] font-black rounded-full shadow-sm">
                      {nextChatUnreadCount}
                    </span>
                  )}
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div
            className="p-8 text-center rounded-3xl"
            style={{
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.6)",
            }}
          >
            <div
              className="h-12 w-12 rounded-2xl mx-auto mb-3 flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, rgba(122,90,248,0.12), rgba(56,189,248,0.08))" }}
            >
              <Calendar className="h-6 w-6 text-violet-400" />
            </div>
            <p className="text-sm font-bold text-slate-500">
              Aucune prestation programmée
            </p>
          </div>
        )}
      </section>

      {/* ── 3. GRILLE INTERACTIVE ─────────────────────────────── */}
      <DashboardInteractiveGrid
        threeNextDates={threeNextDates}
        nextPrestation={nextPrestation}
        nextChatUnreadCount={nextChatUnreadCount}
        recentNotifications={recentNotifications}
      />
    </div>
  );
}