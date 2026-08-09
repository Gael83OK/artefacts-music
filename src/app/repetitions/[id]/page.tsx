"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { repetitionService } from "@/lib/repetition-service";
import { songService } from "@/lib/song-service";
import { authService } from "@/lib/auth-service";
import { Repetition } from "@/types/repetition";
import { Song, SongStatus } from "@/types/song";
import { AuthUser } from "@/types/auth";
import { AudioPlayer } from "@/components/songs/AudioPlayer";
import { AddAudioModal } from "@/components/repetitions/AddAudioModal";
import { RepetitionFormModal } from "@/components/repetitions/RepetitionFormModal";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/context/AuthContext";
import { ROLE_DISPLAY_NAMES } from "@/lib/mock-users";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Mic2,
  Users,
  Music,
  FileAudio,
  Plus,
  Edit,
  Trash2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function RepetitionDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { user, canManageRehearsals, canEditEvent } = useAuth();

  const [repetition, setRepetition] = useState<Repetition | null>(null);
  const [musicians, setMusicians] = useState<AuthUser[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);

  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const data = repetitionService.getById(id);
    if (data) {
      setRepetition(data);
      const team = data.musicianIds
        .map((mId) => authService.getProfileById(mId))
        .filter((u): u is AuthUser => u !== null);
      setMusicians(team);

      if (data.songIds && data.songIds.length > 0) {
        const linkedSongs = data.songIds
          .map((sId) => songService.getById(sId))
          .filter((s): s is Song => s !== null);
        setSongs(linkedSongs);
      } else {
        setSongs([]);
      }
    }
  }, [id]);

  if (!repetition) {
    return (
      <div className="space-y-6 text-center py-12">
        <h2 className="text-xl font-bold text-slate-900">Répétition introuvable</h2>
        <p className="text-xs text-slate-500">
          Cette répétition n&apos;existe pas ou a été annulée.
        </p>
        <Link href="/calendrier">
          <Button variant="mediterranean" icon={<ArrowLeft className="h-4 w-4" />}>
            Retour au calendrier
          </Button>
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(repetition.date).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleAddAudio = (audioData: { titre: string; url: string; description?: string; songId?: string }) => {
    const updated = repetitionService.addAudioToRepetition(
      repetition.id,
      { titre: audioData.titre, url: audioData.url, description: audioData.description },
      user ? `${user.prenom} ${user.nom}` : "Artiste",
      audioData.songId
    );
    if (updated) {
      setRepetition(updated);
    }
  };

  const handleSaveEdit = (data: Omit<Repetition, "id" | "updatedAt">) => {
    const updated = repetitionService.update(
      repetition.id,
      data,
      user ? `${user.prenom} ${user.nom}` : "Production"
    );
    if (updated) {
      setRepetition(updated);
      setMusicians(
        updated.musicianIds
          .map((mId) => authService.getProfileById(mId))
          .filter((u): u is AuthUser => u !== null)
      );
      if (updated.songIds) {
        setSongs(
          updated.songIds
            .map((sId) => songService.getById(sId))
            .filter((s): s is Song => s !== null)
        );
      }
    }
  };

  const getSongStatusBadge = (statut: SongStatus) => {
    switch (statut) {
      case "pret":
        return <Badge variant="success" size="sm">Prêt</Badge>;
      case "arrangement_commence":
        return <Badge variant="violet" size="sm">Arrangement commencé</Badge>;
      case "a_arranger":
        return <Badge variant="warning" size="sm">À arranger</Badge>;
      case "en_cours":
        return <Badge variant="violet" size="sm">En cours</Badge>;
      case "a_travailler":
        return <Badge variant="warning" size="sm">À travailler</Badge>;
      case "archive":
        return <Badge variant="neutral" size="sm">Archivé</Badge>;
    }
  };

  const canUserEdit = canManageRehearsals() || canEditEvent();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <Link href="/repetitions">
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="h-4 w-4" />}>
            Retour aux répétitions
          </Button>
        </Link>

        {canUserEdit && (
          <Button
            variant="violet"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            icon={<Edit className="h-4 w-4" />}
          >
            Modifier la séance
          </Button>
        )}
      </div>

      <PageHeader
        title={repetition.titre}
        subtitle={`Session de répétition • ${formattedDate}`}
        badge={<Badge variant="violet">Studio & Travail</Badge>}
      />

      {/* Carte principale de la répétition */}
      <Card className="p-6 space-y-4 border-violet-200">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="violet">
                {repetition.formation ? `Formation ${repetition.formation}` : "Répétition"}
              </Badge>
              <Badge variant="success">Confirmé</Badge>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {repetition.titre}
            </h1>
          </div>
        </div>

        {/* Date, Horaire & Lieu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Date & Horaire
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 capitalize">
              <Calendar className="h-4 w-4 text-violet-500 shrink-0" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
              <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>{repetition.heureDebut} - {repetition.heureFin}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Lieu du Studio
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
              <span>{repetition.lieu}</span>
            </div>
            {repetition.adresse && (
              <p className="text-xs text-slate-500">{repetition.adresse}</p>
            )}
          </div>
        </div>

        {/* OBJET DE LA RÉPÉTITION (Mise en avant claire) */}
        {repetition.objet && (
          <div className="bg-violet-50/80 rounded-2xl p-4 border border-violet-200 space-y-1">
            <div className="text-xs font-bold text-violet-800 uppercase tracking-wider flex items-center gap-1.5">
              <Mic2 className="h-4 w-4 text-violet-600" />
              Objet de la répétition
            </div>
            <p className="text-sm font-bold text-slate-900 leading-relaxed">
              &quot;{repetition.objet}&quot;
            </p>
          </div>
        )}
      </Card>

      {/* Musiciens Convoqués */}
      <Card className="p-5 space-y-3">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Users className="h-4 w-4 text-slate-500" />
          Musiciens Convoqués ({musicians.length} artistes)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {musicians.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100"
            >
              <Avatar name={`${m.prenom} ${m.nom}`} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-slate-800 truncate">
                  {m.prenom} {m.nom}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {m.instrument || ROLE_DISPLAY_NAMES[m.role]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Morceaux à Travailler (Liaison avec la Bibliothèque centrale) */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Music className="h-4 w-4 text-violet-600" />
            <span>Morceaux à travailler ({songs.length})</span>
          </div>
        </div>

        {songs.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
            Aucun morceau prévu pour cette répétition.
          </div>
        ) : (
          <div className="space-y-2">
            {songs.map((s) => (
              <Link key={s.id} href={`/espace-musical/${s.id}`} className="block">
                <div className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 transition-colors text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{s.titre}</span>
                      <span className="text-slate-500">({s.artiste})</span>
                    </div>
                    {s.arrangementInfo && (
                      <p className="text-[11px] text-slate-500 truncate max-w-md">
                        Arrangement: {s.arrangementInfo}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {getSongStatusBadge(s.statut)}
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>

      {/* Audios de Répétition & Enregistrement Mobile */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <FileAudio className="h-4 w-4 text-rose-600" />
            <span>Audios de Répétition ({repetition.audios?.length || 0})</span>
          </div>

          <Button
            variant="violet"
            size="sm"
            onClick={() => setIsAudioModalOpen(true)}
            icon={<Plus className="h-3.5 w-3.5" />}
          >
            Ajouter un audio
          </Button>
        </div>

        {!repetition.audios || repetition.audios.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
            Aucun audio disponible. Cliquez sur &quot;Ajouter un audio&quot; pour importer un MP3 ou enregistrer une prise au micro.
          </div>
        ) : (
          <div className="space-y-3">
            {repetition.audios.map((audio) => (
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

      {/* Modal Ajout Audio Mobile */}
      <AddAudioModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
        onAddAudio={handleAddAudio}
        rehearsalSongs={songs}
      />

      {/* Modal Modification Répétition */}
      <RepetitionFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        initialData={repetition}
      />
    </div>
  );
}
