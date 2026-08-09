"use client";

import React, { useState } from "react";
import { Repetition, RepetitionStatus } from "@/types/repetition";
import { AuthUser } from "@/types/auth";
import { Song } from "@/types/song";
import { authService } from "@/lib/auth-service";
import { songService } from "@/lib/song-service";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { X, Save, Calendar, Clock, MapPin, Users, Mic2, Music } from "lucide-react";

interface RepetitionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Repetition, "id" | "updatedAt">) => void;
  initialData?: Repetition | null;
}

export function RepetitionFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: RepetitionFormModalProps) {
  const allMusicians = authService.getAvailableProfiles();
  const allSongs = songService.getAll();

  const [titre, setTitre] = useState(initialData?.titre || "");
  const [date, setDate] = useState(initialData?.date || "");
  const [heureDebut, setHeureDebut] = useState(initialData?.heureDebut || "19:30");
  const [heureFin, setHeureFin] = useState(initialData?.heureFin || "22:00");
  const [lieu, setLieu] = useState(initialData?.lieu || "Studio Artefacts");
  const [adresse, setAdresse] = useState(initialData?.adresse || "Chemin de Traspigut, Rognes");
  const [objet, setObjet] = useState(initialData?.objet || "");
  const [formation, setFormation] = useState(initialData?.formation || "Quartet");
  const [status, setStatus] = useState<RepetitionStatus>(initialData?.status || "confirme");

  const [musicianIds, setMusicianIds] = useState<string[]>(
    initialData?.musicianIds || allMusicians.map((m) => m.id)
  );

  const [songIds, setSongIds] = useState<string[]>(initialData?.songIds || []);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleMusician = (id: string) => {
    if (musicianIds.includes(id)) {
      setMusicianIds(musicianIds.filter((mId) => mId !== id));
    } else {
      setMusicianIds([...musicianIds, id]);
    }
  };

  const toggleSong = (id: string) => {
    if (songIds.includes(id)) {
      setSongIds(songIds.filter((sId) => sId !== id));
    } else {
      setSongIds([...songIds, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!titre || !date || !lieu) {
      setError("Veuillez remplir les champs obligatoires (Titre, Date, Lieu).");
      return;
    }

    onSave({
      titre,
      date,
      heureDebut,
      heureFin,
      lieu,
      adresse,
      objet,
      formation,
      status,
      musicianIds,
      songIds,
      audios: initialData?.audios || [],
      syncInfo: initialData?.syncInfo || { source: "manual" },
    });

    onClose();
  };

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
            <Badge variant="violet">
              {initialData ? "Modification Répétition" : "Nouvelle Répétition"}
            </Badge>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              {initialData ? "Modifier la séance" : "Planifier une répétition"}
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

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Titre & Statut */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Titre de la répétition *
              </label>
              <input
                type="text"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                placeholder="ex: Répétition Quartet — Cassis"
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500/30"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Statut
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as RepetitionStatus)}
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              >
                <option value="confirme">Confirmé</option>
                <option value="option">Option</option>
                <option value="annule">Annulé</option>
              </select>
            </div>
          </div>

          {/* Date & Horaires */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Heure Début
              </label>
              <input
                type="time"
                value={heureDebut}
                onChange={(e) => setHeureDebut(e.target.value)}
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Heure Fin
              </label>
              <input
                type="time"
                value={heureFin}
                onChange={(e) => setHeureFin(e.target.value)}
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          {/* Lieu & Adresse */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Studio / Lieu *
              </label>
              <input
                type="text"
                value={lieu}
                onChange={(e) => setLieu(e.target.value)}
                placeholder="ex: Studio La Friche"
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Adresse studio
              </label>
              <input
                type="text"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                placeholder="ex: 41 Rue Jobin, 13003 Marseille"
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          {/* OBJET DE LA RÉPÉTITION (Texte libre) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Objet de la répétition (Texte libre)
            </label>
            <input
              type="text"
              value={objet}
              onChange={(e) => setObjet(e.target.value)}
              placeholder="ex: Trio — mise en place des morceaux ou Travailler le nouveau répertoire"
              className="w-full h-10 px-3 text-sm bg-violet-50/60 border border-violet-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500/30"
            />
          </div>

          {/* Sélection des musiciens convoqués */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Musiciens Convoqués ({musicianIds.length} sélectionnés)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
              {allMusicians.map((m) => {
                const isSelected = musicianIds.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleMusician(m.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs text-left transition-colors ${
                      isSelected
                        ? "bg-violet-100 text-violet-900 font-semibold border border-violet-300"
                        : "bg-white text-slate-600 border border-slate-100"
                    }`}
                  >
                    <span>{isSelected ? "✅" : "⚪"}</span>
                    <span className="truncate">{m.prenom} {m.nom}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sélection des morceaux de la Bibliothèque centrale */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Morceaux de la bibliothèque à travailler ({songIds.length} sélectionnés)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
              {allSongs.map((s) => {
                const isSelected = songIds.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleSong(s.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs text-left transition-colors ${
                      isSelected
                        ? "bg-mediterranean-50 text-mediterranean-900 font-semibold border border-mediterranean-300"
                        : "bg-white text-slate-600 border border-slate-100 hover:bg-slate-100"
                    }`}
                  >
                    <span>{isSelected ? "🎵" : "⚪"}</span>
                    <span className="truncate">{s.titre} ({s.artiste})</span>
                  </button>
                );
              })}
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
              {initialData ? "Enregistrer les modifications" : "Créer la répétition"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
