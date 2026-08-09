"use client";

import React, { useState, useEffect } from "react";
import { materielService } from "@/lib/materiel-service";
import { authService } from "@/lib/auth-service";
import { MissionSpecifique } from "@/types/materiel";
import { AuthUser } from "@/types/auth";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/context/AuthContext";
import { MissionFormModal } from "./MissionFormModal";
import { Package, CheckSquare, Square, Plus, Edit, Trash2, CheckCircle2 } from "lucide-react";

interface PrestationMissionsCardProps {
  prestationId: string;
}

export function PrestationMissionsCard({ prestationId }: PrestationMissionsCardProps) {
  const { user, canManageMaterials, canEditEvent } = useAuth();
  const [missions, setMissions] = useState<MissionSpecifique[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMission, setEditingMission] = useState<MissionSpecifique | null>(null);

  const loadMissions = React.useCallback(() => {
    setMissions(materielService.getMissionsForPrestation(prestationId));
  }, [prestationId]);

  useEffect(() => {
    loadMissions();
  }, [loadMissions]);


  const handleToggle = (id: string) => {
    materielService.toggleMissionStatus(id, user ? `${user.prenom} ${user.nom}` : "Artiste");
    loadMissions();
  };

  const handleSave = (data: Omit<MissionSpecifique, "id" | "updatedAt">) => {
    if (editingMission) {
      materielService.updateMission(
        editingMission.id,
        data,
        user ? `${user.prenom} ${user.nom}` : "Production"
      );
    } else {
      materielService.createMission(
        data,
        user ? `${user.prenom} ${user.nom}` : "Production"
      );
    }
    loadMissions();
    setEditingMission(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cette mission logistique ?")) {
      materielService.deleteMission(id);
      loadMissions();
    }
  };

  const canUserEdit = canManageMaterials() || canEditEvent();

  return (
    <Card className="p-5 space-y-4 border-rose-200 bg-gradient-to-br from-white via-rose-50/20 to-white">
      <div className="flex items-center justify-between">
        <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Package className="h-4 w-4 text-rose-600" />
          <span>Missions Logistiques & Matériel Spécifique ({missions.length})</span>
        </div>

        {canUserEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditingMission(null);
              setIsModalOpen(true);
            }}
            icon={<Plus className="h-3.5 w-3.5 text-rose-600" />}
          >
            Ajouter une mission
          </Button>
        )}
      </div>

      {/* ÉTAT VIDE SOBRE EXIGÉ PAR LE PROMPT 009 */}
      {missions.length === 0 ? (
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-center text-xs text-slate-500 font-medium">
          ☕ Rien de particulier pour cette prestation.
        </div>
      ) : (
        <div className="space-y-2.5">
          {missions.map((mission) => {
            const responsable = authService.getProfileById(mission.responsableId);
            const isDone = mission.statut === "realise";

            return (
              <div
                key={mission.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isDone
                    ? "bg-slate-50/80 border-slate-200 text-slate-400"
                    : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  {/* Case à cocher réactive */}
                  <button
                    type="button"
                    onClick={() => handleToggle(mission.id)}
                    className={`mt-0.5 p-1 rounded-lg transition-transform active:scale-95 ${
                      isDone
                        ? "text-emerald-600 hover:text-emerald-700"
                        : "text-slate-400 hover:text-rose-600"
                    }`}
                  >
                    {isDone ? (
                      <CheckSquare className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <Square className="h-5 w-5" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div
                      className={`text-sm font-bold tracking-tight ${
                        isDone ? "line-through text-slate-500" : "text-slate-900"
                      }`}
                    >
                      {mission.titre}
                    </div>

                    {mission.description && (
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        {mission.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Membre responsable & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0 shrink-0">
                  {responsable && (
                    <div className="flex items-center gap-2 pl-2">
                      <Avatar
                        name={`${responsable.prenom} ${responsable.nom}`}
                        size="sm"
                      />
                      <span className="text-xs font-semibold text-slate-700">
                        {responsable.prenom}
                      </span>
                    </div>
                  )}

                  {canUserEdit && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingMission(mission);
                          setIsModalOpen(true);
                        }}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                        title="Modifier"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(mission.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                        title="Supprimer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de création / édition */}
      <MissionFormModal
        isOpen={isModalOpen}
        prestationId={prestationId}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMission(null);
        }}
        onSave={handleSave}
        initialData={editingMission}
      />
    </Card>
  );
}
