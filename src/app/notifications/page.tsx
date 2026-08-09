"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { notificationService } from "@/lib/notification-service";
import { AppNotification, NotificationType } from "@/types/notification";
import { NotificationSettingsModal } from "@/components/notifications/NotificationSettingsModal";
import {
  Bell,
  Calendar,
  Clock,
  MessageSquare,
  CheckCircle2,
  Settings,
  Check,
  ArrowRight,
  Info,
  LogIn,
  BellOff,
  UserX,
} from "lucide-react";

type FilterTab = "all" | "unread";

export default function NotificationsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const loadNotifications = React.useCallback(() => {
    if (user) {
      setNotifications(notificationService.getNotifications(user.id));
    }
  }, [user]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // 1. ÉTAT DE CHARGEMENT DE SESSION
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-slate-400">
        <div className="h-8 w-8 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" />
        <span className="text-xs font-semibold text-slate-600">Vérification de la session...</span>
      </div>
    );
  }

  // 2. UTILISATEUR NON CONNECTÉ
  if (!isAuthenticated || !user) {
    return (
      <div className="space-y-6 max-w-xl mx-auto py-12 text-center">
        <Card className="p-8 space-y-6 border-slate-200 shadow-lg">
          <div className="mx-auto h-16 w-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
            <BellOff className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-900">Vous n&apos;êtes pas connecté.</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Veuillez vous connecter pour consulter vos notifications et alertes de planning.
            </p>
          </div>

          <div className="pt-2">
            <Link href="/auth/connexion">
              <Button variant="violet" size="md" icon={<LogIn className="h-4 w-4" />}>
                Se connecter
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead(user.id);
    loadNotifications();
  };

  const handleItemClick = (notif: AppNotification) => {
    notificationService.markAsRead(notif.id);
    loadNotifications();
    if (notif.targetUrl) {
      router.push(notif.targetUrl);
    }
  };

  const getNotifIcon = (type: NotificationType) => {
    switch (type) {
      case "prestation_modification":
        return <Calendar className="h-4 w-4 text-rose-500 shrink-0" />;
      case "prestation_assignment":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />;
      case "prestation_reminder_24h":
        return <Clock className="h-4 w-4 text-amber-500 shrink-0" />;
      case "chat_message":
        return <MessageSquare className="h-4 w-4 text-violet-500 shrink-0" />;
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return !n.isRead;
    return true;
  });

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Centre de Notifications"
        subtitle="Alertes de planning, modifications de prestation, rappels J-1 et messages d'équipe."
        badge={<Badge variant="rose">Notifications & Alertes</Badge>}
        actions={
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllRead}
                icon={<Check className="h-4 w-4 text-emerald-600" />}
              >
                Tout marquer comme lu
              </Button>
            )}
            <Button
              variant="rose"
              size="sm"
              onClick={() => setIsSettingsOpen(true)}
              icon={<Settings className="h-4 w-4" />}
            >
              Paramètres
            </Button>
          </div>
        }
      />

      {/* Barre de filtres par statut de lecture */}
      <div className="flex items-center justify-between bg-slate-100/80 p-2 rounded-2xl border border-slate-200/80">
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === "all"
                ? "bg-violet-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Toutes ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab("unread")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === "unread"
                ? "bg-rose-500 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Non lues ({unreadCount})
          </button>
        </div>

        <span className="text-[11px] text-slate-500 hidden sm:inline pr-2">
          Rétention : max 20 plus récentes
        </span>
      </div>

      {/* Liste des Notifications ou État Vide Propre */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card className="p-8 text-center border-dashed">
            <Bell className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-900">Aucune notification pour le moment.</h3>
            <p className="text-xs text-slate-500 mt-1">
              {activeTab === "unread"
                ? "Vous n'avez aucun nouveau message non lu."
                : "Votre centre de notifications est parfaitement à jour."}
            </p>
          </Card>
        ) : (
          filteredNotifications.map((notif) => {
            const formattedTime = new Date(notif.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <Card
                key={notif.id}
                interactive
                onClick={() => handleItemClick(notif)}
                className={`p-4 transition-all ${
                  !notif.isRead
                    ? "border-rose-300 bg-gradient-to-r from-rose-50/30 via-white to-white shadow-sm"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="p-2 bg-slate-100 rounded-xl mt-0.5">
                      {getNotifIcon(notif.type)}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4
                          className={`text-sm tracking-tight ${
                            !notif.isRead
                              ? "font-extrabold text-slate-900"
                              : "font-bold text-slate-700"
                          }`}
                        >
                          {notif.title}
                        </h4>

                        {!notif.isRead && (
                          <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {notif.message}
                      </p>

                      <div className="text-[10px] text-slate-400 font-semibold pt-0.5">
                        {formattedTime}
                      </div>
                    </div>
                  </div>

                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-violet-600 shrink-0 self-center" />
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Modal des paramètres de notification */}
      <NotificationSettingsModal
        isOpen={isSettingsOpen}
        userId={user.id}
        onClose={() => setIsSettingsOpen(false)}
        onSave={loadNotifications}
      />
    </div>
  );
}
