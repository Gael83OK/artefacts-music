"use client";

import React, { useState, useEffect } from "react";
import { CentralDocument, DocCategory, DocType } from "@/types/document";
import { songService } from "@/lib/song-service";
import { prestationService } from "@/lib/prestation-service";
import { repetitionService } from "@/lib/repetition-service";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { X, Save, Upload, FileText, Link as LinkIcon } from "lucide-react";

import { validateFileUpload } from "@/lib/file-validation";

interface DocumentFormModalProps {
  isOpen: boolean;
  documentToEdit?: CentralDocument | null;
  onClose: () => void;
  onSave: (data: Partial<CentralDocument>) => void;
}

export function DocumentFormModal({
  isOpen,
  documentToEdit,
  onClose,
  onSave,
}: DocumentFormModalProps) {
  const [nom, setNom] = useState("");
  const [categorie, setCategorie] = useState<DocCategory>("musical");
  const [type, setType] = useState<DocType>("pdf");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [taille, setTaille] = useState("1.2 MB");
  const [errorMsg, setErrorMsg] = useState("");

  // Relations contextuelles
  const [songId, setSongId] = useState("");
  const [prestationId, setPrestationId] = useState("");
  const [repetitionId, setRepetitionId] = useState("");

  const songs = songService.getAll();
  const prestations = prestationService.getAll();
  const rehearsals = repetitionService.getAll();

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setErrorMsg("");
    setIsSubmitting(false);
    if (documentToEdit) {
      setNom(documentToEdit.nom);
      setCategorie(documentToEdit.categorie);
      setType(documentToEdit.type);
      setDescription(documentToEdit.description || "");
      setFileUrl(documentToEdit.fileUrl);
      setTaille(documentToEdit.taille || "1.2 MB");
      setSongId(documentToEdit.songId || "");
      setPrestationId(documentToEdit.prestationId || "");
      setRepetitionId(documentToEdit.repetitionId || "");
    } else {
      setNom("");
      setCategorie("musical");
      setType("pdf");
      setDescription("");
      setFileUrl("/docs/document-exemple.pdf");
      setTaille("1.2 MB");
      setSongId("");
      setPrestationId("");
      setRepetitionId("");
    }
  }, [documentToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMsg("");
    setIsSubmitting(true);

    // Validation du fichier (Prompt 021)
    const valResult = validateFileUpload({ name: nom.trim() }, type as any);
    if (!valResult.isValid) {
      setErrorMsg(valResult.errorMessage || "Format ou nom de fichier invalide.");
      setIsSubmitting(false);
      return;
    }

    const selectedSong = songs.find((s) => s.id === songId);
    const selectedPrest = prestations.find((p) => p.id === prestationId);
    const selectedReh = rehearsals.find((r) => r.id === repetitionId);

    onSave({
      nom: nom.trim(),
      categorie,
      type,
      fileUrl: fileUrl.trim() || "/docs/document-exemple.pdf",
      taille,
      description: description.trim() || undefined,
      songId: songId || undefined,
      songTitle: selectedSong?.titre,
      prestationId: prestationId || undefined,
      prestationTitle: selectedPrest?.titre,
      repetitionId: repetitionId || undefined,
      repetitionTitle: selectedReh?.titre,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 150);
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 z-50 text-left space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <Badge variant="mediterranean">
              {documentToEdit ? "Métadonnées du Document" : "Nouveau Document"}
            </Badge>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              {documentToEdit ? "Modifier le document" : "Ajouter un document central"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-semibold text-xs leading-relaxed">
              ⚠️ {errorMsg}
            </div>
          )}

          <div>

            <label className="block font-bold text-slate-900 mb-1">
              Nom du document *
            </label>
            <input
              type="text"
              required
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="ex: Partition_Chant_Shallow.pdf"
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-mediterranean-500/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-900 mb-1">Catégorie *</label>
              <select
                value={categorie}
                onChange={(e) => setCategorie(e.target.value as DocCategory)}
                className="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="musical">Musical</option>
                <option value="prestation">Prestations</option>
                <option value="repetition">Répétitions</option>
                <option value="administratif">Administratif</option>
                <option value="autre">Autres</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1">Format *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as DocType)}
                className="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="pdf">PDF</option>
                <option value="audio">Audio</option>
                <option value="html">HTML / iReal</option>
                <option value="office">Bureautique</option>
                <option value="autre">Autre</option>
              </select>
            </div>
          </div>

          {/* Liaison Contextuelle Transversale */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <label className="block font-bold text-slate-900 flex items-center gap-1.5">
              <LinkIcon className="h-3.5 w-3.5 text-mediterranean-600" />
              <span>Liaison Contextuelle (Morceau / Prestation)</span>
            </label>

            {categorie === "musical" && (
              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5">Associer à un morceau :</span>
                <select
                  value={songId}
                  onChange={(e) => setSongId(e.target.value)}
                  className="w-full h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs"
                >
                  <option value="">-- Aucun morceau lié --</option>
                  {songs.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.titre} ({s.artiste})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {categorie === "prestation" && (
              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5">Associer à une prestation :</span>
                <select
                  value={prestationId}
                  onChange={(e) => setPrestationId(e.target.value)}
                  className="w-full h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs"
                >
                  <option value="">-- Aucune prestation liée --</option>
                  {prestations.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.titre} ({p.date})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {categorie === "repetition" && (
              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5">Associer à une répétition :</span>
                <select
                  value={repetitionId}
                  onChange={(e) => setRepetitionId(e.target.value)}
                  className="w-full h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs"
                >
                  <option value="">-- Aucune répétition liée --</option>
                  {rehearsals.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.titre} ({r.date})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block font-bold text-slate-900 mb-1">
              Description facultative
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Notes explicatives..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              variant="mediterranean"
              size="sm"
              icon={<Save className="h-4 w-4" />}
            >
              Enregistrer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
