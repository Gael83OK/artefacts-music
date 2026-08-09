"use client";

import React, { useState, useRef } from "react";
import { Play, Pause, Volume2, Music, Clock, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AudioPlayerProps {
  title: string;
  url: string;
  date?: string;
  author?: string;
  description?: string;
}

export function AudioPlayer({
  title,
  url,
  date,
  author,
  description,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current || hasError) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => setHasError(true));
      setIsPlaying(true);
    }
  };

  const handleRetry = () => {
    setHasError(false);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.load();
    }
  };

  if (hasError) {
    return (
      <div className="p-3 bg-rose-50/80 rounded-2xl border border-rose-200/80 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          <div className="min-w-0">
            <span className="font-bold text-slate-900 truncate block">{title}</span>
            <span className="text-[11px] text-rose-600 font-semibold block">Audio indisponible</span>
          </div>
        </div>

        <button
          onClick={handleRetry}
          className="px-2.5 py-1 bg-white border border-rose-200 hover:bg-rose-100 text-rose-700 font-bold rounded-lg transition-colors flex items-center gap-1 shrink-0"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Réessayer</span>
        </button>
      </div>
    );
  }

  return (
    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
      <audio
        ref={audioRef}
        src={url}
        preload="none"
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onError={() => setHasError(true)}
      />



      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            type="button"
            onClick={togglePlay}
            className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-sm ${
              isPlaying
                ? "bg-violet-600 text-white ring-4 ring-violet-500/20"
                : "bg-mediterranean-500 hover:bg-mediterranean-600 text-white"
            }`}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </button>

          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-900 truncate">{title}</div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              {author && <span>{author}</span>}
              {date && <span>• {date}</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <Volume2 className="h-4 w-4" />
        </div>
      </div>

      {description && (
        <p className="text-[11px] text-slate-600 bg-white p-2 rounded-xl border border-slate-100 italic">
          ℹ️ {description}
        </p>
      )}
    </div>
  );
}
