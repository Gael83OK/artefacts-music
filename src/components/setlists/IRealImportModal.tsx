"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { X, Upload, FileCode, Save, AlertCircle } from "lucide-react";

interface IRealImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (fileData: { nom: string; content: string }) => void;
  currentFileName?: string;
}

export function IRealImportModal({
  isOpen,
  onClose,
  onImport,
  currentFileName,
}: IRealImportModalProps) {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "html" && ext !== "htm") {
      setError("Veuillez sélectionner un fichier HTML exporté depuis iReal Pro (.html).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setFileContent(content);
      setFileName(file.name);
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileContent || !fileName) {
      setError("Veuillez sélectionner un fichier HTML.");
      return;
    }

    onImport({
      nom: fileName,
      content: fileContent,
    });

    onClose();
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
            <Badge variant="violet">Fichier iReal Pro HTML</Badge>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              {currentFileName ? "Remplacer la setlist iReal Pro" : "Importer le fichier iReal Pro"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {currentFileName && (
          <div className="p-3 bg-violet-50 border border-violet-200 rounded-xl text-xs text-violet-900">
            ℹ️ Version actuelle : <strong>{currentFileName}</strong>. Le nouvel import remplacera cette version.
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-3">
            <FileCode className="h-8 w-8 text-violet-600 mx-auto" />
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-900">
                Sélectionner l&apos;export HTML d&apos;iReal Pro
              </div>
              <p className="text-[11px] text-slate-500">
                Exportez la playlist depuis iReal Pro sur votre téléphone ou ordinateur (.html).
              </p>
            </div>

            <input
              type="file"
              accept=".html,.htm"
              onChange={handleFileSelect}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-violet-600 file:text-white hover:file:bg-violet-700"
            />

            {fileName && (
              <p className="text-xs text-emerald-600 font-semibold pt-2">
                ✅ Fichier prêt : {fileName}
              </p>
            )}
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              variant="violet"
              size="sm"
              icon={<Save className="h-4 w-4" />}
            >
              Enregistrer l&apos;import iReal Pro
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
