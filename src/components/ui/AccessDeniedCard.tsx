"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ShieldAlert, Calendar, Home } from "lucide-react";

interface AccessDeniedCardProps {
  message?: string;
  subtitle?: string;
}

export function AccessDeniedCard({
  message = "Vous n'avez pas accès à cette information.",
  subtitle = "Cette ressource est réservée aux personnes convoquées ou aux membres de l'équipe de production.",
}: AccessDeniedCardProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-5 border-rose-200/80 shadow-xl">
        <div className="h-16 w-16 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto ring-8 ring-rose-50/50">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <div className="space-y-1">
          <Badge variant="rose">Accès restreint</Badge>
          <h2 className="text-xl font-extrabold text-slate-900 pt-1">
            {message}
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
          <Link href="/calendrier" className="w-full sm:w-auto">
            <Button
              variant="mediterranean"
              size="sm"
              icon={<Calendar className="h-4 w-4" />}
              className="w-full justify-center"
            >
              Retour au calendrier
            </Button>
          </Link>

          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              icon={<Home className="h-4 w-4" />}
              className="w-full justify-center"
            >
              Retour à l&apos;accueil
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
