"use client";

import React, { useState } from "react";
import { Music, Shield, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { SpaceSelectorModal } from "./SpaceSelectorModal";

export function SpaceSwitcher() {
  const { isHybridProduction, activeSpace, switchSpace } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  if (!isHybridProduction) return null;

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border transition-all shadow-sm bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
        title="Changer d'espace d'affichage (Musicien / Production)"
      >
        {activeSpace === "production" ? (
          <>
            <Shield className="h-3.5 w-3.5 text-violet-600" />
            <span className="text-violet-700 font-bold">Vue Production</span>
          </>
        ) : (
          <>
            <Music className="h-3.5 w-3.5 text-mediterranean-600" />
            <span className="text-mediterranean-700 font-bold">Vue Musicien</span>
          </>
        )}
        <RefreshCw className="h-3 w-3 text-slate-400 ml-0.5" />
      </button>

      <SpaceSelectorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
