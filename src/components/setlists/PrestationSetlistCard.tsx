"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { setlistService } from "@/lib/setlist-service";
import { songService } from "@/lib/song-service";
import { Setlist, SetlistItem, SetlistStatus } from "@/types/setlist";
import { Prestation } from "@/types/prestation";
import { Song } from "@/types/song";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { AudioPlayer } from "@/components/songs/AudioPlayer";
import { SetlistFormModal } from "./SetlistFormModal";
import { IRealImportModal } from "./IRealImportModal";
import {
  Music,
  FileCode,
  Download,
  Upload,
  Plus,
  Edit,
  Heart,
  FileAudio,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface PrestationSetlistCardProps {
  prestation: Prestation;
}

export function PrestationSetlistCard({ prestation }: PrestationSetlistCardProps) {
  const { user, canEditSetlist, canEditEvent, isResponsibleForEvent } = useAuth();
  const [setlist, setSetlist] = useState<Setlist | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [activeAudioSongId, setActiveAudioSongId] = useState<string | null>(null);

  const loadSetlist = React.useCallback(() => {
    setSetlist(setlistService.getSetlistForPrestation(prestation.id));
  }, [prestation.id]);

  useEffect(() => {
    loadSetlist();
  }, [loadSetlist]);

  const handleSaveSetlist = (items: Omit<SetlistItem, "id">[], statut: SetlistStatus) => {
    const updated = setlistService.saveSetlist(
      prestation.id,
      items,
      statut,
      user ? `${user.prenom} ${user.nom}` : "Production"
    );
    setSetlist(updated);
  };

  const handleImportIReal = (fileData: { nom: string; content: string }) => {
    const updated = setlistService.importIRealFile(
      prestation.id,
      fileData,
      user ? `${user.prenom} ${user.nom}` : "Production"
    );
    setSetlist(updated);
  };

  const handleDownloadIReal = () => {
    if (!setlist?.irealFile) return;
    const blob = new Blob([setlist.irealFile.content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = setlist.irealFile.nom;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isUserResponsible = isResponsibleForEvent(prestation);
  const canUserEdit = canEditSetlist() || canEditEvent(prestation) || isUserResponsible;

  // Calcul règle d'expiration iReal Pro HTML (+24h après la date)
  const isIRealAvailable = setlistService.isIRealFileAvailable(prestation.date);

  // Masquage si brouillon et utilisateur simple
  if (setlist && setlist.statut === "brouillon" && !canUserEdit) {
    return (
      <Card className="p-5 border-dashed border-slate-300 bg-slate-50/60 text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Music className="h-4 w-4 text-violet-500" />
          <span>Setlist & Programme Musical</span>
        </div>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          La setlist est actuellement en cours de préparation par le responsable de prestation.
        </p>
        <Badge variant="warning" size="sm">
          Setlist en brouillon
        </Badge>
      </Card>
    );
  }

  return (
    <div id="setlist-section">
      <Card className="p-5 sm:p-6 space-y-5 border-violet-200">
      {/* En-tête de la Setlist */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="violet">Programme Musical</Badge>
            {setlist?.statut === "publiee" ? (
              <Badge variant="success">Setlist Publiée</Badge>
            ) : (
              <Badge variant="warning">Brouillon</Badge>
            )}
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Music className="h-5 w-5 text-violet-600" />
            <span>Setlist de la prestation</span>
          </h3>
        </div>

        {canUserEdit && (
          <div className="flex items-center gap-2 self-start sm:self-center">
            <Button
              variant="violet"
              size="sm"
              onClick={() => setIsFormOpen(true)}
              icon={<Edit className="h-3.5 w-3.5" />}
            >
              {setlist ? "Modifier la setlist" : "Créer la setlist"}
            </Button>
          </div>
        )}
      </div>

      {/* BLOC iREAL PRO HTML (Prompt 010) */}
      <div className="p-4 bg-gradient-to-br from-violet-900 to-slate-900 rounded-2xl text-white space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="h-5 w-5 text-violet-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-violet-200">
              Setlist iReal Pro HTML
            </span>
          </div>

          {canUserEdit && (
            <button
              onClick={() => setIsImportOpen(true)}
              className="text-xs text-violet-300 hover:text-white underline font-semibold flex items-center gap-1"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>{setlist?.irealFile ? "Remplacer" : "Importer HTML"}</span>
            </button>
          )}
        </div>

        {!setlist?.irealFile ? (
          <div className="text-xs text-violet-300 italic">
            Aucun fichier HTML iReal Pro importé pour cette date.
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="space-y-0.5">
              <div className="text-sm font-bold text-white">
                {setlist.irealFile.nom}
              </div>
              <div className="text-[11px] text-violet-300">
                Mis à jour le {new Date(setlist.irealFile.importedAt).toLocaleDateString("fr-FR")} par {setlist.irealFile.importedBy}
              </div>
            </div>

            {/* Bouton de téléchargement avec Règle d'expiration +24h */}
            {isIRealAvailable ? (
              <Button
                variant="violet"
                size="sm"
                onClick={handleDownloadIReal}
                className="bg-violet-600 hover:bg-violet-500 text-white shadow-sm"
                icon={<Download className="h-4 w-4" />}
              >
                Télécharger pour iReal Pro
              </Button>
            ) : (
              <div className="text-[11px] text-amber-300 bg-amber-950/40 p-2 rounded-xl border border-amber-500/30">
                ⏳ Fichier iReal Pro expiré (disponible jusqu&apos;au lendemain 23h59).
              </div>
            )}
          </div>
        )}
      </div>

      {/* LISTE DE LA SETLIST (Morceaux numérotés, Demandes client & Audios) */}
      {!setlist || setlist.items.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
          <Music className="h-8 w-8 text-slate-400 mx-auto" />
          <h4 className="text-base font-bold text-slate-900">Setlist pas encore créée</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Le responsable de prestation n&apos;a pas encore composé le programme musical.
          </p>
          {canUserEdit && (
            <Button
              variant="violet"
              size="sm"
              onClick={() => setIsFormOpen(true)}
              icon={<Plus className="h-4 w-4" />}
              className="mt-2"
            >
              Créer la setlist
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {setlist.items.map((item, idx) => {
            const song = songService.getById(item.songId);
            if (!song) return null;

            const hasAudios = song.audios && song.audios.length > 0;
            const isAudioActive = activeAudioSongId === song.id;

            return (
              <div
                key={item.id}
                className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 transition-colors space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <span className="text-base font-black text-violet-600 w-6 shrink-0 pt-0.5">
                      {idx + 1}.
                    </span>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900 break-words leading-tight">
                          {song.titre}
                        </h4>
                        {item.isDemandeClient && (
                          <Badge variant="rose" size="sm">
                            <Heart className="h-3 w-3 fill-current mr-1" />
                            Demande Mariés / Client
                          </Badge>
                        )}
                      </div>

                      <div className="text-xs font-semibold text-violet-700">
                        {song.artiste}
                      </div>

                      {item.notes && (
                        <p className="text-xs text-slate-600 bg-white p-2 rounded-xl border border-slate-100 italic">
                          💡 Consigne : {item.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Rapides: Écoute Audio & Fiche Morceau */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {hasAudios && (
                      <button
                        type="button"
                        onClick={() =>
                          setActiveAudioSongId(isAudioActive ? null : song.id)
                        }
                        className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
                          isAudioActive
                            ? "bg-violet-600 text-white"
                            : "bg-violet-100 hover:bg-violet-200 text-violet-900"
                        }`}
                        title="Écouter les audios de répétition"
                      >
                        <FileAudio className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Audio</span>
                      </button>
                    )}

                    <Link href={`/espace-musical/${song.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<ArrowRight className="h-3.5 w-3.5" />}
                      >
                        Fiche
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Lecteur Audio déplié si sélectionné */}
                {isAudioActive && hasAudios && (
                  <div className="pt-2 border-t border-slate-200/80 space-y-2">
                    <div className="text-[11px] font-bold text-violet-800 uppercase tracking-wider">
                      Audios de répétition ({song.audios?.length})
                    </div>
                    {song.audios?.map((audio) => (
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
              </div>
            );
          })}
        </div>
      )}

      {/* Modals Formulaire Setlist & Import iReal Pro */}
      <SetlistFormModal
        isOpen={isFormOpen}
        prestationId={prestation.id}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveSetlist}
        initialSetlist={setlist}
      />

      <IRealImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={handleImportIReal}
        currentFileName={setlist?.irealFile?.nom}
      />
    </Card>
    </div>
  );
}
