"use client";

import React from "react";
import { CentralDocument } from "@/types/document";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { X, Download, FileText, ExternalLink } from "lucide-react";

interface PdfPreviewModalProps {
  isOpen: boolean;
  document: CentralDocument | null;
  onClose: () => void;
}

export function PdfPreviewModal({
  isOpen,
  document,
  onClose,
}: PdfPreviewModalProps) {
  if (!isOpen || !document) return null;

  const isPdf = document.type === "pdf" || document.fileUrl.endsWith(".pdf");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 z-50 text-left space-y-4 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="min-w-0 pr-4">
            <Badge variant="mediterranean">Aperçu du Document</Badge>
            <h3 className="text-base font-bold text-slate-900 mt-1 truncate">
              {document.nom}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={document.fileUrl}
              download={document.nom}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="sm"
                icon={<Download className="h-4 w-4" />}
              >
                Télécharger
              </Button>
            </a>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Zone de prévisualisation ou message explicatif */}
        <div className="flex-1 bg-slate-100/80 rounded-2xl overflow-hidden border border-slate-200 min-h-[350px] flex flex-col items-center justify-center p-4">
          {isPdf ? (
            <iframe
              src={`${document.fileUrl}#toolbar=0`}
              className="w-full h-full min-h-[450px] rounded-xl border-none"
              title={`Aperçu PDF de ${document.nom}`}
            />
          ) : (
            <div className="text-center space-y-3 p-6 max-w-sm">
              <FileText className="h-12 w-12 text-slate-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900">
                Aperçu non disponible pour ce format ({document.type.toUpperCase()})
              </h4>
              <p className="text-xs text-slate-500">
                Vous pouvez télécharger directement le fichier pour le consulter sur votre appareil.
              </p>
              <a
                href={document.fileUrl}
                download={document.nom}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button
                  variant="mediterranean"
                  size="sm"
                  icon={<Download className="h-4 w-4" />}
                >
                  Télécharger {document.nom}
                </Button>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
