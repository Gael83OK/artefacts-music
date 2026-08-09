"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { authService } from "@/lib/auth-service";
import { getUserRoleLabel } from "@/lib/mock-users";
import { AuthUser } from "@/types/auth";
import { MemberDetailModal } from "@/components/annuaire/MemberDetailModal";
import { MemberManageModal } from "@/components/annuaire/MemberManageModal";
import { useAuth } from "@/context/AuthContext";
import { canManageUsers } from "@/lib/permissions";
import {
  Users,
  Search,
  Phone,
  MessageSquare,
  Mail,
  ArrowRight,
  UserPlus,
} from "lucide-react";

type RoleFilter = "all" | "musician" | "production" | "hybrid_production" | "super_admin";

export default function AnnuairePage() {
  const { user } = useAuth();
  const canManage = canManageUsers(user);

  const [members, setMembers] = useState<AuthUser[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  
  // Modals state
  const [selectedMember, setSelectedMember] = useState<AuthUser | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<AuthUser | null>(null);

  const refreshMembers = () => {
    setMembers(authService.getAvailableProfiles());
  };

  useEffect(() => {
    refreshMembers();
  }, []);

  const handleOpenMember = (member: AuthUser) => {
    setSelectedMember(member);
    setIsDetailOpen(true);
  };

  const handleAddMember = () => {
    setEditingMember(null);
    setIsManageOpen(true);
  };

  const handleEditMemberFromModal = (member: AuthUser) => {
    setEditingMember(member);
    setIsManageOpen(true);
  };

  const filteredMembers = members.filter((m) => {
    // Role filter
    if (roleFilter !== "all" && m.role !== roleFilter) {
      return false;
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      const roleLabel = getUserRoleLabel(m).toLowerCase();
      const prenom = m.prenom.toLowerCase();
      const nom = (m.nom || "").toLowerCase();
      const ville = (m.ville || "").toLowerCase();
      const instrument = (m.instrument || "").toLowerCase();

      return (
        prenom.includes(q) ||
        nom.includes(q) ||
        roleLabel.includes(q) ||
        ville.includes(q) ||
        instrument.includes(q)
      );
    }

    return true;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Annuaire"
          subtitle="Carnet de contacts interne de l'équipe Artefacts Music."
          badge={<Badge variant="mediterranean">Contacts Équipe ({members.length})</Badge>}
        />

        {canManage && (
          <Button
            variant="mediterranean"
            size="sm"
            onClick={handleAddMember}
            icon={<UserPlus className="h-4 w-4" />}
            className="shrink-0 self-start sm:self-auto"
          >
            Ajouter un membre
          </Button>
        )}
      </div>

      {/* Barre de Recherche Instantanée & Filtres par Rôle */}
      <div className="space-y-3 bg-slate-100/70 p-3.5 rounded-2xl border border-slate-200/80">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Onglets Filtres par Rôle */}
          <div className="flex flex-wrap items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 w-full sm:w-auto">
            <button
              onClick={() => setRoleFilter("all")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                roleFilter === "all"
                  ? "bg-mediterranean-600 text-white shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Tous ({members.length})
            </button>
            <button
              onClick={() => setRoleFilter("musician")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                roleFilter === "musician"
                  ? "bg-mediterranean-600 text-white shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Musiciens
            </button>
            <button
              onClick={() => setRoleFilter("production")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                roleFilter === "production"
                  ? "bg-mediterranean-600 text-white shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Production
            </button>
            <button
              onClick={() => setRoleFilter("hybrid_production")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                roleFilter === "hybrid_production"
                  ? "bg-mediterranean-600 text-white shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Hybrides
            </button>
            <button
              onClick={() => setRoleFilter("super_admin")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                roleFilter === "super_admin"
                  ? "bg-mediterranean-600 text-white shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Super Admin
            </button>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par prénom, nom, rôle, ville ou instrument..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mediterranean-500/30 font-medium"
          />
        </div>
      </div>

      {/* Grille des membres (Cartes compactes mobile-first) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredMembers.length === 0 ? (
          <div className="sm:col-span-2">
            <Card className="p-8 text-center border-dashed">
              <Users className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-900">
                {search.trim()
                  ? "Aucun membre ne correspond à votre recherche."
                  : "Aucun membre trouvé."}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Essayez d&apos;autres termes de recherche ou réinitialisez les filtres.
              </p>
            </Card>
          </div>
        ) : (
          filteredMembers.map((member) => {
            const roleLabel = getUserRoleLabel(member);
            const hasPhone = Boolean(member.phone && member.phone.trim());
            const hasEmail = Boolean(member.email && member.email.trim());

            return (
              <Card
                key={member.id}
                interactive
                onClick={() => handleOpenMember(member)}
                className="p-4 space-y-3 hover:border-slate-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar
                      name={`${member.prenom} ${member.nom}`}
                      size="md"
                      status={member.actif !== false ? "online" : "offline"}
                      alt={`Photo de profil de ${member.prenom} ${member.nom}`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-extrabold text-slate-900 leading-tight truncate">
                          {member.prenom} {member.nom}
                        </h3>
                        {member.actif === false && (
                          <span className="text-[9px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">
                            Désactivé
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-semibold text-mediterranean-600 mt-0.5">
                        {roleLabel}
                      </div>
                      {member.instrument && member.instrument.trim() !== "" && (
                        <div className="text-xs text-slate-500 truncate mt-0.5 font-medium">
                          🎸 {member.instrument}
                        </div>
                      )}
                      {member.ville && member.ville.trim() !== "" && (
                        <div className="text-[11px] text-slate-400 truncate">
                          📍 {member.ville}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Raccourcis d'actions rapides sous la carte (uniquement si les infos existent) */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    {hasPhone && (
                      <a
                        href={`tel:${member.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors"
                        title="Appeler"
                      >
                        <Phone className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {hasPhone && (
                      <a
                        href={`sms:${member.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 bg-mediterranean-50 text-mediterranean-700 hover:bg-mediterranean-100 rounded-lg transition-colors"
                        title="Envoyer un SMS"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {hasEmail && (
                      <a
                        href={`mailto:${member.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded-lg transition-colors"
                        title="Envoyer un e-mail"
                      >
                        <Mail className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1 font-semibold text-slate-600">
                    <span>Fiche</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Modal Fiche d'un membre */}
      <MemberDetailModal
        isOpen={isDetailOpen}
        member={selectedMember}
        onClose={() => setIsDetailOpen(false)}
        onEdit={handleEditMemberFromModal}
      />

      {/* Modal Ajout / Édition Membre */}
      <MemberManageModal
        isOpen={isManageOpen}
        member={editingMember}
        onClose={() => setIsManageOpen(false)}
        onSuccess={refreshMembers}
      />
    </div>
  );
}
