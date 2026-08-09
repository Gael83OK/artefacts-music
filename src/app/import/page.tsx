"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { syncAllToSupabase, SyncReportItem } from "@/lib/sync-supabase";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Database, RefreshCw, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";

export default function ImportPage() {
  const [reports, setReports] = useState<SyncReportItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncDate, setLastSyncDate] = useState<string | null>(null);

  const handleRunSync = async () => {
    setIsSyncing(true);
    try {
      const res = await syncAllToSupabase();
      setReports(res);
      setLastSyncDate(new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    handleRunSync();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="h-4 w-4" />}>
            Retour à l&apos;accueil
          </Button>

        </Link>

        <Badge variant="mediterranean">
          <Database className="h-3.5 w-3.5 mr-1 inline" />
          Connexion Supabase V1
        </Badge>

      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Database className="h-6 w-6 text-mediterranean-600" />
              Synchronisation Supabase
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Envoi des dernières entités (Musiciens, Prestations, Songs, Setlists, Répétitions, Documents, Indisponibilités, Matériel, Notifications) dans la base Supabase.
            </p>
          </div>

          <Button
            variant="mediterranean"
            onClick={handleRunSync}
            disabled={isSyncing}
            icon={<RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />}
          >
            {isSyncing ? "Synchronisation..." : "Synchroniser tout"}
          </Button>
        </div>

        {lastSyncDate && (
          <div className="text-xs text-slate-500 italic">
            Dernière tentative de synchronisation : <span className="font-semibold text-slate-700">{lastSyncDate}</span>
          </div>
        )}

        <div className="space-y-3 pt-2">
          {reports.map((item, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                item.status === "success"
                  ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                  : item.status === "warning"
                  ? "bg-amber-50/70 border-amber-200 text-amber-900"
                  : "bg-rose-50/70 border-rose-200 text-rose-900"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {item.status === "success" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                )}
                <div className="min-w-0">
                  <span className="font-bold uppercase tracking-wider block text-[11px]">
                    Table : {item.table}
                  </span>
                  <span className="text-xs">{item.message}</span>
                </div>
              </div>

              <Badge
                variant={item.status === "success" ? "success" : "warning"}
                className="shrink-0 font-mono"
              >

                {item.count} éléments
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}