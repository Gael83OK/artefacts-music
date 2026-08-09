"use client";

import React, { useState } from "react";
import { Prestation, PrestationStatus } from "@/types/prestation";
import { AuthUser } from "@/types/auth";
import { authService } from "@/lib/auth-service";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { X, Calendar, Clock, MapPin, Users, Shield, Save } from "lucide-react";

interface PrestationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Prestation, "id" | "updatedAt">) => void;
  initialData?: Prestation | null;
}

export function PrestationFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: PrestationFormModalProps) {
  const allMusicians = authService.getAvailableProfiles();

  const [titre, setTitre] = useState(initialData?.titre || "");
  const [date, setDate] = useState(initialData?.date || "");
  const [heureArrivee, setHeureArrivee] = useState(initialData?.heureArrivee || "16:00");
  const [heureDebut, setHeureDebut] = useState(initialData?.heureDebut || "17:30");
  const [heureFin, setHeureFin] = useState(initialData?.heureFin || "01:00");
  const [lieu, setLieu] = useState(initialData?.lieu || "");
  const [adresse, setAdresse] = useState(initialData?.adresse || "");
  const [infosLieu, setInfosLieu] = useState(initialData?.infosLieu || "");
  const [formation, setFormation] = useState<string>(initialData?.formation || "Quartet");
  const [dressCode, setDressCode] = useState(initialData?.dressCode || "");
  const [materielMissions, setMaterielMissions] = useState(initialData?.materielMissions || "");
  const [remarquesProduction, setRemarquesProduction] = useState(initialData?.remarquesProduction || "");
  const [demandesSpeciales, setDemandesSpeciales] = useState(initialData?.demandesSpeciales || "");
  const [status, setStatus] = useState<PrestationStatus>(initialData?.status || "confirme");

  const [musicianIds, setMusicianIds] = useState<string[]>(
    initialData?.musicianIds || (allMusicians.length > 0 ? [allMusicians[0].id] : [])
  );
  const [responsableId, setResponsableId] = useState<string>(
    initialData?.responsableId || (allMusicians.length > 0 ? allMusicians[0].id : "")
  );

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const toggleMusician = (id: string) => {
    if (musicianIds.includes(id)) {
      if (id === responsableId) return; // Can't uncheck responsable directly
      setMusicianIds(musicianIds.filter((mId) => mId !== id));
    } else {
      setMusicianIds([...musicianIds, id]);
    }
  };

  const handleResponsableChange = (id: string) => {
    setResponsableId(id);
    if (!musicianIds.includes(id)) {
      setMusicianIds([...musicianIds, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    if (!titre || !date || !lieu || !adresse) {
      setError("Veuillez remplir les champs obligatoires (Titre, Date, Lieu, Adresse).");
      setIsSubmitting(false);
      return;
    }

    if (!responsableId) {
      setError("Veuillez désigner un responsable de prestation.");
      setIsSubmitting(false);
      return;
    }

    onSave({
      titre,
      date,
      heureArrivee,
      heureDebut,
      heureFin,
      lieu,
      adresse,
      infosLieu,
      musicianIds,
      responsableId,
      formation,
      dressCode,
      materielMissions,
      remarquesProduction,
      demandesSpeciales,
      status,
      syncInfo: initialData?.syncInfo || { source: "manual" },
    });

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 z-50 my-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <Badge variant="mediterranean">
              {initialData ? "Modification" : "Nouvelle Prestation"}
            </Badge>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              {initialData ? "Modifier la Prestation" : "Créer une Prestation"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Titre & Statut */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Titre de la prestation *
              </label>
              <input
                type="text"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                placeholder="ex: Mariage Château de Cassis"
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-mediterranean-500/30"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Statut
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PrestationStatus)}
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              >
                <option value="confirme">Confirmé</option>
                <option value="option">Option</option>
                <option value="annule">Annulé</option>
              </select>
            </div>
          </div>

          {/* Date & Horaires */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Arrivée
              </label>
              <input
                type="time"
                value={heureArrivee}
                onChange={(e) => setHeureArrivee(e.target.value)}
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Début Jeu
              </label>
              <input
                type="time"
                value={heureDebut}
                onChange={(e) => setHeureDebut(e.target.value)}
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Fin Prévue
              </label>
              <input
                type="time"
                value={heureFin}
                onChange={(e) => setHeureFin(e.target.value)}
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          {/* Lieu, Adresse & Infos Lieu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Lieu *
              </label>
              <input
                type="text"
                value={lieu}
                onChange={(e) => setLieu(e.target.value)}
                placeholder="ex: Château de Cassis"
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Adresse complète *
              </label>
              <input
                type="text"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                placeholder="ex: Route des Crêtes, 13260 Cassis"
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Infos d&apos;accès / Consignes lieu
            </label>
            <input
              type="text"
              value={infosLieu}
              onChange={(e) => setInfosLieu(e.target.value)}
              placeholder="ex: Accès chargement côté chai, prise 32A à proximité"
              className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
            />
          </div>

          {/* Formation & Responsable */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Formation
              </label>
              <select
                value={formation}
                onChange={(e) => setFormation(e.target.value)}
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              >
                <option value="Duo">Duo</option>
                <option value="Trio">Trio</option>
                <option value="Quartet">Quartet</option>
                <option value="XXL">XXL</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Responsable de Prestation *
              </label>
              <select
                value={responsableId}
                onChange={(e) => handleResponsableChange(e.target.value)}
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                required
              >
                {allMusicians.map((m) => (
                  <option key={m.id} value={m.id}>
                    👑 {m.prenom} {m.nom} ({m.instrument || "Artiste"})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sélection des musiciens participants */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Musiciens Présents ({musicianIds.length} sélectionnés)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
              {allMusicians.map((m) => {
                const isSelected = musicianIds.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleMusician(m.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs text-left transition-colors ${
                      isSelected
                        ? "bg-mediterranean-50 text-mediterranean-800 font-semibold border border-mediterranean-200"
                        : "bg-white text-slate-600 border border-slate-100 hover:bg-slate-100"
                    }`}
                  >
                    <span>{isSelected ? "✅" : "⚪"}</span>
                    <span className="truncate">{m.prenom} {m.nom}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dress code & Matériel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Dress Code
              </label>
              <input
                type="text"
                value={dressCode}
                onChange={(e) => setDressCode(e.target.value)}
                placeholder="ex: Costume sombre & chemise blanche"
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Matériel & Missions Spécifiques
              </label>
              <input
                type="text"
                value={materielMissions}
                onChange={(e) => setMaterielMissions(e.target.value)}
                placeholder="ex: Console numérique + In-Ear"
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          {/* Remarques Prod & Demandes Spéciales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Remarques Production
              </label>
              <textarea
                value={remarquesProduction}
                onChange={(e) => setRemarquesProduction(e.target.value)}
                placeholder="Notes internes pour l'équipe..."
                className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white h-20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Demandes Particulières Client / Mariés
              </label>
              <textarea
                value={demandesSpeciales}
                onChange={(e) => setDemandesSpeciales(e.target.value)}
                placeholder="Morceau spécial, tempo ou animation..."
                className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white h-20"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              variant="mediterranean"
              icon={<Save className="h-4 w-4" />}
            >
              {initialData ? "Enregistrer les modifications" : "Créer la prestation"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
