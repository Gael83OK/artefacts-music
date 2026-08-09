"use client";

import React, { useState } from "react";
import { Setlist, SetlistItem, SetlistStatus } from "@/types/setlist";
import { songService } from "@/lib/song-service";
import { Song } from "@/types/song";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  X,
  Save,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Search,
  Heart,
  Music,
  CheckCircle2,
} from "lucide-react";

interface SetlistFormModalProps {
  isOpen: boolean;
  prestationId: string;
  onClose: () => void;
  onSave: (items: Omit<SetlistItem, "id">[], status: SetlistStatus) => void;
  initialSetlist?: Setlist | null;
}

interface DraftItem {
  songId: string;
  ordre: number;
  isDemandeClient: boolean;
  notes?: string;
}

export function SetlistFormModal({
  isOpen,
  prestationId,
  onClose,
  onSave,
  initialSetlist,
}: SetlistFormModalProps) {
  const allSongs = songService.getAll();

  const [items, setItems] = useState<DraftItem[]>(
    initialSetlist?.items.map((it) => ({
      songId: it.songId,
      ordre: it.ordre,
      isDemandeClient: !!it.isDemandeClient,
      notes: it.notes || "",
    })) || []
  );

  const [statut, setStatut] = useState<SetlistStatus>(initialSetlist?.statut || "brouillon");
  const [songSearch, setSongSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddSong = (songId: string) => {
    if (items.some((it) => it.songId === songId)) {
      setError("Ce morceau est déjà présent dans la setlist.");
      return;
    }
    setError(null);
    setItems([
      ...items,
      {
        songId,
        ordre: items.length + 1,
        isDemandeClient: false,
      },
    ]);
  };

  const handleRemoveSong = (index: number) => {
    const updated = items.filter((_, idx) => idx !== index);
    // Re-index order
    setItems(updated.map((it, idx) => ({ ...it, ordre: idx + 1 })));
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const updated = [...items];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setItems(updated.map((it, idx) => ({ ...it, ordre: idx + 1 })));
  };

  const handleMoveDown = (index: number) => {
    if (index >= items.length - 1) return;
    const updated = [...items];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setItems(updated.map((it, idx) => ({ ...it, ordre: idx + 1 })));
  };

  const handleToggleDemandeClient = (index: number) => {
    const updated = [...items];
    updated[index].isDemandeClient = !updated[index].isDemandeClient;
    setItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setError("Veuillez ajouter au moins un morceau à la setlist.");
      return;
    }

    onSave(items, statut);
    onClose();
  };

  const availableSongsToAdd = allSongs.filter(
    (s) =>
      !items.some((it) => it.songId === s.id) &&
      (s.titre.toLowerCase().includes(songSearch.toLowerCase()) ||
        s.artiste.toLowerCase().includes(songSearch.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 z-50 my-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <Badge variant="violet">Éditeur de Setlist Mobile</Badge>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              {initialSetlist ? "Modifier la setlist" : "Créer la setlist"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          {/* Statut de publication */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Statut de publication
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStatut("brouillon")}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-colors ${
                  statut === "brouillon"
                    ? "bg-amber-500 text-white border-amber-500"
                    : "bg-white text-slate-600 border-slate-200"
                }`}
              >
                Brouillon
              </button>
              <button
                type="button"
                onClick={() => setStatut("publiee")}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-colors ${
                  statut === "publiee"
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-slate-600 border-slate-200"
                }`}
              >
                Publiée (Visible équipe)
              </button>
            </div>
          </div>

          {/* Liste des morceaux sélectionnés dans la setlist */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Programme de la prestation ({items.length} morceaux)
            </label>

            {items.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs italic bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                Aucun morceau sélectionné. Utilisez la recherche ci-dessous pour composer le programme.
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-200">
                {items.map((item, idx) => {
                  const song = songService.getById(item.songId);
                  if (!song) return null;

                  return (
                    <div
                      key={song.id}
                      className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-xs gap-3"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="font-black text-slate-400 w-5 shrink-0">
                          {idx + 1}.
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900 truncate">
                            {song.titre}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {song.artiste}
                          </div>
                        </div>
                      </div>

                      {/* Controls: Demande mariés, Monter/Descendre, Supprimer */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleDemandeClient(idx)}
                          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                            item.isDemandeClient
                              ? "bg-rose-100 text-rose-700 border border-rose-300"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          }`}
                          title="Demande Mariés / Client"
                        >
                          <Heart className={`h-3.5 w-3.5 ${item.isDemandeClient ? "fill-rose-500 text-rose-500" : ""}`} />
                          <span className="hidden sm:inline">Mariés</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleMoveUp(idx)}
                          disabled={idx === 0}
                          className="p-1.5 bg-slate-100 disabled:opacity-30 hover:bg-slate-200 text-slate-700 rounded-lg"
                          title="Monter"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleMoveDown(idx)}
                          disabled={idx === items.length - 1}
                          className="p-1.5 bg-slate-100 disabled:opacity-30 hover:bg-slate-200 text-slate-700 rounded-lg"
                          title="Descendre"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveSong(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                          title="Retirer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recherche & Sélection depuis la Bibliothèque Centrale (Prompt 007) */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Ajouter des morceaux de la bibliothèque centrale
            </label>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={songSearch}
                onChange={(e) => setSongSearch(e.target.value)}
                placeholder="Rechercher par titre ou artiste..."
                className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500/30"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
              {availableSongsToAdd.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleAddSong(s.id)}
                  className="flex items-center justify-between p-2 bg-white hover:bg-violet-50 rounded-lg border border-slate-100 text-left transition-colors text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-900 truncate">{s.titre}</div>
                    <div className="text-[11px] text-slate-500 truncate">{s.artiste}</div>
                  </div>
                  <Plus className="h-4 w-4 text-violet-600 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              variant="violet"
              icon={<Save className="h-4 w-4" />}
            >
              Enregistrer la setlist
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
