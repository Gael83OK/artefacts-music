"use client";

import React, { useState } from "react";
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
  ChevronDown,
  Mic2,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, isHybridProduction, activeSpace } = useAuth();
  const profiles = authService.getAvailableProfiles();

  // Accordéon profils — fermé par défaut
  const [profilesOpen, setProfilesOpen] = useState(false);

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

      {/* ── 1. IDENTITÉ ──────────────────────────────────── */}
      <section className="space-y-3 pt-1">

        {/* Greeting */}
        <div className="space-y-1">
          <Badge variant="mediterranean" pulse>Artefacts App</Badge>
          <h1 className="text-[1.75rem] font-black tracking-tight leading-tight mt-2">
            {user ? (
              <>
                Bonsoir,{" "}
                <span className="text-gradient-artefacts">{user.prenom}</span>
                {" "}🎵
              </>
            ) : (
              <span className="text-gradient-artefacts">Artefacts Music</span>
            )}
          </h1>
          <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Votre scène, vos dates, votre équipe — tout ici.
          </p>
        </div>

        {/* Carte profil */}
        {isAuthenticated && user ? (
          <button
            onClick={() => router.push("/profil")}
            className="w-full text-left rounded-3xl p-5 relative overflow-hidden transition-all duration-300 active:scale-[0.98] group"
            style={{
              background: "linear-gradient(135deg, #1A1535 0%, #2A1F50 45%, #3A2070 75%, #1A3A5C 100%)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 12px 50px rgba(107,76,230,0.35), 0 0 0 1px rgba(255,255,255,0.05) inset",
            }}
          >
            {/* Orbe violet */}
            <div
              className="absolute -right-8 -top-8 w-44 h-44 rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-[1.6]"
              style={{ background: "radial-gradient(circle, rgba(139,109,250,0.3) 0%, transparent 70%)" }}
            />
            {/* Orbe rose chaud */}
            <div
              className="absolute -left-8 -bottom-8 w-44 h-44 rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-[1.6]"
              style={{ background: "radial-gradient(circle, rgba(240,98,146,0.25) 0%, transparent 70%)" }}
            />
            {/* Orbe or */}
            <div
              className="absolute top-1/2 right-1/3 w-24 h-24 rounded-full pointer-events-none opacity-50"
              style={{ background: "radial-gradient(circle, rgba(251,191,36,0.18) 0%, transparent 70%)" }}
            />
            {/* Ligne shimmer */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="relative z-10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <Avatar
                  name={`${user.prenom} ${user.nom}`}
                  size="md"
                  status="online"
                  className="ring-2 shrink-0"
                  style={{ ["--tw-ring-color" as string]: "rgba(167,139,250,0.4)" }}
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-black text-white tracking-tight truncate">
                    {user.prenom} {user.nom}
                  </h3>
                  <p className="text-xs flex items-center gap-1.5 mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                    <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{getUserRoleLabel(user)}</span>
                  </p>
                </div>
              </div>

              <div
                className="h-9 w-9 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <ChevronRight className="h-4 w-4 text-white/70" />
              </div>
            </div>
          </button>
        ) : (
          /* Sélecteur de profils — accordéon collapse */
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: "var(--bg-card)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            {/* Header cliquable */}
            <button
              onClick={() => setProfilesOpen((v) => !v)}
              className="w-full flex items-center justify-between gap-3 px-5 py-4 transition-all duration-200 active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(139,109,250,0.15)" }}
                >
                  <Sparkles className="h-4 w-4 text-violet-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                    Choisissez votre espace
                  </p>
                  <p className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
                    {profiles.length} profils disponibles
                  </p>
                </div>
              </div>

              {/* Flèche ↓ fermé → ↑ ouvert */}
              <ChevronDown
                className="h-5 w-5 shrink-0 transition-transform duration-300"
                style={{
                  color: profilesOpen ? "#A78BFA" : "var(--text-muted)",
                  transform: profilesOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>

            {/* Profils — rendu conditionnel strict, ABSENT du DOM si fermé */}
            {profilesOpen && (
              <div
                className="px-3 pb-3 space-y-1.5 animate-fade-in"
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  paddingTop: "8px",
                }}
              >
                {profiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleProfileClick(p.id, p.isFirstLogin)}
                    className="w-full flex items-center justify-between gap-3 p-3.5 rounded-2xl transition-all duration-200 active:scale-[0.97] text-left group"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar name={`${p.prenom} ${p.nom}`} size="sm" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate" style={{ color: "var(--text-primary)" }}>
                          {p.prenom} {p.nom}
                        </div>
                        <div className="text-[10px] font-medium truncate" style={{ color: "var(--text-muted)" }}>
                          {getUserRoleLabel(p)}
                        </div>
                      </div>
                    </div>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 transition-all duration-200 group-hover:translate-x-0.5"
                      style={{ color: "var(--text-muted)" }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Switcher hybride */}
        {isHybridProduction && (
          <div
            className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl text-xs"
            style={{
              background: "rgba(139,109,250,0.08)",
              border: "1px solid rgba(139,109,250,0.15)",
            }}
          >
            <span className="font-medium" style={{ color: "var(--text-secondary)" }}>
              Mode actif :{" "}
              <strong className="font-black" style={{ color: "#A78BFA" }}>
                {activeSpace === "production" ? "Production" : "Musicien"}
              </strong>
            </span>
            <SpaceSwitcher />
          </div>
        )}
      </section>

      {/* Séparateur */}
      <div className="divider-gradient-artefacts" />

      {/* ── 2. PROCHAINE PRESTATION ─────────────────────── */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full animate-pulse"
              style={{
                background: "linear-gradient(135deg, #A78BFA, #F472B6)",
                boxShadow: "0 0 8px rgba(167,139,250,0.7)",
              }}
            />
            <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              Prochaine prestation
            </span>
          </div>
          {nextPrestation && (
            <Link
              href={`/evenement/${nextPrestation.id}`}
              className="flex items-center gap-1 text-[11px] font-bold transition-all active:scale-95"
              style={{ color: "#A78BFA" }}
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
              background: "linear-gradient(135deg, #0D0B18 0%, #1A1540 35%, #231B55 65%, #0C2A40 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset, 0 0 60px -15px rgba(139,109,250,0.3)",
            }}
          >
            {/* Orbes aquarelle */}
            <div
              className="absolute -top-10 -right-10 w-56 h-56 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 65%)" }}
            />
            <div
              className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(240,98,146,0.18) 0%, transparent 65%)" }}
            />
            <div
              className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(251,191,36,0.10) 0%, transparent 65%)" }}
            />
            {/* Shimmer haut */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/12 to-transparent" />

            <div className="relative z-10 space-y-4">
              {/* Méta */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="px-3 py-1 text-[11px] font-bold rounded-full flex items-center gap-1.5"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  <Calendar className="h-3.5 w-3.5 text-violet-300" />
                  {nextPrestation.date}
                </span>
                {nextPrestation.formation && (
                  <span
                    className="px-3 py-1 text-[11px] font-bold rounded-full"
                    style={{
                      background: "rgba(240,98,146,0.18)",
                      border: "1px solid rgba(240,98,146,0.25)",
                      color: "#FBCFE4",
                    }}
                  >
                    Formation {nextPrestation.formation}
                  </span>
                )}
              </div>

              {/* Titre */}
              <h2 className="text-[1.65rem] font-black text-white tracking-tight leading-tight">
                {nextPrestation.titre}
              </h2>

              {/* Infos logistiques */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className="flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold"
                  style={{
                    background: "rgba(0,0,0,0.4)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  <Clock className="h-4 w-4 text-violet-300" />
                  Jeu : <strong className="text-white ml-1">{nextPrestation.heureDebut}</strong>
                </span>
                <span
                  className="flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold max-w-[220px]"
                  style={{
                    background: "rgba(0,0,0,0.4)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  <MapPin className="h-4 w-4 text-rose-400 shrink-0" />
                  <span className="text-white font-black truncate">{nextPrestation.lieu}</span>
                </span>
              </div>
            </div>

            {/* Séparateur */}
            <div
              className="relative z-10"
              style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }}
            />

            {/* Actions rapides */}
            <div className="relative z-10 flex flex-wrap items-center gap-2.5">
              <Link href={`/evenement/${nextPrestation.id}`} className="flex-1 min-w-[130px]">
                <button
                  className="w-full h-11 rounded-2xl text-[13px] font-black tracking-tight transition-all duration-200 active:scale-95"
                  style={{
                    background: "rgba(255,255,255,0.95)",
                    color: "#0E0C1A",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
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
                  className="h-11 px-5 rounded-2xl text-[13px] font-black text-white flex items-center gap-2 transition-all duration-200 active:scale-95"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <Navigation className="h-4 w-4 text-violet-300" />
                  GPS
                </button>
              </a>

              <Link href={`/evenement/${nextPrestation.id}/chat`}>
                <button
                  className="h-11 px-5 rounded-2xl text-[13px] font-black text-white flex items-center gap-2 transition-all duration-200 active:scale-95 relative"
                  style={{
                    background: "linear-gradient(135deg, #8B6DFA, #F06292)",
                    boxShadow: "0 4px 24px rgba(139,109,250,0.45)",
                  }}
                >
                  <MessageSquare className="h-4 w-4" />
                  Chat
                  {nextChatUnreadCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-white text-rose-600 text-[9px] font-black rounded-full shadow-sm">
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
              background: "var(--bg-card)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              className="h-12 w-12 rounded-2xl mx-auto mb-3 flex items-center justify-center"
              style={{ background: "rgba(139,109,250,0.12)" }}
            >
              <Mic2 className="h-6 w-6" style={{ color: "#A78BFA" }} />
            </div>
            <p className="text-sm font-bold" style={{ color: "var(--text-muted)" }}>
              Aucune prestation programmée
            </p>
          </div>
        )}
      </section>

      {/* ── 3. GRILLE INTERACTIVE ─────────────────────── */}
      <DashboardInteractiveGrid
        threeNextDates={threeNextDates}
        nextPrestation={nextPrestation}
        nextChatUnreadCount={nextChatUnreadCount}
        recentNotifications={recentNotifications}
      />
    </div>
  );
}