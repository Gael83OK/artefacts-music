import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function ConnexionPage() {
  return (
    <div className="py-8 sm:py-12">
      <Suspense fallback={<div className="text-center text-xs text-slate-400">Chargement...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
