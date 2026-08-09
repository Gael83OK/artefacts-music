"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { materielService } from "@/lib/materiel-service";
import { prestationService } from "@/lib/prestation-service";
import { authService } from "@/lib/auth-service";
import { MissionSpecifique, MaterielSpecifique, MaterielStatus } from "@/types/materiel";
import { MissionFormModal } from "@/components/materiel/MissionFormModal";
import { EquipmentFormModal } from "@/components/materiel/EquipmentFormModal";
import { useAuth } from "@/context/AuthContext";
import {
  Package,
  Plus,
  CheckSquare,
  Square,
  Calendar,
  User,
  ArrowRight,
  Sparkles,
  Wrench,
  Edit,
  Trash2,
  CheckCircle2,
  Box,
} from "lucide-react";

export default function MaterielPage() {
  const { user, canManageMaterials, canEditEvent } = useAuth();
  const [missions, setMissions] = useState<MissionSpecifique[]>([]);
  const [materiels, setMateriels] = useState<MaterielSpecifique[]>([]);
  
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [isEquipModalOpen, setIsEquipModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<MaterielSpecifique | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const loadData = () => {
    setMissions(materielService.getAllMissions());
    setMateriels(materielService.getMateriels());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleMission = (id: string) => {
    materielService.toggleMissionStatus(id, user ? `${user.prenom} ${user.nom}` : "Artiste");
    loadData();
  };

  const handleCreateMission = (data: Omit<MissionSpecifique, "id" | "updatedAt">) => {
    materielService.createMission(
      data,
      user ? `${user.prenom} ${user.nom}` : "Production"
    );
    loadData();
  };

  const handleSaveEquipment = (data: Omit<MaterielSpecifique, "id" | "updatedAt">) => {
    const editor = user ? `${user.prenom} ${user.nom}` : "Production";
    if (editingEquipment) {
      materielService.updateMateriel(editingEquipment.id, data, editor);
    } else {
      materielService.createMateriel(data, editor);
    }
    setEditingEquipment(null);
    loadData();
  };

  const handleStatusChange = (id: string, newStatus: MaterielStatus) => {
    materielService.updateMaterielStatus(
      id,
      newStatus,
      user ? `${user.prenom} ${user.nom}` : "Production"
    );
    loadData();
  };

  const handleDeleteEquipment = (mat: MaterielSpecifique) => {
    if (confirm(`Voulez-vous vraiment supprimer ou archiver l'équipement "${mat.nom}" ?`)) {
      const res = materielService.deleteMateriel(mat.id);
      if (res.archived) {
        alert(`L'équipement "${mat.nom}" est référencé dans l'historique des missions. Il a été passé en archivage (indisponible) pour préserver l'historique.`);
      }
      loadData();
    }
  };

  const filteredMateriels = materiels.filter((m) => {
    if (statusFilter !== "all" && m.statut !== statusFilter) return false;
    return true;
  });

  const getStatusBadge = (statut: MaterielStatus) => {
    switch (statut) {
      case "disponible":
        return <Badge variant="success" size="sm">Disponible</Badge>;
      case "en_utilisation":
        return <Badge variant="violet" size="sm">En utilisation</Badge>;
      case "en_maintenance":
        return <Badge variant="warning" size="sm">En maintenance</Badge>;
      case "indisponible":
        return <Badge variant="rose" size="sm">Indisponible</Badge>;
    }
  };

  const canUserEdit = canManageMaterials() || canEditEvent();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parc Matériel & Missions Logistiques"
        subtitle="Inventaire central du parc matériel Artefacts Music et suivi des missions logistiques d'exception."
        badge={<Badge variant="rose">Parc & Logistique</Badge>}
        actions={
          canUserEdit ? (
            <div className="flex items-center gap-2">
              <Button
                variant="violet"
                icon={<Plus className="h-4 w-4" />}
                onClick={() => {
                  setEditingEquipment(null);
                  setIsEquipModalOpen(true);
                }}
              >
                Ajouter un Équipement
              </Button>
              <Button
                variant="rose"
                icon={<Plus className="h-4 w-4" />}
                onClick={() => setIsMissionModalOpen(true)}
              >
                Nouvelle Mission
              </Button>
            </div>
          ) : undefined
        }
      />

      {/* Note d'information */}
      <div className="p-3.5 bg-rose-50/70 border border-rose-200/80 rounded-2xl text-xs text-rose-900 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-rose-600 shrink-0" />
        <span>
          <strong>Parc Matériel Central :</strong> Gestion répertoriée du matériel sonorisation, éclairage, régie et instruments stockés au local de Rognes.
        </span>
      </div>

      {/* SECTION 1: PARC MATÉRIEL CENTRAL */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Wrench className="h-5 w-5 text-violet-600" />
            <span>Parc Matériel Central ({filteredMateriels.length})</span>
          </h2>

          {/* Filtres par Statut */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {["all", "disponible", "en_utilisation", "en_maintenance", "indisponible"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  statusFilter === st
                    ? "bg-violet-600 text-white shadow-sm font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {st === "all"
                  ? "Tous"
                  : st === "disponible"
                  ? "Disponible"
                  : st === "en_utilisation"
                  ? "En utilisation"
                  : st === "en_maintenance"
                  ? "En maintenance"
                  : "Indisponible"}
              </button>
            ))}
          </div>
        </div>

        {filteredMateriels.length === 0 ? (
          <Card className="p-8 text-center border-dashed">
            <Box className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-900">Aucun matériel trouvé</h3>
            <p className="text-xs text-slate-500 mt-1">
              Aucun équipement ne correspond à ce filtre de statut.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredMateriels.map((mat) => {
              const prestation = mat.prestationId ? prestationService.getById(mat.prestationId) : null;

              return (
                <Card key={mat.id} className="p-4 space-y-3 border-slate-200 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge variant="neutral" size="sm">
                          {mat.categorie}
                        </Badge>
                        {mat.quantite && mat.quantite > 1 && (
                          <Badge variant="violet" size="sm">
                            Qté : {mat.quantite}
                          </Badge>
                        )}
                        <span className="text-[11px] text-slate-400">
                          📍 {mat.depot || "Rognes"}
                        </span>
                      </div>

                      {/* Select de statut si l'utilisateur est éditeur */}
                      {canUserEdit ? (
                        <select
                          value={mat.statut}
                          onChange={(e) => handleStatusChange(mat.id, e.target.value as MaterielStatus)}
                          className="h-7 px-2 text-[11px] font-bold bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
                        >
                          <option value="disponible">Disponible</option>
                          <option value="en_utilisation">En utilisation</option>
                          <option value="en_maintenance">En maintenance</option>
                          <option value="indisponible">Indisponible</option>
                        </select>
                      ) : (
                        getStatusBadge(mat.statut)
                      )}
                    </div>

                    <div>
                      <h4 className="text-base font-extrabold text-slate-900">{mat.nom}</h4>
                      {mat.notes && (
                        <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          💡 {mat.notes}
                        </p>
                      )}
                    </div>

                    {prestation && (
                      <div className="text-xs font-semibold text-violet-700 bg-violet-50 p-2 rounded-lg border border-violet-100 flex items-center justify-between">
                        <span>Affecté à : {prestation.titre}</span>
                        <Link href={`/evenement/${prestation.id}`} className="hover:underline flex items-center gap-0.5">
                          <span>Voir</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    )}
                  </div>

                  {canUserEdit && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingEquipment(mat);
                          setIsEquipModalOpen(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-violet-600 rounded-lg transition-colors flex items-center gap-1 font-semibold"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Éditer</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteEquipment(mat)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors flex items-center gap-1 font-semibold"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                        <span className="text-rose-600">Retirer</span>
                      </button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: MISSIONS LOGISTIQUES À VENIR */}
      <div className="space-y-3 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="h-5 w-5 text-rose-600" />
            <span>Missions Spécifiques En Cours ({missions.length})</span>
          </h2>
        </div>

        {missions.length === 0 ? (
          <Card className="p-8 text-center border-dashed">
            <Package className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-900">Rien de particulier à gérer</h3>
            <p className="text-xs text-slate-500 mt-1">
              Aucune mission logistique d&apos;exception n&apos;est actuellement planifiée.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {missions.map((m) => {
              const prestation = prestationService.getById(m.prestationId);
              const responsable = authService.getProfileById(m.responsableId);
              const linkedMat = m.materielId ? materielService.getMaterielById(m.materielId) : null;
              const isDone = m.statut === "realise";

              return (
                <Card
                  key={m.id}
                  className={`p-4 space-y-3 border-slate-200 transition-all ${
                    isDone ? "bg-slate-50/70 border-slate-200" : "bg-white"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => handleToggleMission(m.id)}
                        className="mt-0.5 text-slate-400 hover:text-rose-600 transition-transform active:scale-95 shrink-0"
                      >
                        {isDone ? (
                          <CheckSquare className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <Square className="h-5 w-5" />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                          <Badge variant={isDone ? "success" : "rose"} size="sm">
                            {isDone ? "Mission Réalisée" : "À faire"}
                          </Badge>
                          {prestation && (
                            <Link href={`/evenement/${prestation.id}`}>
                              <span className="text-[11px] font-semibold text-violet-600 hover:underline">
                                📅 {prestation.titre} ({prestation.date})
                              </span>
                            </Link>
                          )}
                          {linkedMat && (
                            <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                              🔧 Matériel : {linkedMat.nom}
                            </span>
                          )}
                        </div>

                        <h3
                          className={`text-base font-bold ${
                            isDone ? "line-through text-slate-500" : "text-slate-900"
                          }`}
                        >
                          {m.titre}
                        </h3>

                        {m.description && (
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {m.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Responsable de la mission */}
                    {responsable && (
                      <div className="flex items-center gap-2 shrink-0 bg-slate-50 p-2 rounded-xl border border-slate-100 self-start sm:self-center">
                        <Avatar
                          name={`${responsable.prenom} ${responsable.nom}`}
                          size="sm"
                        />
                        <div className="text-xs">
                          <span className="block font-bold text-slate-900">
                            {responsable.prenom} {responsable.nom}
                          </span>
                          <span className="text-[10px] text-slate-500">Responsable</span>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de création de mission */}
      <MissionFormModal
        isOpen={isMissionModalOpen}
        onClose={() => setIsMissionModalOpen(false)}
        onSave={handleCreateMission}
      />

      {/* Modal de gestion matériel */}
      <EquipmentFormModal
        isOpen={isEquipModalOpen}
        onClose={() => {
          setIsEquipModalOpen(false);
          setEditingEquipment(null);
        }}
        onSave={handleSaveEquipment}
        initialData={editingEquipment}
      />
    </div>
  );
}

