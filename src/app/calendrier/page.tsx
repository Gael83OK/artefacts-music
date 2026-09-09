"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { prestationService } from "@/lib/prestation-service";
import { repetitionService } from "@/lib/repetition-service";
import { Prestation } from "@/types/prestation";
import { Repetition } from "@/types/repetition";
import { PrestationFormModal } from "@/components/prestations/PrestationFormModal";
import { useAuth } from "@/context/AuthContext";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Plus,
  ArrowRight,
  Shield,
  Search,
  Mic2,
  Sparkles,
  Music,
  History,
  CheckCircle2,
} from "lucide-react";

type FilterType = "all" | "prestations" | "repetitions";
type TimeScope = "upcoming" | "past";

interface UnifiedEvent {
  id: string;
  type: "prestation" | "repetition";
  titre: string;
  date: string; // YYYY-MM-DD
  heureArrivee?: string;
  heureDebut: string;
  heureFin: string;
  lieu: string;
  adresse?: string;
  formation?: string;
  objet?: string; // For rehearsals
  status: string;
  musicianIds: string[];
  responsableId?: string;
  prestationRaw?: Prestation;
  repetitionRaw?: Repetition;
}

export default function CalendrierPage() {
  const { user, canEditEvent } = useAuth();
  const [filter, setFilter] = useState<FilterType>("all");
  const [scope, setScope] = useState<TimeScope>("upcoming");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [prestations, setPrestations] = useState<Prestation[]>([]);
  const [repetitions, setRepetitions] = useState<Repetition[]>([]);

  useEffect(() => {
    setPrestations(prestationService.getAll());
    setRepetitions(repetitionService.getAll());
  }, []);

  const handleCreatePrestation = (data: Omit<Prestation, "id" | "updatedAt">) => {
    prestationService.create(
      data,
      user ? `${user.prenom} ${user.nom}` : "Production"
    );
    setPrestations(prestationService.getAll());
  };

  // Convert and unify events
  const todayStr = new Date().toISOString().split("T")[0];

  const allUnified: UnifiedEvent[] = [
    ...prestations.map((p) => ({
      id: p.id,
      type: "prestation" as const,
      titre: p.titre,
      date: p.date,
      heureArrivee: p.heureArrivee,
      heureDebut: p.heureDebut,
      heureFin: p.heureFin,
      lieu: p.lieu,
      adresse: p.adresse,
      formation: p.formation,
      status: p.status,
      musicianIds: p.musicianIds,
      responsableId: p.responsableId,
      prestationRaw: p,
    })),
    ...repetitions.map((r) => ({
      id: r.id,
      type: "repetition" as const,
      titre: r.titre,
      date: r.date,
      heureArrivee: r.heureDebut,
      heureDebut: r.heureDebut,
      heureFin: r.heureFin,
      lieu: r.lieu,
      adresse: r.adresse,
      formation: r.formation,
      objet: r.objet,
      status: r.status,
      musicianIds: r.musicianIds,
      repetitionRaw: r,
    })),
  ];

  // Filter based on user profile if musician, or scope (upcoming vs past)
  const filteredEvents = allUnified
    .filter((e) => {
      // Filter by type (Tout, Prestations, Répétitions)
      if (filter === "prestations" && e.type !== "prestation") return false;
      if (filter === "repetitions" && e.type !== "repetition") return false;

      // Filter by scope (Upcoming vs Past)
      if (scope === "upcoming" && e.date < todayStr) return false;
      if (scope === "past" && e.date >= todayStr) return false;

      // Search term filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitre = e.titre.toLowerCase().includes(q);
        const matchLieu = e.lieu.toLowerCase().includes(q);
        const matchObjet = e.objet ? e.objet.toLowerCase().includes(q) : false;
        return matchTitre || matchLieu || matchObjet;
      }

      return true;
    })
    .sort((a, b) => (scope === "upcoming" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)));

  // Identify next upcoming prestation for the logged in user
  const userUpcomingPrestations = allUnified
    .filter((e) => e.type === "prestation" && e.date >= todayStr && (!user || e.musicianIds.includes(user.id)))
    .sort((a, b) => a.date.localeCompare(b.date));

  const nextPrestationId = userUpcomingPrestations.length > 0 ? userUpcomingPrestations[0].id : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendrier & Planning"
        subtitle="Consultez rapidement toutes les prestations et séances de répétitions."
        badge={<Badge variant="mediterranean">Agenda Événements & Répétitions</Badge>}
        actions={
          canEditEvent() ? (
            <Button
              variant="mediterranean"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => setIsModalOpen(true)}
            >
              Nouvelle Prestation
            </Button>
          ) : undefined
        }
      />

      {/* Barre de sélection des FILTRES (Tout, Prestations, Répétitions) + Scope (À venir / Passés) */}
      <div
        className="space-y-3 p-3.5 rounded-2xl"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-medium)",
        }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Onglets Filtres (1. Tout, 2. Prestations, 3. Répétitions) */}
          <div
            className="flex items-center gap-1 p-1 rounded-xl w-full sm:w-auto"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <button
              onClick={() => setFilter("all")}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filter === "all"
                  ? "bg-violet-600 text-white shadow-sm font-bold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Tout ({allUnified.length})
            </button>
            <button
              onClick={() => setFilter("prestations")}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filter === "prestations"
                  ? "bg-violet-600 text-white shadow-sm font-bold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Prestations ({prestations.length})
            </button>
            <button
              onClick={() => setFilter("repetitions")}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filter === "repetitions"
                  ? "bg-violet-600 text-white shadow-sm font-bold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Répétitions ({repetitions.length})
            </button>
          </div>

          {/* Scope Temporel : À venir vs Historique */}
          <div
            className="flex items-center gap-1 p-1 rounded-xl w-full sm:w-auto justify-end"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <button
              onClick={() => setScope("upcoming")}
              className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                scope === "upcoming"
                  ? "bg-violet-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              À venir
            </button>
            <button
              onClick={() => setScope("past")}
              className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                scope === "past"
                  ? "bg-violet-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Historique
            </button>
          </div>
        </div>

        {/* Barre de Recherche */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par titre, lieu ou objet de répétition..."
            className="w-full h-9 pl-9 pr-3 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            style={{
              background: "var(--bg-surface)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-medium)",
            }}
          />
        </div>
      </div>

      {/* Liste Chronologique des Événements */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <Card className="p-8 text-center border-dashed">
            <CalendarIcon className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-white">Aucun événement planifié</h3>
            <p className="text-xs text-slate-400 mt-1">
              {scope === "upcoming"
                ? "Aucun événement à venir ne correspond à vos filtres."
                : "Aucun événement passé dans l'historique."}
            </p>
          </Card>
        ) : (
          filteredEvents.map((e) => {
            const isToday = e.date === todayStr;
            const isNext = e.id === nextPrestationId;

            const formattedDate = new Date(e.date).toLocaleDateString("fr-FR", {
              weekday: "short",
              day: "numeric",
              month: "short",
            });

            const targetHref = e.type === "prestation" ? `/evenement/${e.id}` : `/repetitions/${e.id}`;

            return (
              <Link key={`${e.type}-${e.id}`} href={targetHref} className="block">
                <Card
                  interactive
                  className={`p-5 relative transition-all border ${
                    isToday
                      ? "border-amber-400/50 ring-2 ring-amber-400/20"
                      : isNext
                      ? "border-violet-500/50 ring-2 ring-violet-500/20"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2 min-w-0 flex-1">
                      {/* En-tête de carte avec Badges : Statut, Type, Today & Next */}
                      <div className="flex flex-wrap items-center gap-2">
                        {isToday && (
                          <Badge variant="amber">
                            Aujourd&apos;hui 📍
                          </Badge>
                        )}

                        {isNext && !isToday && (
                          <Badge variant="violet">
                            Prochaine Prestation ⭐
                          </Badge>
                        )}

                        {e.type === "prestation" ? (
                          <Badge variant="mediterranean" size="sm">
                            Prestation • {e.formation}
                          </Badge>
                        ) : (
                          <Badge variant="violet" size="sm">
                            Répétition • Studio
                          </Badge>
                        )}

                        <Badge
                          variant={
                            e.status === "confirme"
                              ? "success"
                              : e.status === "option"
                              ? "warning"
                              : "rose"
                          }
                          size="sm"
                        >
                          {e.status === "confirme"
                            ? "Confirmé"
                            : e.status === "option"
                            ? "Option"
                            : "Annulé"}
                        </Badge>
                      </div>

                      {/* Titre & Horaires */}
                      <h3 className="text-lg font-bold text-white leading-tight">
                        {e.titre}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
                        <span className="flex items-center gap-1 font-semibold text-violet-300 capitalize">
                          <CalendarIcon className="h-3.5 w-3.5 text-violet-400 shrink-0" />
                          {formattedDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          {e.heureDebut} - {e.heureFin}
                          {e.heureArrivee && (
                            <span className="text-[11px] text-slate-400 ml-1">
                              (convocation {e.heureArrivee})
                            </span>
                          )}
                        </span>
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          {e.lieu}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0 shrink-0">
                      {e.type === "prestation" && e.responsableId && (
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Shield className="h-3.5 w-3.5 text-violet-500 shrink-0" />
                          <span>Responsable assigné</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-xs text-mediterranean-600 font-semibold">
                        <span>{e.type === "prestation" ? "Fiche prestation" : "Détails répétition"}</span>
                        <ArrowRight className="h-4 w-4 shrink-0" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })
        )}
      </div>

      {/* Modal de création de prestation */}
      <PrestationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreatePrestation}
      />
    </div>
  );
}
