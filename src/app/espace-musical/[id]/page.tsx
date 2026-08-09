"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { songService } from "@/lib/song-service";
import { prestationService } from "@/lib/prestation-service";
import { repetitionService } from "@/lib/repetition-service";
import { Song, SongStatus } from "@/types/song";
import { Prestation } from "@/types/prestation";
import { Repetition } from "@/types/repetition";
import { AudioPlayer } from "@/components/songs/AudioPlayer";
import { SongFormModal } from "@/components/songs/SongFormModal";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft,
  Music,
  Star,
  FileText,
  FileAudio,
  Calendar,
  Clock,
  Edit,
  Trash2,
  Download,
  Eye,
  Mic2,
  Sparkles,
  Plus,
} from "lucide-react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function SongDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { user, canEditEvent, canEditSetlist } = useAuth();

  const [song, setSong] = useState<Song | null>(null);
  const [isFav, setIsFav] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [prestations, setPrestations] = useState<Prestation[]>([]);
  const [repetitions, setRepetitions] = useState<Repetition[]>([]);

  useEffect(() => {
    const data = songService.getById(id);
    if (data) {
      setSong(data);
      if (user) {
        setIsFav(songService.isFavorite(id, user.id));
      }

      // Fetch linked prestations & repetitions
      if (data.prestationIds && data.prestationIds.length > 0) {
        const linkedP = data.prestationIds
          .map((pId) => prestationService.getById(pId))
          .filter((p): p is Prestation => p !== null);
        setPrestations(linkedP);
      }

      if (data.repetitionIds && data.repetitionIds.length > 0) {
        const linkedR = data.repetitionIds
          .map((rId) => repetitionService.getById(rId))
          .filter((r): r is Repetition => r !== null);
        setRepetitions(linkedR);
      }
    }
  }, [id, user]);

  if (!song) {
    return (
      <div className="space-y-6 text-center py-12">
        <h2 className="text-xl font-bold text-slate-900">Morceau introuvable</h2>
        <p className="text-xs text-slate-500">
          Ce morceau n&apos;existe pas dans le répertoire.
        </p>
        <Link href="/espace-musical">
          <Button variant="violet" icon={<ArrowLeft className="h-4 w-4" />}>
            Retour à l&apos;espace musical
          </Button>
        </Link>
      </div>
    );
  }

  const handleToggleFavorite = () => {
    if (!user) return;
    const nowFav = songService.toggleFavorite(song.id, user.id);
    setIsFav(nowFav);
  };

  const handleSave = (updatedData: Omit<Song, "id" | "updatedAt">) => {
    const updated = songService.update(
      song.id,
      updatedData,
      user ? `${user.prenom} ${user.nom}` : "Production"
    );
    if (updated) {
      setSong(updated);
    }
  };

  const handleDelete = () => {
    if (confirm(`Voulez-vous vraiment supprimer ou archiver le morceau "${song.titre}" ?`)) {
      const res = songService.delete(song.id);
      if (res.archived) {
        alert(`Le morceau "${song.titre}" est utilisé dans des setlists/répétitions. Il a été archivé pour préserver l'historique.`);
      }
      window.location.href = "/espace-musical";
    }
  };


  const getStatusBadge = (statut: SongStatus) => {
    switch (statut) {
      case "pret":
        return <Badge variant="success">Prêt pour scène</Badge>;
      case "en_cours":
        return <Badge variant="violet">En cours d&apos;apprentissage</Badge>;
      case "a_travailler":
        return <Badge variant="warning">À travailler</Badge>;
      case "archive":
        return <Badge variant="neutral">Archivé</Badge>;
    }
  };

  const canUserEdit = canEditSetlist() || canEditEvent();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <Link href="/espace-musical">
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="h-4 w-4" />}>
            Retour à la bibliothèque
          </Button>
        </Link>

        {canUserEdit && (
          <div className="flex items-center gap-2">
            <Button
              variant="violet"
              size="sm"
              onClick={() => setIsEditOpen(true)}
              icon={<Edit className="h-4 w-4" />}
            >
              Modifier le morceau
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              icon={<Trash2 className="h-4 w-4 text-rose-500" />}
              className="hover:border-rose-300 hover:bg-rose-50 text-rose-600"
            >
              Supprimer
            </Button>
          </div>
        )}
      </div>


      {/* Carte principale d'en-tête du morceau */}
      <Card className="p-6 space-y-4 border-violet-200">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {getStatusBadge(song.statut)}
              {song.formations?.map((f) => (
                <Badge key={f} variant="neutral" size="sm">
                  {f}
                </Badge>
              ))}
            </div>

            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {song.titre}
            </h1>
            <p className="text-sm font-semibold text-violet-600">
              Artiste : {song.artiste}
            </p>
          </div>

          {/* Bouton Favori Personnel */}
          {user && (
            <button
              onClick={handleToggleFavorite}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                isFav
                  ? "bg-amber-100 text-amber-800 border border-amber-300 shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200"
              }`}
            >
              <Star className={`h-4 w-4 ${isFav ? "fill-amber-500 text-amber-500" : ""}`} />
              <span>{isFav ? "Favori" : "Ajouter aux favoris"}</span>
            </button>
          )}
        </div>

        {/* Consignes d'Arrangement */}
        {song.arrangementInfo && (
          <div className="p-4 bg-violet-50/70 rounded-2xl border border-violet-200 space-y-1">
            <div className="text-xs font-bold text-violet-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-violet-600" />
              Consignes d&apos;Arrangement & Structure
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {song.arrangementInfo}
            </p>
          </div>
        )}
      </Card>

      {/* SECTION 1: Audios & Historique des Prises (Prompt 007) */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <FileAudio className="h-4 w-4 text-violet-600" />
            <span>Audios & Maquettes de Travail ({song.audios?.length || 0})</span>
          </div>
        </div>

        {!song.audios || song.audios.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
            Aucun audio disponible pour ce morceau.
          </div>
        ) : (
          <div className="space-y-3">
            {song.audios.map((audio) => (
              <AudioPlayer
                key={audio.id}
                title={audio.titre}
                url={audio.url}
                date={audio.dateAjout}
                author={audio.auteur}
                description={audio.description}
              />
            ))}
          </div>
        )}
      </Card>

      {/* SECTION 2: Fichiers Associés (Partitions, Grilles, iReal Pro) */}
      <Card className="p-5 space-y-3">
        <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <FileText className="h-4 w-4 text-mediterranean-600" />
          <span>Fichiers, Partitions & Grilles ({song.files?.length || 0})</span>
        </div>

        {!song.files || song.files.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
            Aucun fichier disponible
          </div>
        ) : (
          <div className="space-y-2">
            {song.files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Badge variant={file.type === "ireal" ? "violet" : "mediterranean"} size="sm">
                    {file.type.toUpperCase()}
                  </Badge>
                  <div className="truncate">
                    <div className="font-semibold text-slate-800 truncate">{file.nom}</div>
                    <div className="text-[11px] text-slate-400">
                      {file.taille ? `${file.taille} • ` : ""}{file.auteur || "Production"}
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert(`Téléchargement de ${file.nom}`)}
                  icon={<Download className="h-3.5 w-3.5" />}
                >
                  Télécharger
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* SECTION 4: Prestations Associées */}
      {prestations.length > 0 && (
        <Card className="p-5 space-y-3">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="h-4 w-4 text-mediterranean-600" />
            <span>Prestations associées ({prestations.length})</span>
          </div>

          <div className="space-y-2">
            {prestations.map((p) => (
              <Link key={p.id} href={`/evenement/${p.id}`} className="block">
                <div className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 transition-colors text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{p.titre}</div>
                    <div className="text-slate-500 mt-0.5">
                      📅 {p.date} • 📍 {p.lieu}
                    </div>
                  </div>
                  <Badge variant="mediterranean" size="sm">
                    Voir la fiche
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* SECTION 5: Répétitions Associées */}
      {repetitions.length > 0 && (
        <Card className="p-5 space-y-3">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Mic2 className="h-4 w-4 text-violet-600" />
            <span>Répétitions associées ({repetitions.length})</span>
          </div>

          <div className="space-y-2">
            {repetitions.map((r) => (
              <Link key={r.id} href={`/repetitions/${r.id}`} className="block">
                <div className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 transition-colors text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{r.titre}</div>
                    <div className="text-slate-500 mt-0.5">
                      📅 {r.date} • 📍 {r.lieu}
                    </div>
                  </div>
                  <Badge variant="violet" size="sm">
                    Détails répétition
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* Formulaire modal de modification */}
      <SongFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSave}
        initialData={song}
      />
    </div>
  );
}
