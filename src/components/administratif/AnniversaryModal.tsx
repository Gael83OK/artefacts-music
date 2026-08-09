"use client";

import React, { useState } from "react";
import { X, Calendar, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { administratifService } from "@/lib/administratif-service";

interface AnniversaryModalProps {
  isOpen: boolean;
  userId: string;
  currentDate: string;
  onClose: () => void;
  onSave: () => void;
}

export function AnniversaryModal({
  isOpen,
  userId,
  currentDate,
  onClose,
  onSave,
}: AnniversaryModalProps) {
  const [date, setDate] = useState(currentDate || "2026-09-15");

  if (!isOpen) return null;

  const { dateDebut, dateFin } = administratifService.calculateIntermittencePeriod(date);

  const formattedDebut = new Date(dateDebut).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedFin = new Date(dateFin).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    administratifService.updateAnniversaryDate(userId, date);
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

      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 z-50 text-left space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <Badge variant="violet">Paramètre Intermittence</Badge>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Date anniversaire d&apos;intermittent
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Saisir votre date anniversaire *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500/30"
              required
            />
          </div>

          <div className="p-3.5 bg-violet-50/70 rounded-2xl border border-violet-200 text-xs space-y-1 text-slate-700">
            <div className="font-semibold text-violet-900 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-violet-600" />
              Calcul automatique de la période :
            </div>
            <p className="font-bold text-slate-900 pt-0.5">
              {formattedDebut} → {formattedFin}
            </p>
            <p className="text-[11px] text-slate-500">
              Toutes vos prestations prévues et réalisées seront automatiquement rattachées à cette plage de 12 mois.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              variant="violet"
              size="sm"
              icon={<Save className="h-4 w-4" />}
            >
              Enregistrer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
