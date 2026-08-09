import { Suspense } from "react";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function MotDePasseOubliePage() {
  return (
    <div className="py-8 sm:py-12">
      <Suspense fallback={<div className="text-center text-xs text-slate-400">Chargement...</div>}>
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
}
