"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AlertCircle, Calendar, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-5 border-slate-200 shadow-xl">
        <div className="h-16 w-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto ring-8 ring-rose-50/50">
          <AlertCircle className="h-8 w-8" />
        </div>

        <div className="space-y-1">
          <Badge variant="rose">Élément non disponible</Badge>
          <h2 className="text-xl font-extrabold text-slate-900 pt-1">
            Cette prestation ou cet élément n&apos;est plus disponible.
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            La ressource recherchée a été modifiée, archivée ou vous ne disposez pas des autorisations d&apos;accès suffisantes.
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
