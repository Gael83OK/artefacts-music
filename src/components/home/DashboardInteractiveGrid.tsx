"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Calendar,
  MessageSquare,
  Bell,
  Music,
  Package,
  FileText,
  Users,
  CalendarOff,
  ChevronDown,
  ArrowRight,
  Headphones,
  FolderKanban,
} from "lucide-react";

interface CombinedEvent {
  id: string;
  type: "prestation" | "repetition";
  date: string;
  time: string;
  lieu: string;
  title: string;
  targetUrl: string;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead?: boolean;
  targetUrl?: string;
}

interface PrestationItem {
  id: string;
  date: string;
  titre: string;
  lieu: string;
  heureDebut: string;
  heureArrivee?: string;
  formation?: string;
}

interface DashboardInteractiveGridProps {
  threeNextDates: CombinedEvent[];
  nextPrestation: PrestationItem | null;
  nextChatUnreadCount: number;
  recentNotifications: NotificationItem[];
}

type CategoryId =
  | "agenda"
  | "chat"
  | "notifications"
  | "musique"
  | "administratif"
  | "materiel"
  | "annuaire"
  | "indisponibilites";

export function DashboardInteractiveGrid({
  threeNextDates,
  nextPrestation,
  nextChatUnreadCount,
  recentNotifications,
}: DashboardInteractiveGridProps) {
  // Par défaut, le premier panneau (Prochaines dates) est déplié
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>("agenda");

  const toggleCategory = (id: CategoryId) => {
    setActiveCategory((prev) => (prev === id ? null : id));
  };

  const unreadNotifCount = recentNotifications.filter((n) => !n.isRead).length;

  const categories = [
    {
      id: "agenda" as CategoryId,
      title: "Agenda & Dates",
      subtitle: `${threeNextDates.length} à venir`,
      badge: threeNextDates.length > 0 ? `${threeNextDates.length}` : null,
      badgeVariant: "mediterranean" as const,
      icon: Calendar,
      gradient: "from-sky-400 via-sky-500 to-indigo-600",
      bgLight: "bg-sky-50/80 border-sky-200/90",
      activeRing: "ring-sky-400/50 border-sky-300",
      textColor: "text-sky-700",
    },
    {
      id: "chat" as CategoryId,
      title: "Chat d'équipe",
      subtitle: nextPrestation ? nextPrestation.titre : "Discussion concert",
      badge: nextChatUnreadCount > 0 ? `${nextChatUnreadCount} non lu${nextChatUnreadCount > 1 ? "s" : ""}` : null,
      badgeVariant: "rose" as const,
      icon: MessageSquare,
      gradient: "from-pink-500 via-purple-500 to-indigo-600",
      bgLight: "bg-pink-50/80 border-pink-200/90",
      activeRing: "ring-pink-400/50 border-pink-300",
      textColor: "text-pink-700",
    },
    {
      id: "notifications" as CategoryId,
      title: "Notifications",
      subtitle: unreadNotifCount > 0 ? `${unreadNotifCount} nouvelle${unreadNotifCount > 1 ? "s" : ""}` : "Alertes d'équipe",
      badge: unreadNotifCount > 0 ? `${unreadNotifCount}` : null,
      badgeVariant: "rose" as const,
      icon: Bell,
      gradient: "from-rose-500 via-pink-600 to-purple-600",
      bgLight: "bg-rose-50/80 border-rose-200/90",
      activeRing: "ring-rose-400/50 border-rose-300",
      textColor: "text-rose-700",
    },
    {
      id: "musique" as CategoryId,
      title: "Espace musical",
      subtitle: "Morceaux & Setlists",
      badge: null,
      badgeVariant: "violet" as const,
      icon: Music,
      gradient: "from-purple-500 via-indigo-600 to-sky-500",
      bgLight: "bg-purple-50/80 border-purple-200/90",
      activeRing: "ring-purple-400/50 border-purple-300",
      textColor: "text-purple-700",
    },
    {
      id: "administratif" as CategoryId,
      title: "Administratif",
      subtitle: "Cachets & Paie",
      badge: null,
      badgeVariant: "mediterranean" as const,
      icon: FileText,
      gradient: "from-indigo-600 via-sky-500 to-cyan-400",
      bgLight: "bg-indigo-50/80 border-indigo-200/90",
      activeRing: "ring-indigo-400/50 border-indigo-300",
      textColor: "text-indigo-700",
    },
    {
      id: "materiel" as CategoryId,
      title: "Matériel",
      subtitle: "Kits & Micros",
      badge: null,
      badgeVariant: "amber" as const,
      icon: Package,
      gradient: "from-amber-400 via-pink-500 to-purple-500",
      bgLight: "bg-amber-50/80 border-amber-200/90",
      activeRing: "ring-amber-400/50 border-amber-300",
      textColor: "text-amber-700",
    },
    {
      id: "annuaire" as CategoryId,
      title: "Annuaire",
      subtitle: "Équipe & Contacts",
      badge: null,
      badgeVariant: "emerald" as const,
      icon: Users,
      gradient: "from-emerald-400 via-teal-500 to-sky-500",
      bgLight: "bg-emerald-50/80 border-emerald-200/90",
      activeRing: "ring-emerald-400/50 border-emerald-300",
      textColor: "text-emerald-700",
    },
    {
      id: "indisponibilites" as CategoryId,
      title: "Indisponibilités",
      subtitle: "Congés & Planning",
      badge: null,
      badgeVariant: "slate" as const,
      icon: CalendarOff,
      gradient: "from-slate-600 via-indigo-600 to-purple-700",
      bgLight: "bg-slate-100/90 border-slate-200",
      activeRing: "ring-slate-400/50 border-slate-300",
      textColor: "text-slate-700",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Titre de section avec hiérarchie claire */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-gradient-to-r from-sky-400 to-pink-500 animate-pulse" />
          Explorer votre espace
        </span>
        <span className="text-[10px] text-slate-400 font-bold hidden sm:inline">
          Touchez une bulle pour ouvrir les détails
        </span>
      </div>

      {/* Grille tactile 2 colonnes style App iOS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const Icon = cat.icon;

          return (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              className={`p-4 rounded-3xl border text-left transition-all duration-300 flex flex-col justify-between min-h-[105px] relative overflow-hidden group select-none ${
                isActive
                  ? `${cat.bgLight} ring-2 ${cat.activeRing} shadow-apple-float scale-[1.02]`
                  : "bg-white/80 backdrop-blur-xl border-slate-200/70 hover:border-slate-300/90 hover:bg-white active:scale-95 shadow-apple-card hover:shadow-card-hover"
              }`}
            >
              {/* Reflet lumineux en survol */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />

              {/* Entête de la tuile */}
              <div className="flex items-start justify-between gap-1 w-full relative z-10">
                <div
                  className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${cat.gradient} text-white flex items-center justify-center shadow-md shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <Icon className="h-5 w-5 drop-shadow-sm" />
                </div>

                {cat.badge && (
                  <Badge variant={cat.badgeVariant} size="sm" pulse={isActive} className="text-[10px] px-2 py-0.5 font-black shadow-sm">
                    {cat.badge}
                  </Badge>
                )}
              </div>

              {/* Contenu textuel */}
              <div className="mt-3 min-w-0 relative z-10">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-black text-slate-900 truncate tracking-tight">
                    {cat.title}
                  </h4>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform duration-300 shrink-0 ${
                      isActive ? "rotate-180 text-purple-600 font-black" : "group-hover:text-slate-600"
                    }`}
                  />
                </div>
                <p className="text-[10px] text-slate-500 truncate font-semibold mt-0.5">
                  {cat.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Panneau de divulgation progressive (In-Place Expanded Detail View) */}
      {activeCategory && (
        <div className="animate-slide-up transition-all duration-300">
          <Card variant="glass" className="p-5 sm:p-6 border-slate-200/80 bg-white/90 backdrop-blur-2xl shadow-apple-float space-y-4 rounded-3xl relative overflow-hidden">
            {/* Ligne dégradée subtile en haut */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-pink-500 to-indigo-600" />

            {/* Header du panneau déplié */}
            <div className="flex items-center justify-between border-b border-slate-100/90 pb-3.5">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-gradient-to-r from-sky-50 via-pink-50 to-purple-50 px-3 py-1 rounded-2xl border border-purple-200/60 shadow-sm">
                  {categories.find((c) => c.id === activeCategory)?.title}
                </span>
                <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
                  Accès instantané & gestion
                </span>
              </div>

              <button
                onClick={() => setActiveCategory(null)}
                className="text-xs font-extrabold text-slate-500 hover:text-slate-900 bg-slate-100/90 hover:bg-slate-200/90 px-3.5 py-1.5 rounded-full transition-all active:scale-95 shadow-sm"
              >
                Fermer ✕
              </button>
            </div>

            {/* CONTENU SPÉCIFIQUE À CHAQUE CATÉGORIE */}

            {/* 1. AGENDA & DATES */}
            {activeCategory === "agenda" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 font-medium">
                  Vos 3 prochaines dates de prestations et répétitions :
                </p>

                {threeNextDates.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500 bg-slate-50/70 rounded-2xl border border-slate-200/70 font-semibold">
                    Aucun événement à venir pour le moment.
                  </div>
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
                          <Card interactive className="p-3.5 flex items-center justify-between gap-3 text-xs border-slate-200/80 bg-white/80 backdrop-blur-md rounded-2xl hover:border-sky-300 shadow-sm">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="shrink-0 text-center bg-gradient-to-br from-sky-50 to-indigo-50 border border-sky-100 px-3 py-1.5 rounded-2xl">
                                <span className="text-[11px] font-black text-slate-900 capitalize block">
                                  {formattedDate}
                                </span>
                                <span className="text-[10px] text-sky-600 font-bold">
                                  {evt.time}
                                </span>
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-slate-900 truncate">
                                    {evt.title}
                                  </span>
                                  <Badge
                                    variant={evt.type === "prestation" ? "mediterranean" : "violet"}
                                    size="sm"
                                  >
                                    {evt.type === "prestation" ? "Prestation" : "Répétition"}
                                  </Badge>
                                </div>
                                <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
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

                <div className="pt-1 flex justify-end">
                  <Link href="/calendrier">
                    <Button variant="outline" size="sm" className="text-xs font-black rounded-2xl gap-1.5">
                      <span>Voir tout le calendrier</span>
                      <ArrowRight className="h-3.5 w-3.5 text-sky-600" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* 2. CHAT D'ÉQUIPE */}
            {activeCategory === "chat" && (
              <div className="space-y-3">
                {nextPrestation ? (
                  <Card className="p-4 border-pink-200/90 bg-gradient-to-r from-pink-50/70 via-purple-50/40 to-white space-y-3 rounded-2xl">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-md">
                          <MessageSquare className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-900">
                            Chat — {nextPrestation.titre}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-medium">
                            Espace de discussion pour les musiciens de ce concert.
                          </p>
                        </div>
                      </div>

                      {nextChatUnreadCount > 0 && (
                        <Badge variant="rose" size="sm" pulse>
                          {nextChatUnreadCount} nouveau{nextChatUnreadCount > 1 ? "x" : ""}
                        </Badge>
                      )}
                    </div>

                    <div className="pt-2.5 border-t border-purple-100/90 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-purple-700 font-bold flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
                        Fil de conversation instantané
                      </span>

                      <Link href={`/evenement/${nextPrestation.id}/chat`}>
                        <Button variant="violet" size="sm" className="text-xs font-black rounded-2xl gap-1.5">
                          <span>Ouvrir la discussion</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500 bg-slate-50/70 rounded-2xl border border-slate-200/70 font-semibold">
                    Aucun chat actif de prestation disponible.
                  </div>
                )}
              </div>
            )}

            {/* 3. NOTIFICATIONS */}
            {activeCategory === "notifications" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-semibold">Dernières alertes reçues :</span>
                  <Link href="/notifications" className="font-extrabold text-purple-600 hover:underline">
                    Tout voir
                  </Link>
                </div>

                {recentNotifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500 bg-slate-50/70 rounded-2xl border border-slate-200/70 font-semibold">
                    Aucune notification récente.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recentNotifications.map((notif) => (
                      <Link key={notif.id} href={notif.targetUrl || "/notifications"} className="block">
                        <Card
                          interactive
                          className={`p-3.5 text-xs flex items-center justify-between gap-3 rounded-2xl ${
                            !notif.isRead ? "bg-rose-50/60 border-rose-200/90 shadow-sm" : "bg-white/80 border-slate-200/80"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-8 w-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                              <Bell className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-extrabold text-slate-900 truncate">{notif.title}</div>
                              <div className="text-[11px] text-slate-500 font-medium truncate">{notif.message}</div>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. ESPACE MUSICAL */}
            {activeCategory === "musique" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 font-semibold">
                  Ressources musicales, partitions et fichiers audio :
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <Link href="/espace-musical">
                    <div className="p-3.5 bg-gradient-to-br from-purple-50/80 to-indigo-50/80 hover:from-purple-100 hover:to-indigo-100 border border-purple-200/80 rounded-2xl text-left transition-all duration-200 active:scale-95 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-purple-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                          <Headphones className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-black text-xs text-slate-900">Répertoire</div>
                          <div className="text-[10px] text-slate-500 font-medium">Morceaux & audios</div>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-purple-500" />
                    </div>
                  </Link>

                  <Link href="/espace-musical">
                    <div className="p-3.5 bg-gradient-to-br from-pink-50/80 to-purple-50/80 hover:from-pink-100 hover:to-purple-100 border border-pink-200/80 rounded-2xl text-left transition-all duration-200 active:scale-95 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-pink-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                          <FolderKanban className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-black text-xs text-slate-900">Setlists</div>
                          <div className="text-[10px] text-slate-500 font-medium">Ordres de passage</div>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-pink-500" />
                    </div>
                  </Link>

                  <Link href="/documents">
                    <div className="p-3.5 bg-gradient-to-br from-sky-50/80 to-cyan-50/80 hover:from-sky-100 hover:to-cyan-100 border border-sky-200/80 rounded-2xl text-left transition-all duration-200 active:scale-95 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-black text-xs text-slate-900">Partitions</div>
                          <div className="text-[10px] text-slate-500 font-medium">Fichiers PDF</div>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-sky-500" />
                    </div>
                  </Link>
                </div>
              </div>
            )}

            {/* 5. ADMINISTRATIF */}
            {activeCategory === "administratif" && (
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-r from-indigo-50/80 via-sky-50/60 to-white border border-indigo-200/80 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-sm">
                  <div>
                    <h5 className="font-black text-slate-900">Gestion administrative & Paie</h5>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Déclaration de vos cachets, fiches de paie et fiches d&apos;actualisation.
                    </p>
                  </div>
                  <Link href="/administratif">
                    <Button variant="mediterranean" size="sm" className="text-xs font-black rounded-2xl shrink-0">
                      Ouvrir
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* 6. MATÉRIEL */}
            {activeCategory === "materiel" && (
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-r from-amber-50/80 via-pink-50/60 to-white border border-amber-200/80 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-sm">
                  <div>
                    <h5 className="font-black text-slate-900">Gestion du matériel & logistique</h5>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Inventaire des micros, kits de son et attribution par prestation.
                    </p>
                  </div>
                  <Link href="/materiel">
                    <Button variant="outline" size="sm" className="text-xs font-black rounded-2xl shrink-0 bg-white">
                      Voir le matériel
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* 7. ANNUAIRE */}
            {activeCategory === "annuaire" && (
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-r from-emerald-50/80 via-teal-50/60 to-white border border-emerald-200/80 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-sm">
                  <div>
                    <h5 className="font-black text-slate-900">Annuaire de l&apos;équipe</h5>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Trouvez rapidement les coordonnées des musiciens et techniciens.
                    </p>
                  </div>
                  <Link href="/annuaire">
                    <Button variant="outline" size="sm" className="text-xs font-black rounded-2xl shrink-0 bg-white border-emerald-300 text-emerald-700">
                      Annuaire
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* 8. INDISPONIBILITÉS */}
            {activeCategory === "indisponibilites" && (
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-r from-slate-50/90 via-indigo-50/40 to-white border border-slate-200/90 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-sm">
                  <div>
                    <h5 className="font-black text-slate-900">Mes indisponibilités</h5>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Saisissez vos périodes d&apos;indisponibilité pour les futurs plannings.
                    </p>
                  </div>
                  <Link href="/indisponibilites">
                    <Button variant="outline" size="sm" className="text-xs font-black rounded-2xl shrink-0 bg-white">
                      Saisir
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
