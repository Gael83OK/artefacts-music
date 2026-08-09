"use client";

import React, { useState } from "react";
import { MaterielSpecifique, MaterielStatus } from "@/types/materiel";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { X, Save, Wrench } from "lucide-react";

interface EquipmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<MaterielSpecifique, "id" | "updatedAt">) => void;
  initialData?: MaterielSpecifique | null;
}

export function EquipmentFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: EquipmentFormModalProps) {
  const [nom, setNom] = useState(initialData?.nom || "");
  const [categorie, setCategorie] = useState(initialData?.categorie || "Son");
  const [quantite, setQuantite] = useState<number>(initialData?.quantite || 1);
  const [statut, setStatut] = useState<MaterielStatus>(initialData?.statut || "disponible");
  const [depot, setDepot] = useState(initialData?.depot || "Rognes");
  const [notes, setNotes] = useState(initialData?.notes || "");

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nom.trim()) {
      setError("Le nom de l'équipement est obligatoire.");
      return;
    }

    onSave({
      nom: nom.trim(),
      categorie,
      quantite,
      statut,
      depot,
      notes: notes.trim() || undefined,
      prestationId: initialData?.prestationId,
      responsableId: initialData?.responsableId,
      actif: initialData?.actif ?? true,
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
            <Badge variant="rose">
              {initialData ? "Modification Équipement" : "Nouvel Équipement"}
            </Badge>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              {initialData ? "Modifier l'équipement" : "Ajouter un équipement au parc"}
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
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Nom de l&apos;équipement *
            </label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="ex: Console numérique Yamaha CL5"
              className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500/30"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Catégorie
              </label>
              <select
                value={categorie}
                onChange={(e) => setCategorie(e.target.value)}
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              >
                <option value="Son">Son</option>
                <option value="Lumière">Lumière</option>
                <option value="Instruments">Instruments</option>
                <option value="Régie">Régie</option>
                <option value="Accessoires">Accessoires</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Quantité
              </label>
              <input
                type="number"
                min="1"
                value={quantite}
                onChange={(e) => setQuantite(parseInt(e.target.value) || 1)}
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Statut
              </label>
              <select
                value={statut}
                onChange={(e) => setStatut(e.target.value as MaterielStatus)}
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              >
                <option value="disponible">Disponible</option>
                <option value="en_utilisation">En utilisation</option>
                <option value="en_maintenance">En maintenance</option>
                <option value="indisponible">Indisponible</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Dépôt / Local
              </label>
              <input
                type="text"
                value={depot}
                onChange={(e) => setDepot(e.target.value)}
                placeholder="ex: Rognes"
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Notes & Commentaires
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Spécifications, câblage, état général..."
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
              Enregistrer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
