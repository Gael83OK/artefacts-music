"use client";

import React from "react";
import { AlertTriangle, Trash2, Archive, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  prestationTitle: string;
  onClose: () => void;
  onConfirmDelete: () => void;
  onConfirmArchive?: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  prestationTitle,
  onClose,
  onConfirmDelete,
  onConfirmArchive,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-rose-200 z-50 text-center space-y-4">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
          <AlertTriangle className="h-6 w-6" />
        </div>

        <div>
          <Badge variant="rose" className="mb-2">
            Action Sécurisée
          </Badge>
          <h3 className="text-lg font-bold text-slate-900">
            Supprimer la prestation ?
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Êtes-vous sûr de vouloir supprimer la prestation{" "}
            <strong className="text-slate-800">&quot;{prestationTitle}&quot;</strong> ?
            Cette action ne peut pas être déclenchée accidentellement.
          </p>
        </div>

        <div className="pt-2 space-y-2">
          {onConfirmArchive && (
            <Button
              variant="outline"
              size="md"
              className="w-full text-amber-700 border-amber-200 hover:bg-amber-50"
              onClick={onConfirmArchive}
              icon={<Archive className="h-4 w-4" />}
            >
              Archiver / Passer en &quot;Annulé&quot; (Recommandé)
            </Button>
          )}

          <Button
            variant="rose"
            size="md"
            className="w-full"
            onClick={onConfirmDelete}
            icon={<Trash2 className="h-4 w-4" />}
          >
            Supprimer définitivement
          </Button>

          <Button variant="ghost" size="sm" className="w-full" onClick={onClose}>
            Annuler
          </Button>
        </div>
      </div>
    </div>
  );
}
