"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, ArrowRight, AlertCircle, Sparkles, UserCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/lib/auth-service";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { getUserRoleLabel } from "@/lib/mock-users";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const { login } = useAuth();
  const profiles = authService.getAvailableProfiles();

  const selectedProfile = userId ? authService.getProfileById(userId) : null;

  const [identifier, setIdentifier] = useState(
    selectedProfile ? selectedProfile.email : ""
  );
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const targetIdentifier = selectedProfile ? selectedProfile.id : identifier;

    if (!targetIdentifier) {
      setError("Veuillez saisir votre e-mail ou choisir votre profil.");
      return;
    }

    if (!password) {
      setError("Veuillez saisir votre mot de passe.");
      return;
    }

    setIsSubmitting(true);
    const res = await login(targetIdentifier, password);
    setIsSubmitting(false);

    if (res.success) {
      router.push("/profil");
    } else {
      setError(res.error || "Erreur de connexion.");
    }
  };

  const handleSelectProfile = (pId: string, isFirstLogin: boolean) => {
    if (isFirstLogin) {
      router.push(`/auth/premiere-connexion?userId=${pId}`);
    } else {
      router.push(`/auth/connexion?userId=${pId}`);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-5 sm:p-8 shadow-xl border border-slate-200/90 rounded-3xl bg-white space-y-5">
      {/* Header avec profil sélectionné ou sélection multiple */}
      {selectedProfile ? (
        <div className="text-center space-y-2">
          <Avatar
            name={`${selectedProfile.prenom} ${selectedProfile.nom}`}
            size="lg"
            className="mx-auto shadow-md ring-4 ring-mediterranean-100"
          />
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Bonjour {selectedProfile.prenom} 👋
          </h2>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="mediterranean" className="text-xs font-black">
              {getUserRoleLabel(selectedProfile)}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto">
            Saisissez votre mot de passe pour accéder à votre espace d&apos;équipe.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-br from-mediterranean-500 to-violet-600 text-white flex items-center justify-center shadow-md">
              <UserCheck className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Connexion Espace Membre
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Choisissez votre profil ou saisissez votre e-mail :
            </p>
          </div>

          {/* Grille de sélection tactile des profils de démonstration */}
          <div className="space-y-2 pt-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">
              Profils disponibles
            </span>

            <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
              {profiles.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectProfile(p.id, p.isFirstLogin)}
                  className="p-3 bg-slate-50/90 hover:bg-mediterranean-50/80 border border-slate-200/90 hover:border-mediterranean-300 rounded-2xl text-left transition-all duration-150 active:scale-[0.98] flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={`${p.prenom} ${p.nom}`} size="sm" />
                    <div className="min-w-0">
                      <div className="font-extrabold text-xs text-slate-900 group-hover:text-mediterranean-700 truncate">
                        {p.prenom} {p.nom}
                      </div>
                      <div className="text-[10px] text-slate-500 font-semibold truncate">
                        {getUserRoleLabel(p)}
                      </div>
                    </div>
                  </div>

                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-mediterranean-600 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-semibold flex items-start gap-2.5 animate-fade-in">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {/* Champ email si aucun profil sélectionné */}
        {!selectedProfile && (
          <div>
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
              Ou saisissez votre adresse e-mail
            </label>
            <input
              type="email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="ex: nom@artefacts-music.com"
              className="w-full h-11 min-h-[44px] px-3.5 text-xs sm:text-sm bg-slate-50 border border-slate-200/90 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-mediterranean-500/30 focus:border-mediterranean-500 transition-all font-medium"
            />
          </div>
        )}

        {/* Champ mot de passe */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">
              Mot de passe
            </label>
            <Link
              href={
                selectedProfile && selectedProfile.email
                  ? `/auth/mot-de-passe-oublie?email=${encodeURIComponent(
                      selectedProfile.email
                    )}`
                  : "/auth/mot-de-passe-oublie"
              }
              className="text-xs text-mediterranean-600 hover:text-mediterranean-700 font-extrabold transition-colors"
            >
              Oublié ?
            </Link>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 min-h-[44px] pl-3.5 pr-10 text-xs sm:text-sm bg-slate-50 border border-slate-200/90 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-mediterranean-500/30 focus:border-mediterranean-500 transition-all font-medium"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Bouton de connexion mobile-first */}
        <Button
          type="submit"
          variant="mediterranean"
          size="lg"
          className="w-full mt-2 rounded-2xl font-black"
          disabled={isSubmitting}
          icon={<ArrowRight className="h-5 w-5" />}
        >
          {isSubmitting ? "Connexion..." : "Se connecter"}
        </Button>

        {/* Raccourci pour changer de profil */}
        {selectedProfile && (
          <div className="pt-1 text-center">
            <Link
              href="/auth/connexion"
              className="text-xs text-slate-500 hover:text-slate-800 font-bold transition-colors"
            >
              ← Choisir un autre profil
            </Link>
          </div>
        )}
      </form>
    </Card>
  );
}
