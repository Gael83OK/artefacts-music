"use client";

import React, { useState, useEffect } from "react";
import { AuthUser, GlobalRole } from "@/types/auth";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { X, UserPlus, UserCheck, UserX, Save, ShieldAlert } from "lucide-react";
import { authService } from "@/lib/auth-service";

interface MemberManageModalProps {
  isOpen: boolean;
  member: AuthUser | null; // Null when creating a new member
  onClose: () => void;
  onSuccess: () => void;
}

export function MemberManageModal({
  isOpen,
  member,
  onClose,
  onSuccess,
}: MemberManageModalProps) {
  const isEditing = !!member;

  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [role, setRole] = useState<GlobalRole>("musician");
  const [instrument, setInstrument] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [ville, setVille] = useState("");
  const [actif, setActif] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (member) {
      setPrenom(member.prenom || "");
      setNom(member.nom || "");
      setRole(member.role || "musician");
      setInstrument(member.instrument || "");
      setPhone(member.phone || "");
      setEmail(member.email || "");
      setVille(member.ville || "");
      setActif(member.actif !== false);
    } else {
      setPrenom("");
      setNom("");
      setRole("musician");
      setInstrument("");
      setPhone("");
      setEmail("");
      setVille("");
      setActif(true);
    }
    setError(null);
  }, [member, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom.trim()) {
      setError("Le prénom est obligatoire.");
      return;
    }
    if (!nom.trim()) {
      setError("Le nom de famille est obligatoire.");
      return;
    }

    try {
      if (isEditing && member) {
        authService.updateMemberAdmin(member.id, {
          prenom: prenom.trim(),
          nom: nom.trim(),
          role: role,
          instrument: instrument.trim() || undefined,
          phone: phone.trim() || undefined,
          email: email.trim() || undefined,
          ville: ville.trim() || undefined,
          actif: actif,
        });
      } else {
        authService.addMember({
          prenom: prenom.trim(),
          nom: nom.trim(),
          role: role,
          instrument: instrument.trim() || undefined,
          phone: phone.trim() || undefined,
          email: email.trim() || undefined,
          ville: ville.trim() || undefined,
          actif: actif,
        });
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Une erreur est survenue lors de l'enregistrement.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 z-50 text-left space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Badge variant="mediterranean">
              {isEditing ? "Modifier le membre" : "Ajouter un membre"}
            </Badge>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Prénom <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Ex: Gaël"
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mediterranean-500/30 font-medium"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nom <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Ex: Berlinger"
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mediterranean-500/30 font-medium"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Fonction / Instrument
              </label>
              <input
                type="text"
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
                placeholder="Ex: Piano, Batteur, Chant"
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mediterranean-500/30 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Rôle Système <span className="text-rose-500">*</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as GlobalRole)}
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mediterranean-500/30 font-medium"
              >
                <option value="musician">Musicien</option>
                <option value="production">Production</option>
                <option value="hybrid_production">Production + Musicien</option>
                <option value="super_admin">Super-administrateur</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Téléphone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ex: 06 50 02 90 42"
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mediterranean-500/30 font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Adresse E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: contact@artefacts-music.com"
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mediterranean-500/30 font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Domicile / Ville
            </label>
            <input
              type="text"
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              placeholder="Ex: La Crau, Rognes, Avignon"
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mediterranean-500/30 font-medium"
            />
          </div>

          {isEditing && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="font-bold text-slate-700">Statut de l&apos;utilisateur</span>
              <button
                type="button"
                onClick={() => setActif(!actif)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  actif
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {actif ? (
                  <>
                    <UserCheck className="h-3.5 w-3.5" />
                    <span>Actif</span>
                  </>
                ) : (
                  <>
                    <UserX className="h-3.5 w-3.5" />
                    <span>Désactivé</span>
                  </>
                )}
              </button>
            </div>
          )}

          <div className="pt-3 flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={onClose} type="button">
              Annuler
            </Button>
            <Button
              variant="mediterranean"
              size="sm"
              type="submit"
              icon={isEditing ? <Save className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            >
              {isEditing ? "Enregistrer" : "Créer le membre"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
