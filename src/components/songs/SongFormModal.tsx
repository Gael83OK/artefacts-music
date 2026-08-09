"use client";

import React, { useState } from "react";
import { Song, SongStatus } from "@/types/song";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { X, Save, Music } from "lucide-react";

interface SongFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Song, "id" | "updatedAt">) => void;
  initialData?: Song | null;
}

export function SongFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: SongFormModalProps) {
  const [titre, setTitre] = useState(initialData?.titre || "");
  const [artiste, setArtiste] = useState(initialData?.artiste || "");
  const [statut, setStatut] = useState<SongStatus>(initialData?.statut || "a_travailler");
  const [arrangementInfo, setArrangementInfo] = useState(initialData?.arrangementInfo || "");
  const [formations, setFormations] = useState<string[]>(
    initialData?.formations || ["Duo", "Quartet"]
  );

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleFormation = (f: string) => {
    if (formations.includes(f)) {
      setFormations(formations.filter((item) => item !== f));
    } else {
      setFormations([...formations, f]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!titre.trim()) {
      setError("Le titre du morceau est obligatoire.");
      return;
    }

    onSave({
      titre: titre.trim(),
      artiste: artiste.trim() || "Artiste inconnu",
      statut,
      formations,
      arrangementInfo,
      prestationIds: initialData?.prestationIds || [],
      repetitionIds: initialData?.repetitionIds || [],
      audios: initialData?.audios || [],
      files: initialData?.files || [],
      favorisUserIds: initialData?.favorisUserIds || [],
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
            <Badge variant="violet">
              {initialData ? "Modification Morceau" : "Nouveau Morceau"}
            </Badge>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              {initialData ? "Modifier le morceau" : "Ajouter un morceau"}
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
              Titre du morceau *
            </label>
            <input
              type="text"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder="ex: L-O-V-E"
              className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500/30"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Artiste d&apos;origine
              </label>
              <input
                type="text"
                value={artiste}
                onChange={(e) => setArtiste(e.target.value)}
                placeholder="ex: Nat King Cole"
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Statut
              </label>
              <select
                value={statut}
                onChange={(e) => setStatut(e.target.value as SongStatus)}
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              >
                <option value="a_travailler">À travailler</option>
                <option value="en_cours">En cours</option>
                <option value="pret">Prêt</option>
                <option value="archive">Archivé</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Formations concernées
            </label>
            <div className="flex flex-wrap gap-2">
              {["Duo", "Trio", "Quartet", "XXL"].map((f) => {
                const isSelected = formations.includes(f);
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggleFormation(f)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                      isSelected
                        ? "bg-violet-600 text-white border-violet-600"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Consignes d&apos;arrangement & structure
            </label>
            <textarea
              value={arrangementInfo}
              onChange={(e) => setArrangementInfo(e.target.value)}
              placeholder="Tonalité, intro 4 mesures, structure, solo, coda..."
              className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white h-24"
            />
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
