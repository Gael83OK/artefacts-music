"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Mic, Upload, Play, Square, Save, AlertCircle, Music } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { songService } from "@/lib/song-service";
import { Song } from "@/types/song";

interface AddAudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAudio: (data: { titre: string; url: string; description?: string; songId?: string }) => void;
  rehearsalSongs?: Song[];
}

const ALLOWED_EXTENSIONS = [".mp3", ".m4a", ".wav", ".aac", ".ogg", ".webm"];
const MAX_FILE_SIZE_MB = 25;

export function AddAudioModal({
  isOpen,
  onClose,
  onAddAudio,
  rehearsalSongs = [],
}: AddAudioModalProps) {
  const [tab, setTab] = useState<"file" | "record">("file");
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSongId, setSelectedSongId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // File upload state
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  // Live recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const allSongs = songService.getAll();
  const availableSongs = rehearsalSongs.length > 0 ? rehearsalSongs : allSongs;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Check extension
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setError(`Format non pris en charge (${ext}). Formats autorisés : MP3, M4A, WAV, AAC, OGG, WEBM.`);
      return;
    }

    // Check size limit
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`Le fichier est trop lourd (${(file.size / (1024 * 1024)).toFixed(1)} Mo). Limite : ${MAX_FILE_SIZE_MB} Mo.`);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setFileUrl(objectUrl);
    setFileName(file.name);
    if (!titre) {
      setTitre(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  // Live Microphone Recording
  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const recordedUrl = URL.createObjectURL(audioBlob);
        setFileUrl(recordedUrl);
        setFileName(`Enregistrement_Vocal_${new Date().toLocaleTimeString("fr-FR").replace(":", "h")}.webm`);
        if (!titre) {
          setTitre(`Prise micro — ${new Date().toLocaleTimeString("fr-FR").slice(0, 5)}`);
        }
        // Stop stream tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } catch {
      setError("Accès au microphone refusé ou non disponible sur cet appareil.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileUrl) {
      setError("Veuillez importer un fichier ou réaliser un enregistrement vocal.");
      return;
    }
    if (!titre.trim()) {
      setError("Veuillez donner un nom à la prise audio.");
      return;
    }

    onAddAudio({
      titre: titre.trim(),
      url: fileUrl,
      description: description.trim() || undefined,
      songId: selectedSongId || undefined,
    });

    onClose();
  };

  const formatSecs = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
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
            <Badge variant="violet">Module Audio Mobile</Badge>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Ajouter un audio de répétition
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Choix des onglets Fichier vs Record */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setTab("file")}
            className={`py-2 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 ${
              tab === "file"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Upload className="h-4 w-4 text-violet-600" />
            <span>Fichier (MP3 / M4A)</span>
          </button>

          <button
            type="button"
            onClick={() => setTab("record")}
            className={`py-2 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 ${
              tab === "record"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Mic className="h-4 w-4 text-rose-600" />
            <span>Enregistrer Micro</span>
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* TAB 1: Fichier audio */}
          {tab === "file" && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Sélectionner un fichier sur votre téléphone / ordinateur
              </label>
              <input
                type="file"
                accept=".mp3,.m4a,.wav,.aac,.ogg,.webm"
                onChange={handleFileChange}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              />
              {fileName && (
                <p className="text-xs text-emerald-600 font-semibold pt-1">
                  ✅ Fichier prêt : {fileName}
                </p>
              )}
            </div>
          )}

          {/* TAB 2: Enregistreur Micro Direct */}
          {tab === "record" && (
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="text-xs font-semibold text-slate-600">
                Enregistreur Vocal Direct (Micro Smartphone)
              </div>

              {!isRecording ? (
                <Button
                  type="button"
                  variant="violet"
                  size="md"
                  onClick={startRecording}
                  icon={<Mic className="h-4 w-4 text-rose-400" />}
                >
                  Démarrer l&apos;enregistrement
                </Button>
              ) : (
                <div className="space-y-2">
                  <div className="text-2xl font-black text-rose-600 animate-pulse">
                    ⏺ {formatSecs(recordingTime)}
                  </div>
                  <Button
                    type="button"
                    variant="rose"
                    size="md"
                    onClick={stopRecording}
                    icon={<Square className="h-4 w-4" />}
                  >
                    Arrêter & Sauvegarder
                  </Button>
                </div>
              )}

              {fileUrl && !isRecording && (
                <p className="text-xs text-emerald-600 font-semibold">
                  ✅ Prise vocale capturée avec succès !
                </p>
              )}
            </div>
          )}

          {/* Titre & Morceau associé */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Titre de la prise audio *
              </label>
              <input
                type="text"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                placeholder="ex: Take 1 - Solo piano / chant"
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500/30"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Associer à un morceau de la bibliothèque (optionnel)
              </label>
              <select
                value={selectedSongId}
                onChange={(e) => setSelectedSongId(e.target.value)}
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              >
                <option value="">-- Aucun morceau particulier --</option>
                {availableSongs.map((s) => (
                  <option key={s.id} value={s.id}>
                    🎵 {s.titre} ({s.artiste})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Description / Remarque
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="ex: Version ralentie pour recalage d'arrangement"
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              variant="violet"
              size="sm"
              icon={<Save className="h-4 w-4" />}
            >
              Ajouter l&apos;audio
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
