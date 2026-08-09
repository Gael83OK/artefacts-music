import { Suspense } from "react";
import { FirstLoginForm } from "@/components/auth/FirstLoginForm";

export default function PremiereConnexionPage() {
  return (
    <div className="py-8 sm:py-12">
      <Suspense fallback={<div className="text-center text-xs text-slate-400">Chargement...</div>}>
        <FirstLoginForm />
      </Suspense>
    </div>
  );
}
