"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/auth";
import { Lock, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="h-8 w-8 rounded-full border-2 border-mediterranean-500 border-t-transparent animate-spin" />
          <span className="text-xs font-medium">Vérification de la session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <Card className="max-w-md mx-auto my-12 p-8 text-center border-rose-200">
        <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-2">Accès restreint</h2>
        <p className="text-xs text-slate-500 mb-6">
          Votre rôle actuel (<strong>{user.role}</strong>) ne possède pas les autorisations nécessaires pour consulter cet espace.
        </p>
        <Button variant="mediterranean" onClick={() => router.push("/profil")}>
          Retour à mon profil
        </Button>
      </Card>
    );
  }

  return <>{children}</>;
}
