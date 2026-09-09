"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { songService } from "@/lib/song-service";
import { Song, SongStatus } from "@/types/song";
import { SongFormModal } from "@/components/songs/SongFormModal";
import { useAuth } from "@/context/AuthContext";
import {
  Music,
  Search,
  Plus,
  Star,
  FileAudio,
  FileText,
  ArrowRight,
  Sparkles,
} from "lucide-react";

type FilterTab = "all" | "a_travailler" | "en_cours" | "pret" | "archive" | "favorites";

export default function EspaceMusicalPage() {
  const { user, canEditSetlist, canEditEvent } = useAuth();
  const [songs, setSongs] = useState<Song[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setSongs(songService.getAll());
  }, []);

  const handleCreateSong = (data: Omit<Song, "id" | "updatedAt">) => {
    songService.create(
      data,
      user ? `${user.prenom} ${user.nom}` : "Production"
    );
    setSongs(songService.getAll());
  };

  const handleToggleFav = (e: React.MouseEvent, songId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    songService.toggleFavorite(songId, user.id);
    setSongs(songService.getAll());
  };

  const filteredSongs = songs.filter((s) => {
    // Tab filter
    if (activeTab === "favorites") {
      if (!user || !s.favorisUserIds?.includes(user.id)) return false;
    } else if (activeTab !== "all") {
      if (s.statut !== activeTab) return false;
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitre = s.titre.toLowerCase().includes(q);
      const matchArtiste = s.artiste.toLowerCase().includes(q);
      return matchTitre || matchArtiste;
    }

    return true;
  });

  const getStatusBadge = (statut: SongStatus) => {
    switch (statut) {
      case "pret":
        return <Badge variant="success" size="sm">Prêt</Badge>;
      case "en_cours":
        return <Badge variant="violet" size="sm">En cours</Badge>;
      case "a_travailler":
        return <Badge variant="warning" size="sm">À travailler</Badge>;
      case "archive":
        return <Badge variant="neutral" size="sm">Archivé</Badge>;
    }
  };

  const canUserEdit = canEditSetlist() || canEditEvent();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Espace Musical"
        subtitle="Bibliothèque centrale de morceaux d'Artefacts Music — catalogue, partitions, grilles et audios."
        badge={<Badge variant="violet">Répertoire Central</Badge>}
        actions={
          canUserEdit ? (
            <Button
              variant="violet"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => setIsModalOpen(true)}
            >
              Nouveau Morceau
            </Button>
          ) : undefined
        }
      />

      {/* Barre de filtre & recherche instantanée */}
      <div
        className="space-y-3 p-3.5 rounded-2xl"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Onglets Filtres */}
          <div
            className="flex flex-wrap items-center gap-1 p-1 rounded-xl w-full sm:w-auto"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "all"
                  ? "bg-violet-600 text-white shadow-sm font-bold"
                  : "hover:text-white"
              }`}
              style={{ color: activeTab === "all" ? undefined : "var(--text-muted)" }}
            >
              Tous ({songs.length})
            </button>

            <button
              onClick={() => setActiveTab("a_travailler")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "a_travailler"
                  ? "bg-amber-500 text-white shadow-sm font-bold"
                  : "hover:text-white"
              }`}
              style={{ color: activeTab === "a_travailler" ? undefined : "var(--text-muted)" }}
            >
              À travailler
            </button>

            <button
              onClick={() => setActiveTab("en_cours")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "en_cours"
                  ? "bg-violet-600 text-white shadow-sm font-bold"
                  : "hover:text-white"
              }`}
              style={{ color: activeTab === "en_cours" ? undefined : "var(--text-muted)" }}
            >
              En cours
            </button>

            <button
              onClick={() => setActiveTab("pret")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "pret"
                  ? "bg-emerald-600 text-white shadow-sm font-bold"
                  : "hover:text-white"
              }`}
              style={{ color: activeTab === "pret" ? undefined : "var(--text-muted)" }}
            >
              Prêts
            </button>

            {user && (
              <button
                onClick={() => setActiveTab("favorites")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                  activeTab === "favorites"
                    ? "bg-amber-500 text-white shadow-sm font-bold"
                    : "text-amber-400 hover:text-amber-300"
                }`}
              >
                <Star className="h-3.5 w-3.5 fill-current" />
                <span>Mes Favoris</span>
              </button>
            )}
          </div>
        </div>

        {/* Recherche instantanée */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 pointer-events-none" style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un morceau par titre ou artiste..."
            className="w-full h-9 pl-9 pr-3 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/40"
          />
        </div>
      </div>

      {/* Liste des Morceaux (Cartes compactes mobile-first) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredSongs.length === 0 ? (
          <div className="sm:col-span-2">
            <Card className="p-8 text-center border-dashed">
              <Music className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-900">Aucun morceau trouvé</h3>
              <p className="text-xs text-slate-500 mt-1">
                Aucun titre ne correspond à votre recherche ou à vos favoris.
              </p>
            </Card>
          </div>
        ) : (
          filteredSongs.map((song) => {
            const isFav = user && song.favorisUserIds?.includes(user.id);
            const audioCount = song.audios?.length || 0;
            const fileCount = song.files?.length || 0;

            return (
              <Link key={song.id} href={`/espace-musical/${song.id}`} className="block">
                <div
                  className="glass-card-interactive p-4 rounded-2xl space-y-2 h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                        {getStatusBadge(song.statut)}
                        {song.formations?.map((f) => (
                          <Badge key={f} variant="neutral" size="sm">
                            {f}
                          </Badge>
                        ))}
                      </div>

                      {user && (
                        <button
                          type="button"
                          onClick={(e) => handleToggleFav(e, song.id)}
                          className="p-1 rounded-lg transition-colors shrink-0"
                          style={{ color: isFav ? "#FCD34D" : "var(--text-faint)" }}
                          title="Ajouter aux favoris"
                        >
                          <Star
                            className={`h-4 w-4 ${
                              isFav ? "fill-current" : ""
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    <h3 className="text-sm font-bold leading-snug break-words" style={{ color: "var(--text-primary)" }}>
                      {song.titre}
                    </h3>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: "var(--accent-violet)" }}>
                      {song.artiste}
                    </p>
                    {song.arrangementInfo && (
                      <p className="text-[11px] mt-1 font-medium" style={{ color: "var(--text-muted)" }}>
                        {song.arrangementInfo}
                      </p>
                    )}
                  </div>

                  <div
                    className="pt-3 flex items-center justify-between text-xs mt-2"
                    style={{ borderTop: "1px solid var(--border-subtle)", color: "var(--text-muted)" }}
                  >
                    <div className="flex items-center gap-3 text-[11px]">
                      {audioCount > 0 && (
                        <span className="flex items-center gap-1 font-semibold" style={{ color: "#A78BFA" }}>
                          <FileAudio className="h-3.5 w-3.5" />
                          {audioCount} audio{audioCount > 1 ? "s" : ""}
                        </span>
                      )}
                      {fileCount > 0 && (
                        <span className="flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                          <FileText className="h-3.5 w-3.5" />
                          {fileCount} fichier{fileCount > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 font-semibold shrink-0" style={{ color: "#A78BFA" }}>
                      <span>Consulter</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* Modal de création d'un morceau */}
      <SongFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateSong}
      />
    </div>
  );
}
