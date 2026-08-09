"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/lib/auth-service";
import { getUserRoleLabel } from "@/lib/mock-users";
import { SpaceSwitcher } from "@/components/auth/SpaceSwitcher";
import { notificationService } from "@/lib/notification-service";
import { NotificationSettings } from "@/types/notification";

import {
  LogOut,
  Shield,
  Phone,
  Mail,
  MapPin,
  Music,
  Lock,
  Sparkles,
  Camera,
  Calendar,
  Bell,
  Save,
  CheckCircle2,
  Edit2,
  X,
  Info,
  LogIn,
  UserX,
  Crown,
  Key,
} from "lucide-react";

export default function ProfilPage() {
  const { user, isAuthenticated, isLoading, isHybridProduction, isSuperAdmin, activeSpace, logout } = useAuth();

  // State for Section 3: Profile Edit Form
  const [isEditing, setIsEditing] = useState(false);
  const [prenom, setPrenom] = useState(user?.prenom || "");
  const [nom, setNom] = useState(user?.nom || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [ville, setVille] = useState(user?.ville || "");
  const [instrument, setInstrument] = useState(user?.instrument || "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null);

  // State for Section 4: Intermittence Anniversary Date
  const [anniversaireDate, setAnniversaireDate] = useState(
    user?.anniversaireIntermittenceDate || "15 août"
  );
  const [isAnniversaireSaved, setIsAnniversaireSaved] = useState(false);

  // State for Section 5: Notification Preferences
  const [notifSettings, setNotifSettings] = useState<NotificationSettings | null>(() =>
    user ? notificationService.getSettings(user.id) : null
  );

  // 1. ÉTAT DE CHARGEMENT DE SESSION (Pas de clignotement / flash)
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-slate-400">
        <div className="h-8 w-8 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" />
        <span className="text-xs font-semibold text-slate-600">Vérification de la session...</span>
      </div>
    );
  }

  // 2. UTILISATEUR NON CONNECTÉ (État explicite avec action de connexion)
  if (!isAuthenticated || !user) {
    return (
      <div className="space-y-6 max-w-xl mx-auto py-12 text-center">
        <Card className="p-8 space-y-6 border-slate-200 shadow-lg">
          <div className="mx-auto h-16 w-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
            <UserX className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-900">Vous n&apos;êtes pas connecté.</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Veuillez vous connecter avec vos identifiants Artefacts Music pour accéder à votre profil, vos préférences et vos informations d&apos;intermittence.
            </p>
          </div>

          <div className="pt-2">
            <Link href="/auth/connexion">
              <Button variant="violet" size="md" icon={<LogIn className="h-4 w-4" />}>
                Se connecter
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const roleLabel = getUserRoleLabel(user);

  // Handle Photo upload preview
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile edit
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = authService.updateProfile(user.id, {
      prenom,
      nom,
      phone,
      email,
      ville,
      instrument,
      avatarUrl: avatarPreview || undefined,
    });
    if (updated) {
      setIsEditing(false);
      window.location.reload(); // Refresh session
    }
  };

  // Save Intermittence Anniversary Date
  const handleSaveAnniversaire = (e: React.FormEvent) => {
    e.preventDefault();
    authService.updateProfile(user.id, {
      anniversaireIntermittenceDate: anniversaireDate,
    });
    setIsAnniversaireSaved(true);
    setTimeout(() => setIsAnniversaireSaved(false), 3000);
  };

  // Save Notification preferences
  const handleToggleNotif = (key: keyof NotificationSettings) => {
    if (!notifSettings) return;
    const newSettings = {
      ...notifSettings,
      [key]: !notifSettings[key],
    };
    setNotifSettings(newSettings);
    notificationService.updateSettings(user.id, newSettings);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Mon Profil & Paramètres"
        subtitle="Consultez et modifiez vos informations personnelles ainsi que vos préférences."
        badge={<Badge variant="mediterranean">Compte Artefacts</Badge>}
      />

      {/* BANNIÈRE SUPER ADMINISTRATEUR (Gaël Berlinger / super_admin) */}
      {isSuperAdmin && (
        <Card className="p-5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-white border-amber-300">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <Crown className="h-6 w-6" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <Badge variant="warning">Super-administrateur Système</Badge>
                <span className="text-xs font-bold text-amber-900">Droits d&apos;accès Illimités</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                Prérogatives d&apos;Administration Globale
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Vous disposez d&apos;un accès complet et irrévocable sur l&apos;ensemble des modules : gestion des membres, annuaire, prestations, morceaux, setlists, répétitions, matériel, documents, indisponibilités et paramètres du système.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* SECTION 1: PHOTO + IDENTITÉ */}
      <Card className="p-6 bg-gradient-to-br from-white via-slate-50/50 to-white border-slate-200">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative">
            {avatarPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarPreview}
                alt={`Photo de profil de ${user.prenom} ${user.nom}`}
                className="h-20 w-20 rounded-full object-cover ring-4 ring-mediterranean-500/20 shadow-md"
              />
            ) : (
              <Avatar
                name={`${user.prenom} ${user.nom}`}
                size="lg"
                status="online"
                className="h-20 w-20 text-xl ring-4 ring-mediterranean-500/20 shadow-md"
              />
            )}
          </div>

          <div className="text-center sm:text-left space-y-1 flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
                {user.prenom} {user.nom}
              </h2>
              <Badge variant={isSuperAdmin ? "warning" : "mediterranean"}>{roleLabel}</Badge>
            </div>

            {user.instrument && (
              <p className="text-xs font-semibold text-mediterranean-600">
                🎸 {user.instrument}
              </p>
            )}

            {user.ville && (
              <p className="text-xs text-slate-400">📍 {user.ville}</p>
            )}
          </div>
        </div>

        {/* Rôle Hybrides (Constantin et Théo) : Basculement d'espace */}
        {isHybridProduction && (
          <div className="mt-5 p-4 bg-violet-50/70 rounded-2xl border border-violet-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="h-10 w-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Sélecteur d&apos;espace Hybride (Musicien + Production)
                </h4>
                <p className="text-[11px] text-slate-600">
                  Mode actif : <strong className="text-violet-700 font-bold uppercase">{activeSpace === "production" ? "Espace Production" : "Espace Musicien"}</strong>
                </p>
              </div>
            </div>
            <SpaceSwitcher />
          </div>
        )}
      </Card>

      {/* SECTION 2: INFORMATIONS PERSONNELLES */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Informations personnelles
          </h3>
          <Badge variant="neutral">Données Réelles Supabase</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Nom & Prénom</span>
            <p className="font-bold text-slate-900">{user.prenom} {user.nom}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Rôle Officiel</span>
            <p className="font-bold text-violet-700">{roleLabel}</p>
          </div>

          {user.phone && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Téléphone</span>
              <p className="font-semibold text-slate-800">{user.phone}</p>
            </div>
          )}

          {user.email && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Adresse E-mail</span>
              <p className="font-semibold text-slate-800 truncate">{user.email}</p>
            </div>
          )}

          {user.ville && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Domicile / Ville</span>
              <p className="font-semibold text-slate-800">{user.ville}</p>
            </div>
          )}

          {user.instrument && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Fonction / Instrument</span>
              <p className="font-semibold text-slate-800">{user.instrument}</p>
            </div>
          )}
        </div>
      </Card>

      {/* SECTION 3: MODIFIER MON PROFIL */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Edit2 className="h-4 w-4 text-mediterranean-600" />
            <span>Modifier mon profil</span>
          </h3>

          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              icon={<Edit2 className="h-3.5 w-3.5" />}
            >
              Modifier mon profil
            </Button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <label className="block font-bold text-slate-900">Photo de profil</label>
              <div className="flex items-center gap-4">
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarPreview}
                    alt="Aperçu photo"
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-mediterranean-500"
                  />
                ) : (
                  <Avatar name={`${prenom} ${nom}`} size="md" />
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-mediterranean-50 file:text-mediterranean-700 hover:file:bg-mediterranean-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Prénom</label>
                <input
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-mediterranean-500/30"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nom</label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-mediterranean-500/30"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Téléphone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-mediterranean-500/30"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Adresse E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-mediterranean-500/30"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ville</label>
                <input
                  type="text"
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-mediterranean-500/30"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Instrument</label>
                <input
                  type="text"
                  value={instrument}
                  onChange={(e) => setInstrument(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-mediterranean-500/30"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
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
        ) : (
          <p className="text-xs text-slate-500">
            Cliquez sur le bouton ci-dessus pour mettre à jour vos coordonnées personnelles et votre photo de profil.
          </p>
        )}
      </Card>

      {/* SECTION 4: DATE ANNIVERSAIRE D'INTERMITTENCE */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="h-4 w-4 text-violet-600" />
            <span>Date anniversaire d&apos;intermittence</span>
          </h3>
          {isAnniversaireSaved && <Badge variant="success">Enregistré ✅</Badge>}
        </div>

        <form onSubmit={handleSaveAnniversaire} className="space-y-3">
          <div className="p-3 bg-violet-50/50 rounded-2xl border border-violet-100 text-xs text-violet-900 flex items-start gap-2">
            <Info className="h-4 w-4 text-violet-600 shrink-0 mt-0.5" />
            <span>
              Cette date est utilisée par l&apos;espace Administratif pour calculer automatiquement votre période de 12 mois rolling d&apos;intermittence.
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date anniversaire d&apos;intermittence
              </label>
              <input
                type="text"
                value={anniversaireDate}
                onChange={(e) => setAnniversaireDate(e.target.value)}
                placeholder="ex: 15 août, 01 novembre..."
                className="w-full h-10 px-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500/30"
              />
            </div>

            <Button
              type="submit"
              variant="violet"
              size="md"
              icon={<Save className="h-4 w-4" />}
              className="w-full sm:w-auto sm:self-end h-10"
            >
              Enregistrer la date
            </Button>
          </div>
        </form>
      </Card>

      {/* SECTION 5: NOTIFICATIONS */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Bell className="h-4 w-4 text-rose-500" />
            <span>Préférences de Notifications</span>
          </h3>
          <Badge variant="rose">Push & Alertes</Badge>
        </div>

        {notifSettings ? (
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span>Modifications de prestations (horaires, lieu, responsable)</span>
              <input
                type="checkbox"
                checked={notifSettings.notifyPrestationModifications}
                onChange={() => handleToggleNotif("notifyPrestationModifications")}
                className="h-4 w-4 text-violet-600 rounded border-slate-300 focus:ring-violet-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span>Messages du chat de prestation</span>
              <input
                type="checkbox"
                checked={notifSettings.notifyChatMessage}
                onChange={() => handleToggleNotif("notifyChatMessage")}
                className="h-4 w-4 text-violet-600 rounded border-slate-300 focus:ring-violet-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span>Rappel 24 heures avant une prestation</span>
              <input
                type="checkbox"
                checked={notifSettings.notifyPrestationReminder24h}
                onChange={() => handleToggleNotif("notifyPrestationReminder24h")}
                className="h-4 w-4 text-violet-600 rounded border-slate-300 focus:ring-violet-500"
              />
            </div>
          </div>
        ) : null}
      </Card>

      {/* SECTION 6: MODIFIER MON MOT DE PASSE */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Lock className="h-4 w-4 text-slate-700" />
            <span>Modifier mon mot de passe</span>
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Changer votre mot de passe d&apos;accès sécurisé (Prompt 002). Le mot de passe actuel reste confidentiel.
          </p>

          <Link href={`/auth/reinitialisation?email=${encodeURIComponent(user.email || "")}`}>
            <Button variant="outline" size="sm" icon={<Lock className="h-3.5 w-3.5" />}>
              Modifier mon mot de passe
            </Button>
          </Link>
        </div>
      </Card>

      {/* SECTION 7: DÉCONNEXION */}
      <Card className="p-5 border-rose-100 bg-rose-50/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Se déconnecter
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Fermer votre session active sur cet appareil.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300"
            onClick={logout}
            icon={<LogOut className="h-4 w-4 text-rose-500" />}
          >
            Se déconnecter
          </Button>
        </div>
      </Card>
    </div>
  );
}