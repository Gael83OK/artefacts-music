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
      gradient: "from-mediterranean-500 via-mediterranean-600 to-sky-600",
      bgLight: "bg-mediterranean-50/70 border-mediterranean-200/90",
      textColor: "text-mediterranean-700",
    },
    {
      id: "chat" as CategoryId,
      title: "Chat d'équipe",
      subtitle: nextPrestation ? nextPrestation.titre : "Discussion concert",
      badge: nextChatUnreadCount > 0 ? `${nextChatUnreadCount} non lu${nextChatUnreadCount > 1 ? "s" : ""}` : null,
      badgeVariant: "rose" as const,
      icon: MessageSquare,
      gradient: "from-violet-500 via-violet-600 to-indigo-600",
      bgLight: "bg-violet-50/70 border-violet-200/90",
      textColor: "text-violet-700",
    },
    {
      id: "notifications" as CategoryId,
      title: "Notifications",
      subtitle: unreadNotifCount > 0 ? `${unreadNotifCount} nouvelle${unreadNotifCount > 1 ? "s" : ""}` : "Alertes d'équipe",
      badge: unreadNotifCount > 0 ? `${unreadNotifCount}` : null,
      badgeVariant: "rose" as const,
      icon: Bell,
      gradient: "from-rose-500 via-rose-600 to-pink-600",
      bgLight: "bg-rose-50/70 border-rose-200/90",
      textColor: "text-rose-700",
    },
    {
      id: "musique" as CategoryId,
      title: "Espace musical",
      subtitle: "Morceaux & Setlists",
      badge: null,
      badgeVariant: "violet" as const,
      icon: Music,
      gradient: "from-purple-500 via-purple-600 to-violet-700",
      bgLight: "bg-purple-50/70 border-purple-200/90",
      textColor: "text-purple-700",
    },
    {
      id: "administratif" as CategoryId,
      title: "Administratif",
      subtitle: "Cachets & Paie",
      badge: null,
      badgeVariant: "mediterranean" as const,
      icon: FileText,
      gradient: "from-blue-600 via-indigo-600 to-slate-700",
      bgLight: "bg-blue-50/70 border-blue-200/90",
      textColor: "text-blue-700",
    },
    {
      id: "materiel" as CategoryId,
      title: "Matériel",
      subtitle: "Kits & Micros",
      badge: null,
      badgeVariant: "amber" as const,
      icon: Package,
      gradient: "from-amber-500 via-amber-600 to-orange-600",
      bgLight: "bg-amber-50/70 border-amber-200/90",
      textColor: "text-amber-700",
    },
    {
      id: "annuaire" as CategoryId,
      title: "Annuaire",
      subtitle: "Équipe & Contacts",
      badge: null,
      badgeVariant: "emerald" as const,
      icon: Users,
      gradient: "from-emerald-500 via-emerald-600 to-teal-600",
      bgLight: "bg-emerald-50/70 border-emerald-200/90",
      textColor: "text-emerald-700",
    },
    {
      id: "indisponibilites" as CategoryId,
      title: "Indisponibilités",
      subtitle: "Congés & Planning",
      badge: null,
      badgeVariant: "slate" as const,
      icon: CalendarOff,
      gradient: "from-slate-600 via-slate-700 to-slate-800",
      bgLight: "bg-slate-100/80 border-slate-200",
      textColor: "text-slate-700",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Titre de section avec hiérarchie claire */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
          Explorer votre espace
        </span>
        <span className="text-[10px] text-slate-400 font-bold hidden sm:inline">
          Touchez une carte pour révéler les détails
        </span>
      </div>

      {/* Grille tactile 2 colonnes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const Icon = cat.icon;

          return (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between min-h-[96px] relative overflow-hidden group select-none ${
                isActive
                  ? `${cat.bgLight} ring-2 ring-violet-500/40 shadow-md scale-[1.01]`
                  : "bg-white border-slate-200/80 hover:border-slate-300/90 hover:bg-slate-50/60 active:scale-95 shadow-sm"
              }`}
            >
              {/* Entête de la tuile */}
              <div className="flex items-start justify-between gap-1 w-full">
                <div
                  className={`h-9 w-9 rounded-xl bg-gradient-to-br ${cat.gradient} text-white flex items-center justify-center shadow-sm shrink-0 transition-transform group-hover:scale-105`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                {cat.badge && (
                  <Badge variant={cat.badgeVariant} size="sm" className="text-[10px] px-1.5 py-0.5 font-black">
                    {cat.badge}
                  </Badge>
                )}
              </div>

              {/* Contenu textuel */}
              <div className="mt-2.5 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-black text-slate-900 truncate">
                    {cat.title}
                  </h4>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-300 shrink-0 ${
                      isActive ? "rotate-180 text-violet-600 font-black" : "group-hover:text-slate-600"
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
          <Card className="p-4 sm:p-5 border-violet-200/80 bg-white shadow-xl space-y-4 rounded-3xl relative">
            {/* Header du panneau déplié */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-violet-700 bg-violet-50 px-2.5 py-1 rounded-xl border border-violet-100/90">
                  {categories.find((c) => c.id === activeCategory)?.title}
                </span>
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                  Accès et détails
                </span>
              </div>

              <button
                onClick={() => setActiveCategory(null)}
                className="text-[11px] font-extrabold text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full transition-all active:scale-95"
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
                  <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed font-medium">
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
                          <Card interactive className="p-3 flex items-center justify-between gap-3 text-xs border-slate-200/90 hover:border-mediterranean-300">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="shrink-0 text-center bg-slate-100 px-2.5 py-1 rounded-xl">
                                <span className="text-[11px] font-black text-slate-900 capitalize block">
                                  {formattedDate}
                                </span>
                                <span className="text-[10px] text-slate-500 font-medium">
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
                    <Button variant="outline" size="sm" className="text-xs font-extrabold rounded-xl gap-1.5">
                      <span>Voir tout le calendrier</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* 2. CHAT D'ÉQUIPE */}
            {activeCategory === "chat" && (
              <div className="space-y-3">
                {nextPrestation ? (
                  <Card className="p-4 border-violet-200/90 bg-gradient-to-r from-violet-50/60 via-white to-white space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-violet-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
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
                        <Badge variant="rose" size="sm">
                          {nextChatUnreadCount} nouveau{nextChatUnreadCount > 1 ? "x" : ""}
                        </Badge>
                      )}
                    </div>

                    <div className="pt-2 border-t border-violet-100 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-violet-700 font-semibold">
                        💬 Fil de conversation instantané
                      </span>

                      <Link href={`/evenement/${nextPrestation.id}/chat`}>
                        <Button variant="violet" size="sm" className="text-xs font-black rounded-xl gap-1.5">
                          <span>Ouvrir la discussion</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed font-medium">
                    Aucun chat actif de prestation disponible.
                  </div>
                )}
              </div>
            )}

            {/* 3. NOTIFICATIONS */}
            {activeCategory === "notifications" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Dernières alertes reçues :</span>
                  <Link href="/notifications" className="font-extrabold text-mediterranean-600 hover:underline">
                    Tout voir
                  </Link>
                </div>

                {recentNotifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed font-medium">
                    Aucune notification récente.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recentNotifications.map((notif) => (
                      <Link key={notif.id} href={notif.targetUrl || "/notifications"} className="block">
                        <Card
                          interactive
                          className={`p-3 text-xs flex items-center justify-between gap-3 ${
                            !notif.isRead ? "bg-rose-50/50 border-rose-200" : "bg-white border-slate-200"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Bell className="h-4 w-4 text-rose-500 shrink-0" />
                            <div className="min-w-0">
                              <div className="font-extrabold text-slate-900 truncate">{notif.title}</div>
                              <div className="text-[11px] text-slate-500 font-medium truncate">{notif.message}</div>
                            </div>
                          </div>
                          <ArrowRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
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
                <p className="text-xs text-slate-600 font-medium">
                  Ressources musicales, partitions et fichiers audio :
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Link href="/espace-musical">
                    <div className="p-3 bg-violet-50/60 hover:bg-violet-100/70 border border-violet-200/90 rounded-2xl text-left transition-all duration-150 active:scale-95 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Headphones className="h-4 w-4 text-violet-600" />
                        <div>
                          <div className="font-black text-xs text-slate-900">Répertoire</div>
                          <div className="text-[10px] text-slate-500 font-medium">Morceaux & audios</div>
                        </div>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-violet-500" />
                    </div>
                  </Link>

                  <Link href="/espace-musical">
                    <div className="p-3 bg-purple-50/60 hover:bg-purple-100/70 border border-purple-200/90 rounded-2xl text-left transition-all duration-150 active:scale-95 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <FolderKanban className="h-4 w-4 text-purple-600" />
                        <div>
                          <div className="font-black text-xs text-slate-900">Setlists</div>
                          <div className="text-[10px] text-slate-500 font-medium">Ordres de passage</div>
                        </div>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-purple-500" />
                    </div>
                  </Link>

                  <Link href="/documents">
                    <div className="p-3 bg-sky-50/60 hover:bg-sky-100/70 border border-sky-200/90 rounded-2xl text-left transition-all duration-150 active:scale-95 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <FileText className="h-4 w-4 text-sky-600" />
                        <div>
                          <div className="font-black text-xs text-slate-900">Partitions</div>
                          <div className="text-[10px] text-slate-500 font-medium">Fichiers PDF</div>
                        </div>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-sky-500" />
                    </div>
                  </Link>
                </div>
              </div>
            )}

            {/* 5. ADMINISTRATIF */}
            {activeCategory === "administratif" && (
              <div className="space-y-3">
                <div className="p-3.5 bg-blue-50/60 border border-blue-200/90 rounded-2xl flex items-center justify-between gap-3 text-xs">
                  <div>
                    <h5 className="font-black text-slate-900">Gestion administrative & Paie</h5>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Déclaration de vos cachets, fiches de paie et fiches d&apos;actualisation.
                    </p>
                  </div>
                  <Link href="/administratif">
                    <Button variant="mediterranean" size="sm" className="text-xs font-black rounded-xl shrink-0">
                      Ouvrir
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* 6. MATÉRIEL */}
            {activeCategory === "materiel" && (
              <div className="space-y-3">
                <div className="p-3.5 bg-amber-50/60 border border-amber-200/90 rounded-2xl flex items-center justify-between gap-3 text-xs">
                  <div>
                    <h5 className="font-black text-slate-900">Gestion du matériel & logistique</h5>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Inventaire des micros, kits de son et attribution par prestation.
                    </p>
                  </div>
                  <Link href="/materiel">
                    <Button variant="outline" size="sm" className="text-xs font-black rounded-xl shrink-0 bg-white">
                      Voir le matériel
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* 7. ANNUAIRE */}
            {activeCategory === "annuaire" && (
              <div className="space-y-3">
                <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/90 rounded-2xl flex items-center justify-between gap-3 text-xs">
                  <div>
                    <h5 className="font-black text-slate-900">Annuaire de l&apos;équipe</h5>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Trouvez rapidement les coordonnées des musiciens et techniciens.
                    </p>
                  </div>
                  <Link href="/annuaire">
                    <Button variant="outline" size="sm" className="text-xs font-black rounded-xl shrink-0 bg-white border-emerald-300 text-emerald-700">
                      Annuaire
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* 8. INDISPONIBILITÉS */}
            {activeCategory === "indisponibilites" && (
              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl flex items-center justify-between gap-3 text-xs">
                  <div>
                    <h5 className="font-black text-slate-900">Mes indisponibilités</h5>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Saisissez vos périodes d&apos;indisponibilité pour les futurs plannings.
                    </p>
                  </div>
                  <Link href="/indisponibilites">
                    <Button variant="outline" size="sm" className="text-xs font-black rounded-xl shrink-0 bg-white">
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
