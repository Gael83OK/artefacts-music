import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ReinitialisationPage() {
  return (
    <div className="py-8 sm:py-12">
      <Suspense fallback={<div className="text-center text-xs text-slate-400">Chargement...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
