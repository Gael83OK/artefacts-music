"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { KeyRound, Mail, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const { requestPasswordReset } = useAuth();

  const [email, setEmail] = useState(initialEmail);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email) {
      setError("Veuillez saisir votre adresse e-mail.");
      return;
    }

    setIsSubmitting(true);
    const res = await requestPasswordReset(email);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage(res.message);
    } else {
      setError("Une erreur est survenue lors de l'envoi de l'e-mail.");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6 sm:p-8 shadow-xl border border-slate-200/80">
      <div className="text-center mb-6">
        <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-mediterranean-50 text-mediterranean-600 flex items-center justify-center">
          <KeyRound className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Mot de passe oublié</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
          Saisissez votre adresse e-mail associée à Artefacts Music pour recevoir un lien de réinitialisation.
        </p>
      </div>

      {successMessage ? (
        <div className="space-y-5">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold block">E-mail envoyé !</span>
              <span>{successMessage}</span>
            </div>
          </div>

          <Link href={`/auth/reinitialisation?email=${encodeURIComponent(email)}`}>
            <Button
              variant="mediterranean"
              size="lg"
              className="w-full"
              icon={<ArrowRight className="h-5 w-5" />}
            >
              Simuler la réinitialisation
            </Button>
          </Link>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
            >
              ← Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Adresse e-mail du compte
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ex: artiste@artefacts-music.com"
                className="w-full h-11 pl-10 pr-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-mediterranean-500/30 focus:border-mediterranean-500 transition-all"
                required
              />
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <Button
            type="submit"
            variant="mediterranean"
            size="lg"
            className="w-full mt-2"
            disabled={isSubmitting}
            icon={<ArrowRight className="h-5 w-5" />}
          >
            {isSubmitting ? "Envoi..." : "Envoyer le lien de réinitialisation"}
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
      )}
    </Card>
  );
}
