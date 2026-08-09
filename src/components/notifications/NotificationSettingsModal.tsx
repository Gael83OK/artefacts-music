"use client";

import React, { useState } from "react";
import { NotificationSettings } from "@/types/notification";
import { notificationService } from "@/lib/notification-service";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { X, Save, Bell, Calendar, Clock, MessageSquare, Info } from "lucide-react";

interface NotificationSettingsModalProps {
  isOpen: boolean;
  userId: string;
  onClose: () => void;
  onSave: () => void;
}

export function NotificationSettingsModal({
  isOpen,
  userId,
  onClose,
  onSave,
}: NotificationSettingsModalProps) {
  const currentSettings = notificationService.getSettings(userId);

  const [prestationModifs, setPrestationModifs] = useState(currentSettings.notifyPrestationModifications);
  const [reminder24h, setReminder24h] = useState(currentSettings.notifyPrestationReminder24h);
  const [chatNotifs, setChatNotifs] = useState(currentSettings.notifyChatMessage);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    notificationService.updateSettings(userId, {
      notifyPrestationModifications: prestationModifs,
      notifyPrestationReminder24h: reminder24h,
      notifyChatMessage: chatNotifs,
    });
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 z-50 text-left space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <Badge variant="rose">Préférences Notifications</Badge>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Paramètres des notifications
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Note importante */}
        <div className="p-3 bg-rose-50/70 border border-rose-200/80 rounded-2xl text-xs text-rose-900 flex items-start gap-2">
          <Info className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
          <span>
            Désactiver une alerte masque uniquement les notifications push. Toutes vos prestations et vos chats restent 100% accessibles.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Option 1: Modifications Prestation */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="space-y-0.5 pr-2">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-violet-600" />
                <span>Modifications de prestations</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Changements d&apos;horaire, de lieu ou de responsable.
              </p>
            </div>
            <input
              type="checkbox"
              checked={prestationModifs}
              onChange={(e) => setPrestationModifs(e.target.checked)}
              className="h-5 w-5 text-violet-600 rounded border-slate-300 focus:ring-violet-500 shrink-0"
            />
          </div>

          {/* Option 2: Rappel 24h */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="space-y-0.5 pr-2">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-500" />
                <span>Rappel 24 heures avant</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Alerte automatique J-1 avant un événement.
              </p>
            </div>
            <input
              type="checkbox"
              checked={reminder24h}
              onChange={(e) => setReminder24h(e.target.checked)}
              className="h-5 w-5 text-violet-600 rounded border-slate-300 focus:ring-violet-500 shrink-0"
            />
          </div>

          {/* Option 3: Notifications de Chat */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="space-y-0.5 pr-2">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-mediterranean-600" />
                <span>Notifications de chat</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Avis lors de la réception de nouveaux messages d&apos;équipe.
              </p>
            </div>
            <input
              type="checkbox"
              checked={chatNotifs}
              onChange={(e) => setChatNotifs(e.target.checked)}
              className="h-5 w-5 text-violet-600 rounded border-slate-300 focus:ring-violet-500 shrink-0"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              variant="rose"
              size="sm"
              icon={<Save className="h-4 w-4" />}
            >
              Enregistrer mes préférences
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
