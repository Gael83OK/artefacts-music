"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/lib/auth-service";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ROLE_LABELS } from "@/lib/mock-users";

export function FirstLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const { firstTimeSetup } = useAuth();

  const selectedProfile = userId ? authService.getProfileById(userId) : null;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isMinLength = password.length >= 6;
  const isMatching = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!userId && !selectedProfile) {
      setError("Profil non spécifié.");
      return;
    }

    if (!isMinLength) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (!isMatching) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    const targetUserId = selectedProfile ? selectedProfile.id : userId!;

    setIsSubmitting(true);
    const res = await firstTimeSetup(targetUserId, password);
    setIsSubmitting(false);

    if (res.success) {
      router.push("/profil");
    } else {
      setError(res.error || "Erreur lors de la création du mot de passe.");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6 sm:p-8 shadow-xl border border-violet-200/80">
      {/* Header avec bienvenue et indication de première connexion */}
      <div className="text-center mb-6">
        {selectedProfile ? (
          <>
            <Avatar
              name={`${selectedProfile.prenom} ${selectedProfile.nom}`}
              size="lg"
              className="mx-auto mb-3"
            />
            <div className="flex items-center justify-center gap-2 mb-2">
              <Badge variant="violet">Première connexion 🎉</Badge>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Bienvenue {selectedProfile.prenom} !
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Créez votre mot de passe personnel pour sécuriser votre compte{" "}
              {ROLE_LABELS[selectedProfile.role]}.
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <Badge variant="violet" className="mb-2">
              Première Connexion
            </Badge>
            <h2 className="text-xl font-bold text-slate-900">
              Définir votre mot de passe
            </h2>
          </>
        )}
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nouveau mot de passe */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Créer votre mot de passe
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Au moins 6 caractères"
              className="w-full h-11 pl-3.5 pr-10 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all"
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

        {/* Confirmation du mot de passe */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Confirmer le mot de passe
          </label>
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Répétez le mot de passe"
            className="w-full h-11 px-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all"
            required
          />
        </div>

        {/* Validation visuelle des critères */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <div
              className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] ${
                isMinLength
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-200 text-slate-400"
              }`}
            >
              <Check className="h-3 w-3" />
            </div>
            <span className={isMinLength ? "text-emerald-700 font-medium" : ""}>
              Au moins 6 caractères
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] ${
                isMatching
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-200 text-slate-400"
              }`}
            >
              <Check className="h-3 w-3" />
            </div>
            <span className={isMatching ? "text-emerald-700 font-medium" : ""}>
              Mots de passe identiques
            </span>
          </div>
        </div>

        {/* Bouton de confirmation */}
        <Button
          type="submit"
          variant="violet"
          size="lg"
          className="w-full mt-2"
          disabled={isSubmitting || !isMinLength || !isMatching}
          icon={<ArrowRight className="h-5 w-5" />}
        >
          {isSubmitting ? "Validation..." : "Valider mon mot de passe"}
        </Button>

        <div className="pt-2 text-center">
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
          >
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </form>
    </Card>
  );
}
