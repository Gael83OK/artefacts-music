"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { administratifService } from "@/lib/administratif-service";
import { AdminDocCategory, AdminDocument } from "@/types/administratif";
import { AnniversaryModal } from "@/components/administratif/AnniversaryModal";
import {
  FileText,
  Calendar,
  Clock,
  TrendingUp,
  Download,
  Eye,
  Edit2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Shield,
  Sparkles,
  MapPin,
  FileCheck,
} from "lucide-react";

export default function AdministratifPage() {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAnnivModalOpen, setIsAnnivModalOpen] = useState(false);
  const [docCategory, setDocCategory] = useState<AdminDocCategory | "all">("all");

  if (!user) return null;

  const profile = administratifService.getIntermittenceProfile(user.id);
  const monthSummary = administratifService.getAdminMonthSummary(user.id);
  const intermittenceSummary = administratifService.getIntermittenceSummary(user.id);
  const historyPrestations = administratifService.getHistoryForUser(user.id);
  const previsionnelPrestations = administratifService.getPrevisionnelCalendarForUser(user.id);
  const userDocuments = administratifService.getDocumentsForUser(user.id);

  const filteredDocs = userDocuments.filter(
    (d) => docCategory === "all" || d.categorie === docCategory
  );

  const formattedPeriodDebut = new Date(intermittenceSummary.dateDebut).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedPeriodFin = new Date(intermittenceSummary.dateFin).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const currentMonthName = new Date().toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  return (
    <ProtectedRoute>
      <div className="space-y-8 max-w-4xl mx-auto">
        <PageHeader
          title="Espace Administratif"
          subtitle="Consultez votre situation du mois, votre suivi d'intermittence et vos documents officiels."
          badge={<Badge variant="mediterranean">Données Personnelles Sécurisées</Badge>}
        />

        {/* SECTION 1: ACTUALISATION DU MOIS EN COURS */}
        <section className="space-y-3">

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-mediterranean-600" />
              <span>1. Actualisation du mois en cours</span>
            </h2>
            <span className="text-xs font-semibold text-slate-500 capitalize">
              {currentMonthName}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Bloc Réalisé / Officiel */}
            <Card className="p-5 border-emerald-200 bg-gradient-to-br from-emerald-50/40 via-white to-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Données Réalisées (Officiel)
                </span>
                <Badge variant="success" size="sm">
                  Confirmé
                </Badge>
              </div>

              <div className="pt-1">
                <div className="text-2xl font-black text-slate-900">
                  {monthSummary.prestationsRealiseesCount} prestation{monthSummary.prestationsRealiseesCount > 1 ? "s" : ""}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Réalisées ce mois-ci
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-100/80 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Montant brut réalisé :</span>
                {monthSummary.montantBrutRealise !== null ? (
                  <span className="font-extrabold text-emerald-700 text-sm">
                    {monthSummary.montantBrutRealise} € brut
                  </span>
                ) : (
                  <span className="text-slate-400 italic">Donnée indisponible</span>
                )}
              </div>
            </Card>

            {/* Bloc Prévisionnel / Estimé */}
            <Card className="p-5 border-violet-200 bg-gradient-to-br from-violet-50/40 via-white to-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-violet-800 uppercase tracking-wider">
                  Données Prévisionnelles
                </span>
                <Badge variant="violet" size="sm">
                  Estimation
                </Badge>
              </div>

              <div className="pt-1">
                <div className="text-2xl font-black text-slate-900">
                  {monthSummary.prestationsPrevuesCount} prestation{monthSummary.prestationsPrevuesCount > 1 ? "s" : ""}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Prévues à venir ce mois-ci
                </div>
              </div>

              <div className="pt-2 border-t border-violet-100/80 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Estimation du montant brut :</span>
                {monthSummary.montantBrutEstime !== null ? (
                  <span className="font-bold text-violet-700 text-sm">
                    ~ {monthSummary.montantBrutEstime} € brut (est.)
                  </span>
                ) : (
                  <span className="text-slate-400 italic">Donnée indisponible</span>
                )}
              </div>
            </Card>
          </div>
        </section>

        {/* SECTION 2: PÉRIODE D'INTERMITTENCE */}

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Calendar className="h-5 w-5 text-violet-600" />
              <span>2. Période d’intermittence</span>
            </h2>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAnnivModalOpen(true)}
              icon={<Edit2 className="h-3.5 w-3.5 text-violet-600" />}
            >
              Date anniversaire
            </Button>
          </div>

          <Card className="p-5 sm:p-6 bg-slate-900 text-white space-y-4 shadow-xl border-none">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Période d&apos;intermittence en cours
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                  {formattedPeriodDebut} → {formattedPeriodFin}
                </h3>
              </div>
              <Badge variant="violet" size="md">
                12 mois glissants
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center sm:text-left">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <span className="text-2xl font-black text-emerald-400 block">
                  {intermittenceSummary.prestationsRealiseesCount}
                </span>
                <span className="text-xs font-semibold text-slate-300">
                  Prestations réalisées
                </span>
              </div>

              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <span className="text-2xl font-black text-violet-300 block">
                  {intermittenceSummary.prestationsPrevuesCount}
                </span>
                <span className="text-xs font-semibold text-slate-300">
                  Prestations prévues
                </span>
              </div>
            </div>
          </Card>
        </section>

        {/* SECTION 3: HISTORIQUE */}

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Clock className="h-5 w-5 text-slate-700" />
              <span>3. Historique</span>
            </h2>
            <span className="text-xs text-slate-500">
              {historyPrestations.length} prestation{historyPrestations.length > 1 ? "s" : ""} réalisée{historyPrestations.length > 1 ? "s" : ""}
            </span>
          </div>

          <Card className="p-4 space-y-3">
            {historyPrestations.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                Aucune prestation réalisée dans l&apos;historique.
              </div>
            ) : (
              <div className="space-y-2.5">
                {historyPrestations.map((p) => {
                  const formattedDate = new Date(p.date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  });

                  return (
                    <Link key={p.id} href={`/evenement/${p.id}`} className="block">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/70 transition-colors gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              {p.titre}
                            </span>
                            <Badge variant="violet" size="sm">
                              {p.formation}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            <span>📅 {formattedDate}</span>
                            <span>📍 {p.lieu}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          {p.montantBrut ? (
                            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                              {p.montantBrut} € brut
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 italic">
                              Donnée indisponible
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </Card>
        </section>

        {/* SECTION 4: CALENDRIER (PRÉVISIONNEL) */}

        <section className="space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-500" />
                <span>4. Calendrier (prévisionnel)</span>
              </h2>
              <Badge variant="violet" size="sm">
                Prévisionnel
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1 italic">
              Les informations prévisionnelles peuvent évoluer.
            </p>
          </div>

          <Card className="p-4 space-y-3 border-violet-100 bg-violet-50/20">
            {previsionnelPrestations.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                Aucune prestation prévisionnelle inscrite au calendrier.
              </div>
            ) : (
              <div className="space-y-2.5">
                {previsionnelPrestations.map((p) => {
                  const formattedDate = new Date(p.date).toLocaleDateString("fr-FR", {
                    weekday: "short",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  });

                  return (
                    <Link key={p.id} href={`/evenement/${p.id}`} className="block">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/80 transition-colors gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              {p.titre}
                            </span>
                            <Badge
                              variant={
                                p.status === "confirme"
                                  ? "success"
                                  : p.status === "option"
                                  ? "warning"
                                  : "rose"
                              }
                              size="sm"
                            >
                              {p.status === "confirme"
                                ? "Confirmé"
                                : p.status === "option"
                                ? "Option"
                                : "Annulé"}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            <span className="font-semibold text-mediterranean-600 capitalize">
                              📅 {formattedDate}
                            </span>
                            <span>📍 {p.lieu}</span>
                            <span>👥 Formation {p.formation}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0 text-xs text-slate-400 italic">
                          Écheance prévisionnelle
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </Card>
        </section>

        {/* SECTION 5: DOCUMENTS */}

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-mediterranean-600" />
              <span>5. Documents</span>
            </h2>
            <Badge variant="mediterranean">Documents de {user.prenom}</Badge>
          </div>

          {/* Onglets Filtres des catégories de documents */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => setDocCategory("all")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors ${
                docCategory === "all"
                  ? "bg-mediterranean-500 text-white shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Tous ({userDocuments.length})
            </button>

            <button
              onClick={() => setDocCategory("fiches_de_paie")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors ${
                docCategory === "fiches_de_paie"
                  ? "bg-mediterranean-500 text-white shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Fiches de paie
            </button>

            <button
              onClick={() => setDocCategory("aem")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors ${
                docCategory === "aem"
                  ? "bg-mediterranean-500 text-white shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              AEM
            </button>

            <button
              onClick={() => setDocCategory("conges_spectacle")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors ${
                docCategory === "conges_spectacle"
                  ? "bg-mediterranean-500 text-white shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Congés spectacle
            </button>

            <button
              onClick={() => setDocCategory("autres")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors ${
                docCategory === "autres"
                  ? "bg-mediterranean-500 text-white shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Autres
            </button>
          </div>

          {/* Liste des Documents Personnels (Accès strictement réservé à user.id) */}
          <Card className="p-4 space-y-3">
            {filteredDocs.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                <FileText className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p>Aucun document trouvé dans cette catégorie.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-mediterranean-100 text-mediterranean-700 flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {doc.nom}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          {doc.periode && <span>Période: {doc.periode}</span>}
                          {doc.taille && <span>• {doc.taille}</span>}
                          <span>• {doc.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alert(`Consultation du document ${doc.nom}`)}
                        icon={<Eye className="h-3.5 w-3.5 text-slate-600" />}
                      >
                        Consulter
                      </Button>
                      <Button
                        variant="mediterranean"
                        size="sm"
                        onClick={() => alert(`Téléchargement de ${doc.nom}`)}
                        icon={<Download className="h-3.5 w-3.5" />}
                      >
                        Télécharger
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </section>

        {/* Modal Modification Date Anniversaire */}
        <AnniversaryModal
          isOpen={isAnnivModalOpen}
          userId={user.id}
          currentDate={profile.dateAnniversaire}
          onClose={() => setIsAnnivModalOpen(false)}
          onSave={() => setRefreshKey((k) => k + 1)}
        />
      </div>
    </ProtectedRoute>
  );
}
