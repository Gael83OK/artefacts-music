"use client";

import React from "react";
import { AuthUser } from "@/types/auth";
import { getUserRoleLabel } from "@/lib/mock-users";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { X, Phone, MessageSquare, Mail, MapPin, Music, Edit3 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { canManageUsers } from "@/lib/permissions";

interface MemberDetailModalProps {
  isOpen: boolean;
  member: AuthUser | null;
  onClose: () => void;
  onEdit?: (member: AuthUser) => void;
}

export function MemberDetailModal({
  isOpen,
  member,
  onClose,
  onEdit,
}: MemberDetailModalProps) {
  const { user } = useAuth();
  if (!isOpen || !member) return null;

  const roleLabel = getUserRoleLabel(member);
  const canEdit = canManageUsers(user);

  const hasPhone = Boolean(member.phone && member.phone.trim());
  const hasEmail = Boolean(member.email && member.email.trim());
  const hasActions = hasPhone || hasEmail;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 z-50 text-left space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <Badge variant="mediterranean">Fiche Contact</Badge>
          <div className="flex items-center gap-1">
            {canEdit && onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(member);
                }}
                className="p-2 text-slate-500 hover:text-mediterranean-600 hover:bg-slate-100 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1"
                title="Modifier ce membre"
              >
                <Edit3 className="h-4 w-4" />
                <span className="hidden sm:inline">Éditer</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Identification du Membre */}
        <div className="flex items-center gap-4">
          <Avatar
            name={`${member.prenom} ${member.nom}`}
            size="lg"
            status={member.actif !== false ? "online" : "offline"}
            className="ring-4 ring-mediterranean-500/20 shrink-0"
          />
          <div className="space-y-1 min-w-0 flex-1">
            <h3 className="text-lg font-extrabold text-slate-900 leading-tight truncate">
              {member.prenom} {member.nom}
            </h3>
            <div className="text-xs font-semibold text-mediterranean-600 bg-mediterranean-50 px-2.5 py-0.5 rounded-md inline-block">
              {roleLabel}
            </div>
            {member.actif === false && (
              <div className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded ml-1 inline-block">
                Désactivé
              </div>
            )}
          </div>
        </div>

        {/* Détails de Contact Exclusifs (Ville, Instrument, Tél, Email) */}
        <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs">
          {member.instrument && member.instrument.trim() !== "" && (
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <Music className="h-4 w-4 text-violet-500 shrink-0" />
              <span>{member.instrument}</span>
            </div>
          )}

          {member.ville && member.ville.trim() !== "" && (
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
              <span>{member.ville}</span>
            </div>
          )}

          {hasPhone && (
            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="font-mono font-medium">{member.phone}</span>
            </div>
          )}

          {hasEmail && (
            <div className="flex items-center gap-2 text-slate-700">
              <Mail className="h-4 w-4 text-violet-600 shrink-0" />
              <span className="truncate font-medium">{member.email}</span>
            </div>
          )}
        </div>

        {/* ACTIONS RAPIDES NATIVES MOBILE (Appel, SMS, Email) - Uniquement si disponibles */}
        {hasActions && (
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              Actions Directes Smartphone
            </span>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {hasPhone && (
                <a href={`tel:${member.phone}`} className="flex-1 min-w-[90px]">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-center bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 py-2.5"
                    icon={<Phone className="h-4 w-4 text-emerald-600" />}
                  >
                    Appeler
                  </Button>
                </a>
              )}

              {hasPhone && (
                <a href={`sms:${member.phone}`} className="flex-1 min-w-[90px]">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-center bg-mediterranean-50 text-mediterranean-800 border-mediterranean-200 hover:bg-mediterranean-100 py-2.5"
                    icon={<MessageSquare className="h-4 w-4 text-mediterranean-600" />}
                  >
                    SMS
                  </Button>
                </a>
              )}

              {hasEmail && (
                <a href={`mailto:${member.email}`} className="flex-1 min-w-[90px]">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-center bg-violet-50 text-violet-800 border-violet-200 hover:bg-violet-100 py-2.5"
                    icon={<Mail className="h-4 w-4 text-violet-600" />}
                  >
                    E-mail
                  </Button>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
