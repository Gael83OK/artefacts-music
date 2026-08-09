"use client";

import React, { useState } from "react";
import { MissionSpecifique, MissionStatus } from "@/types/materiel";
import { AuthUser } from "@/types/auth";
import { authService } from "@/lib/auth-service";
import { prestationService } from "@/lib/prestation-service";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { X, Save, Package, Check, Sparkles } from "lucide-react";

interface MissionFormModalProps {
  isOpen: boolean;
  prestationId?: string;
  onClose: () => void;
  onSave: (data: Omit<MissionSpecifique, "id" | "updatedAt">) => void;
  initialData?: MissionSpecifique | null;
}

const QUICK_SUGGESTIONS = [
  "Passer au local de Rognes",
  "Récupérer la sono",
  "Ramener les retours",
  "Récupérer le matériel spécifique",
  "Faire le détour par le local",
];

export function MissionFormModal({
  isOpen,
  prestationId,
  onClose,
  onSave,
  initialData,
}: MissionFormModalProps) {
  const allMusicians = authService.getAvailableProfiles();
  const allPrestations = prestationService.getAll();

  const [titre, setTitre] = useState(initialData?.titre || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [selectedPrestationId, setSelectedPrestationId] = useState(
    initialData?.prestationId || prestationId || (allPrestations.length > 0 ? allPrestations[0].id : "")
  );
  const [responsableId, setResponsableId] = useState(
    initialData?.responsableId || (allMusicians.length > 0 ? allMusicians[0].id : "")
  );
  const [statut, setStatut] = useState<MissionStatus>(initialData?.statut || "a_faire");

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!titre.trim()) {
      setError("Le titre de la mission est obligatoire.");
      return;
    }
    if (!selectedPrestationId) {
      setError("Veuillez sélectionner une prestation.");
      return;
    }
    if (!responsableId) {
      setError("Veuillez désigner un responsable pour cette mission.");
      return;
    }

    onSave({
      prestationId: selectedPrestationId,
      titre: titre.trim(),
      description: description.trim() || undefined,
      responsableId,
      statut,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 z-50 text-left space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <Badge variant="rose">Logistique & Mission</Badge>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              {initialData ? "Modifier la mission" : "Créer une mission spécifique"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Suggestions d'intitulés rapides */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Suggestions rapides
            </label>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_SUGGESTIONS.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => setTitre(sug)}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-rose-50 text-rose-800 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors"
                >
                  + {sug}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Titre de la mission *
            </label>
            <input
              type="text"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder="ex: Passer au local de Rognes"
              className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500/30"
              required
            />
          </div>

          {/* Sélection Prestation & Responsable */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Prestation associée *
              </label>
              <select
                value={selectedPrestationId}
                onChange={(e) => setSelectedPrestationId(e.target.value)}
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                required
              >
                {allPrestations.map((p) => (
                  <option key={p.id} value={p.id}>
                    📅 {p.titre} ({p.date})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Personne responsable *
              </label>
              <select
                value={responsableId}
                onChange={(e) => setResponsableId(e.target.value)}
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                required
              >
                {allMusicians.map((m) => (
                  <option key={m.id} value={m.id}>
                    👤 {m.prenom} {m.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Description / Consignes particulières
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ex: Récupérer le kit sono RCF 2000W et la console avant 14h00..."
              className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white h-20"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              variant="rose"
              size="sm"
              icon={<Save className="h-4 w-4" />}
            >
              {initialData ? "Enregistrer les modifications" : "Créer la mission"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
