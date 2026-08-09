"use client";

import React, { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { indisponibiliteService } from "@/lib/indisponibilite-service";
import { Indisponibilite } from "@/types/indisponibilite";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  Info,
  CalendarOff,
  CheckCircle2,
  X,
  Save,
  Sparkles,
} from "lucide-react";

const MONTH_NAMES = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const DAY_NAMES = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export default function IndisponibilitesPage() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)); // Default August 2026
  const [indisponibilites, setIndisponibilites] = useState<Indisponibilite[]>([]);

  // Selection Modal state
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [selectedExisting, setSelectedExisting] = useState<Indisponibilite | null>(null);
  const [noteInput, setNoteInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = React.useCallback(() => {
    if (user) {
      const items = indisponibiliteService.getByUser(user.id);
      setIndisponibilites(items);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (!user) return null;

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Calendar matrix calculations
  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Adjust for Monday start (0 = Mon, 6 = Sun)
  let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startingDayOfWeek === -1) startingDayOfWeek = 6;

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyLeadCells = Array.from({ length: startingDayOfWeek }, (_, i) => i);

  // Filter unavailabilities for selected month
  const monthPrefix = `${currentYear}-${currentMonth < 10 ? "0" + currentMonth : currentMonth}`;
  const currentMonthIndisps = indisponibilites.filter((item) =>
    item.date.startsWith(monthPrefix)
  );

  const handleDayClick = (dayNum: number) => {
    const dayStr = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
    const dateStr = `${monthPrefix}-${dayStr}`;

    const existing = indisponibilites.find((item) => item.date === dateStr);
    setSelectedDateStr(dateStr);
    setSelectedExisting(existing || null);
    setNoteInput(existing?.note || "");
    setIsModalOpen(true);
  };

  const handleToggleUnavailability = () => {
    if (!selectedDateStr) return;
    indisponibiliteService.toggleDate(user.id, selectedDateStr, noteInput);
    loadData();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    indisponibiliteService.remove(id);
    loadData();
    setIsModalOpen(false);
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <ProtectedRoute>
      <div className="space-y-6 max-w-3xl mx-auto">
        <PageHeader
          title="Mes indisponibilités"
          subtitle="Saisie et consultation de vos dates d'indisponibilité personnelles pour éviter les conflits de planning."
          badge={<Badge variant="rose">Espace Personnel</Badge>}
        />

        {/* Note d'information calme */}
        <div className="p-3.5 bg-rose-50/70 border border-rose-200/80 rounded-2xl text-xs text-rose-900 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-rose-600 shrink-0" />
          <span>
            <strong>Gestion personnelle :</strong> Cliquez sur une date du calendrier pour vous déclarer indisponible. Vos blocages sont immédiatement pris en compte pour la réservation des prestations.
          </span>
        </div>

        {/* CALENDRIER MENSUEL TACTILE */}
        <Card className="p-5 sm:p-6 space-y-4 border-slate-200">
          {/* Navigation du mois */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 capitalize tracking-tight">
                {MONTH_NAMES[currentMonth - 1]} {currentYear}
              </h2>
              <Badge variant="violet" size="sm">
                {currentMonthIndisps.length} indisponible{currentMonthIndisps.length > 1 ? "s" : ""}
              </Badge>
            </div>

            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" onClick={handleToday}>
                Aujourd&apos;hui
              </Button>
              <button
                onClick={handlePrevMonth}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                title="Mois précédent"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                title="Mois suivant"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* En-tête des jours de la semaine */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {DAY_NAMES.map((d) => (
              <div
                key={d}
                className="text-xs font-bold text-slate-400 uppercase tracking-wider py-1"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Grille des jours du mois (Tactile Mobile-First) */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Cellules vides du début de mois */}
            {emptyLeadCells.map((i) => (
              <div key={`empty-${i}`} className="h-12 sm:h-14 bg-slate-50/50 rounded-xl" />
            ))}

            {/* Jours du mois */}
            {daysArray.map((dayNum) => {
              const dayStr = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
              const dateStr = `${monthPrefix}-${dayStr}`;

              const isUnavailable = indisponibilites.some(
                (item) => item.date === dateStr
              );
              const unavailItem = indisponibilites.find(
                (item) => item.date === dateStr
              );
              const isToday = dateStr === todayStr;

              return (
                <button
                  key={dayNum}
                  type="button"
                  onClick={() => handleDayClick(dayNum)}
                  className={`h-12 sm:h-14 p-1 rounded-2xl flex flex-col items-center justify-between text-xs transition-all active:scale-95 border ${
                    isUnavailable
                      ? "bg-rose-500 text-white font-bold border-rose-600 shadow-sm"
                      : isToday
                      ? "bg-violet-50 text-violet-900 font-bold border-violet-400 ring-2 ring-violet-500/20"
                      : "bg-white hover:bg-slate-100 text-slate-800 border-slate-200"
                  }`}
                >
                  <span className="text-xs">{dayNum}</span>

                  {/* Symbole visuel accessible + motif */}
                  {isUnavailable ? (
                    <span className="text-[10px] bg-rose-600 px-1 py-0.5 rounded-md font-extrabold flex items-center gap-0.5 truncate max-w-full">
                      🚫 Indisp.
                    </span>
                  ) : isToday ? (
                    <span className="text-[9px] text-violet-600 font-bold">Auj.</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </Card>

        {/* LISTE RÉCAPITULATIVE DU MOIS (Prompt 013) */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CalendarOff className="h-4 w-4 text-rose-600" />
              <span>Indisponibilités enregistrées en {MONTH_NAMES[currentMonth - 1]} ({currentMonthIndisps.length})</span>
            </h3>
          </div>

          {currentMonthIndisps.length === 0 ? (
            /* ÉTAT VIDE EXIGÉ PAR LE PROMPT 013 */
            <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center space-y-1">
              <p className="text-xs font-bold text-slate-900">
                Aucune indisponibilité enregistrée.
              </p>
              <p className="text-xs text-slate-500">
                Sélectionnez une date dans le calendrier pour l&apos;ajouter.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {currentMonthIndisps.map((item) => {
                const formatted = new Date(item.date).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                });

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3.5 bg-rose-50/60 rounded-2xl border border-rose-200/80 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 capitalize flex items-center gap-2">
                        <span className="text-rose-600 font-black">🚫 {formatted}</span>
                      </div>
                      {item.note && (
                        <p className="text-xs text-slate-600 italic">
                          Motif : {item.note}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                      title="Retirer cette indisponibilité"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* MODAL DE SÉLECTION D'UNE DATE */}
        {isModalOpen && selectedDateStr && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
              onClick={() => setIsModalOpen(false)}
            />

            <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 z-50 text-left space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <Badge variant={selectedExisting ? "rose" : "violet"}>
                    {selectedExisting ? "Date Indisponible" : "Marquer Indisponible"}
                  </Badge>
                  <h3 className="text-base font-bold text-slate-900 mt-1 capitalize">
                    {new Date(selectedDateStr).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Motif / Note facultative
                  </label>
                  <input
                    type="text"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="ex: Mariage familial, Congé, Tournée perso..."
                    className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500/30"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between gap-2 border-t border-slate-100">
                {selectedExisting ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-rose-600 border-rose-200 hover:bg-rose-50"
                    onClick={handleToggleUnavailability}
                    icon={<Trash2 className="h-4 w-4" />}
                  >
                    Rendre disponible
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Annuler
                  </Button>
                )}

                <Button
                  type="button"
                  variant="rose"
                  size="sm"
                  onClick={handleToggleUnavailability}
                  icon={<Save className="h-4 w-4" />}
                >
                  {selectedExisting ? "Enregistrer" : "Confirmer Indisponible"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
