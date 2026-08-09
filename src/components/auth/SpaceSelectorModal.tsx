"use client";

import React from "react";
import { Music, Shield, Check, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ActiveSpace } from "@/types/auth";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface SpaceSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SpaceSelectorModal({ isOpen, onClose }: SpaceSelectorModalProps) {
  const { user, isHybridProduction, activeSpace, setActiveSpace } = useAuth();

  if (!isOpen || !isHybridProduction || !user) return null;

  const handleSelectSpace = (space: ActiveSpace) => {
    setActiveSpace(space);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay translucide */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Boîte de dialogue épurée style Apple/Linear */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 z-50 text-center space-y-6">
        <div>
          <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-mediterranean-50 text-mediterranean-600 flex items-center justify-center">
            <Sparkles className="h-6 w-6" />
          </div>

          <Badge variant="violet" className="mb-2">
            Rôle Hybride Détecté
          </Badge>

          <h2 className="text-xl font-bold text-slate-900 tracking-tight sm:text-2xl">
            Comment souhaitez-vous accéder à Artefacts Music ?
          </h2>

          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Bonjour {user.prenom}, vous disposez d&apos;un accès double (Musicien & Chargé de production). Choisissez votre mode d&apos;affichage.
          </p>
        </div>

        {/* 2 Choix élégants grand format mobile-first */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {/* Choix 1: Espace Musicien */}
          <Card
            interactive
            onClick={() => handleSelectSpace("musician")}
            className={`p-5 relative transition-all border-2 ${
              activeSpace === "musician"
                ? "border-mediterranean-500 bg-mediterranean-50/30 ring-2 ring-mediterranean-500/20"
                : "border-slate-200/80 hover:border-mediterranean-300"
            }`}
          >
            {activeSpace === "musician" && (
              <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-mediterranean-500 text-white flex items-center justify-center">
                <Check className="h-3 w-3" />
              </div>
            )}
            <div className="h-10 w-10 rounded-xl bg-mediterranean-100 text-mediterranean-700 flex items-center justify-center mb-3">
              <Music className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Espace musicien</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Consulter mon planning, mes prestations, la setlist et mes indisponibilités.
            </p>
          </Card>

          {/* Choix 2: Espace Production */}
          <Card
            interactive
            onClick={() => handleSelectSpace("production")}
            className={`p-5 relative transition-all border-2 ${
              activeSpace === "production"
                ? "border-violet-500 bg-violet-50/30 ring-2 ring-violet-500/20"
                : "border-slate-200/80 hover:border-violet-300"
            }`}
          >
            {activeSpace === "production" && (
              <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-violet-500 text-white flex items-center justify-center">
                <Check className="h-3 w-3" />
              </div>
            )}
            <div className="h-10 w-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center mb-3">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Espace production</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Gérer les événements, les équipes, le matériel et la logistique globale.
            </p>
          </Card>
        </div>

        <div className="pt-2">
          <Button
            variant="outline"
            size="md"
            className="w-full"
            onClick={onClose}
          >
            Continuer vers mon espace
          </Button>
        </div>
      </div>
    </div>
  );
}
