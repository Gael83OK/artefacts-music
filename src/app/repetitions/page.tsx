"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { repetitionService } from "@/lib/repetition-service";
import { songService } from "@/lib/song-service";
import { Repetition } from "@/types/repetition";
import { Song, SongStatus } from "@/types/song";
import { RepetitionFormModal } from "@/components/repetitions/RepetitionFormModal";
import { useAuth } from "@/context/AuthContext";
import { ROLE_DISPLAY_NAMES } from "@/lib/mock-users";
import {
  Mic2,
  Calendar,
  Clock,
  MapPin,
  Plus,
  ArrowRight,
  Music,
  FileAudio,
  TrendingUp,
  Search,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

type ActiveTab = "schedule" | "progress";

export default function RepetitionsPage() {
  const { user, canManageRehearsals, canEditEvent } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>("schedule");
  const [repetitions, setRepetitions] = useState<Repetition[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setRepetitions(repetitionService.getAll());
    setSongs(songService.getAll());
  }, []);

  const handleCreate = (data: Omit<Repetition, "id" | "updatedAt">) => {
    repetitionService.create(
      data,
      user ? `${user.prenom} ${user.nom}` : "Production"
    );
    setRepetitions(repetitionService.getAll());
  };

  const handleStatusChange = (songId: string, newStatus: SongStatus) => {
    songService.update(songId, { statut: newStatus });
    setSongs(songService.getAll());
  };

  const getSongStatusBadge = (statut: SongStatus) => {
    switch (statut) {
      case "pret":
        return <Badge variant="success">Prêt</Badge>;
      case "arrangement_commence":
        return <Badge variant="violet">Arrangement commencé</Badge>;
      case "a_arranger":
        return <Badge variant="warning">À arranger</Badge>;
      case "en_cours":
        return <Badge variant="violet">En cours</Badge>;
      case "a_travailler":
        return <Badge variant="warning">À travailler</Badge>;
      case "archive":
        return <Badge variant="neutral">Archivé</Badge>;
    }
  };

  const filteredSongs = songs.filter((s) => {
    if (statusFilter !== "all" && s.statut !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return s.titre.toLowerCase().includes(q) || s.artiste.toLowerCase().includes(q);
    }
    return true;
  });

  const canUserEdit = canManageRehearsals() || canEditEvent();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Répétitions & Avancée des Morceaux"
        subtitle="Planning des séances studio, convocations et suivi d'avancement des arrangements."
        badge={<Badge variant="violet">Studio & Suivi Musical</Badge>}
        actions={
          canUserEdit ? (
            <Button
              variant="violet"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => setIsModalOpen(true)}
            >
              Nouvelle Répétition
            </Button>
          ) : undefined
        }
      />

      {/* Barre de sélection des Onglets Principaux (1. Calendrier répétitions, 2. Avancée des morceaux) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-100/80 p-2.5 rounded-2xl border border-slate-200/80">
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("schedule")}
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
              activeTab === "schedule"
                ? "bg-violet-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>1. Calendrier des répétitions ({repetitions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("progress")}
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
              activeTab === "progress"
                ? "bg-violet-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span>2. Avancée des morceaux ({songs.length})</span>
          </button>
        </div>
      </div>

      {/* ONGLET 1: CALENDRIER & LISTE DES RÉPÉTITIONS */}
      {activeTab === "schedule" && (
        <div className="space-y-4">
          {repetitions.length === 0 ? (
            <Card className="p-8 text-center border-dashed">
              <Mic2 className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-900">Aucune répétition programmée</h3>
              <p className="text-xs text-slate-500 mt-1">
                Aucune séance de travail n&apos;est actuellement planifiée au studio.
              </p>
            </Card>
          ) : (
            repetitions.map((r) => {
              const formattedDate = new Date(r.date).toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              });

              return (
                <Link key={r.id} href={`/repetitions/${r.id}`} className="block">
                  <Card interactive className="p-5 border-violet-100 hover:border-violet-300">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="violet" size="sm">
                            Répétition • {r.formation || "Studio"}
                          </Badge>
                          <Badge variant="success" size="sm">
                            Confirmé
                          </Badge>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 leading-tight">
                          {r.titre}
                        </h3>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1 font-semibold text-violet-700 capitalize">
                            <Calendar className="h-3.5 w-3.5 text-violet-500 shrink-0" />
                            {formattedDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            {r.heureDebut} - {r.heureFin}
                          </span>
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            {r.lieu}
                          </span>
                        </div>

                        {/* OBJET DE LA RÉPÉTITION (Visible directement dans la liste) */}
                        {r.objet && (
                          <div className="mt-2 text-xs font-semibold text-violet-900 bg-violet-50 p-2.5 rounded-xl border border-violet-100 flex items-center gap-2">
                            <Mic2 className="h-4 w-4 text-violet-600 shrink-0" />
                            <span>Objet : &quot;{r.objet}&quot;</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 shrink-0">
                        {r.audios && r.audios.length > 0 && (
                          <span className="flex items-center gap-1 text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                            <FileAudio className="h-3.5 w-3.5" />
                            {r.audios.length} audio{r.audios.length > 1 ? "s" : ""}
                          </span>
                        )}

                        <div className="flex items-center gap-1 text-xs text-violet-600 font-semibold">
                          <span>Détails de la séance</span>
                          <ArrowRight className="h-4 w-4 shrink-0" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })
          )}
        </div>
      )}

      {/* ONGLET 2: AVANCÉE DES MORCEAUX */}
      {activeTab === "progress" && (
        <div className="space-y-4">
          {/* Barre de filtre par statut & recherche */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500 mr-1">Statut :</span>
              {["all", "a_travailler", "en_cours", "a_arranger", "arrangement_commence", "pret"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                    statusFilter === st
                      ? "bg-violet-600 text-white border-violet-600"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {st === "all"
                    ? "Tous"
                    : st === "a_travailler"
                    ? "À travailler"
                    : st === "en_cours"
                    ? "En cours"
                    : st === "a_arranger"
                    ? "À arranger"
                    : st === "arrangement_commence"
                    ? "Arrangement commencé"
                    : "Prêt"}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-60">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filtrer un morceau..."
                className="w-full h-8 pl-8 pr-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Grille d'avancement des morceaux */}
          <div className="space-y-3">
            {filteredSongs.length === 0 ? (
              <Card className="p-8 text-center border-dashed">
                <Music className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <h3 className="text-base font-bold text-slate-900">Aucun morceau dans cette catégorie</h3>
              </Card>
            ) : (
              filteredSongs.map((song) => (
                <Card key={song.id} className="p-4 space-y-2 border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link href={`/espace-musical/${song.id}`} className="hover:underline">
                          <h4 className="text-base font-extrabold text-slate-900">
                            {song.titre}
                          </h4>
                        </Link>
                        <span className="text-xs text-slate-500">({song.artiste})</span>
                      </div>

                      {song.arrangementInfo && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
                          💡 Note arrangement : {song.arrangementInfo}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                      {/* Sélecteur de statut réactif si l'utilisateur est éditeur */}
                      {canUserEdit ? (
                        <select
                          value={song.statut}
                          onChange={(e) => handleStatusChange(song.id, e.target.value as SongStatus)}
                          className="h-8 px-2.5 text-xs font-bold bg-violet-50 border border-violet-200 text-violet-800 rounded-lg focus:bg-white"
                        >
                          <option value="a_travailler">À travailler</option>
                          <option value="en_cours">En cours</option>
                          <option value="a_arranger">À arranger</option>
                          <option value="arrangement_commence">Arrangement commencé</option>
                          <option value="pret">Prêt</option>
                          <option value="archive">Archivé</option>
                        </select>
                      ) : (
                        getSongStatusBadge(song.statut)
                      )}


                      <Link href={`/espace-musical/${song.id}`}>
                        <Button variant="outline" size="sm" icon={<ArrowRight className="h-3.5 w-3.5" />}>
                          Fiche
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal de création d'une répétition */}
      <RepetitionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreate}
      />
    </div>
  );
}
