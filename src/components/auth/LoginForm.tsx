"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/lib/auth-service";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ROLE_LABELS } from "@/lib/mock-users";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const { login } = useAuth();

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

  return (
    <Card className="w-full max-w-md mx-auto p-6 sm:p-8 shadow-xl border border-slate-200/80">
      {/* Header avec profil sélectionné ou générique */}
      {selectedProfile ? (
        <div className="text-center mb-6">
          <Avatar
            name={`${selectedProfile.prenom} ${selectedProfile.nom}`}
            size="lg"
            className="mx-auto mb-3"
          />
          <h2 className="text-xl font-bold text-slate-900">
            Bonjour {selectedProfile.prenom} 👋
          </h2>
          <div className="flex items-center justify-center gap-2 mt-1">
            <Badge variant="mediterranean">
              {ROLE_LABELS[selectedProfile.role]}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Entrez votre mot de passe pour accéder à votre espace Artefacts.
          </p>
        </div>
      ) : (
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-mediterranean-50 text-mediterranean-600 flex items-center justify-center">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Connexion Espace Membre</h2>
          <p className="text-xs text-slate-500 mt-1">
            Saisissez vos identifiants pour vous connecter.
          </p>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Champ email si aucun profil sélectionné */}
        {!selectedProfile && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Adresse e-mail
            </label>
            <input
              type="email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="ex: nom@artefacts-music.com"
              className="w-full h-11 px-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-mediterranean-500/30 focus:border-mediterranean-500 transition-all"
              required
            />
          </div>
        )}

        {/* Champ mot de passe */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
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
              className="text-xs text-mediterranean-600 hover:text-mediterranean-700 font-medium transition-colors"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 pl-3.5 pr-10 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-mediterranean-500/30 focus:border-mediterranean-500 transition-all"
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

        {/* Bouton de connexion grands formats mobile-first */}
        <Button
          type="submit"
          variant="mediterranean"
          size="lg"
          className="w-full mt-2"
          disabled={isSubmitting}
          icon={<ArrowRight className="h-5 w-5" />}
        >
          {isSubmitting ? "Connexion..." : "Se connecter"}
        </Button>

        {/* Raccourci pour changer de profil */}
        {selectedProfile && (
          <div className="pt-2 text-center">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
            >
              ← Sélectionner un autre profil
            </Link>
          </div>
        )}
      </form>
    </Card>
  );
}
