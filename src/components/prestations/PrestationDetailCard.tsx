"use client";

import React from "react";
import { Prestation } from "@/types/prestation";
import { AuthUser } from "@/types/auth";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/context/AuthContext";
import { ROLE_DISPLAY_NAMES } from "@/lib/mock-users";
import Link from "next/link";
import { documentService } from "@/lib/document-service";
import { PrestationMissionsCard } from "@/components/materiel/PrestationMissionsCard";
import { PrestationSetlistCard } from "@/components/setlists/PrestationSetlistCard";
import { PrestationChatCard } from "@/components/chat/PrestationChatCard";

import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Phone,
  MessageSquare,
  Mail,
  Shirt,
  Package,
  FileText,
  Download,
  Heart,
  Music,
  Users,
  Shield,
  Edit,
  Trash2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface PrestationDetailCardProps {

  prestation: Prestation;
  musicians: AuthUser[];
  responsable: AuthUser | null;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PrestationDetailCard({
  prestation,
  musicians,
  responsable,
  onEdit,
  onDelete,
}: PrestationDetailCardProps) {
  const { user, canEditEvent, canEditSetlist, isResponsibleForEvent } = useAuth();

  const isUserResponsible = isResponsibleForEvent(prestation);
  const canUserEdit = canEditEvent(prestation) || isUserResponsible;

  const formattedDate = new Date(prestation.date).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${prestation.lieu} ${prestation.adresse}`
  )}`;

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* Barre d'Actions Rapides Mobile (Navigation au pouce) */}
      <div className="grid grid-cols-4 gap-2 sm:hidden bg-slate-900 text-white p-2 rounded-2xl shadow-lg border border-slate-800 text-center text-[11px] font-bold">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 active:scale-95 transition-all"
        >
          <MapPin className="h-4 w-4 text-mediterranean-400 mb-0.5" />
          <span>GPS</span>
        </a>

        {responsable?.phone ? (
          <a
            href={`tel:${responsable.phone}`}
            className="flex flex-col items-center justify-center py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 active:scale-95 transition-all text-emerald-400"
          >
            <Phone className="h-4 w-4 mb-0.5" />
            <span>Appeler</span>
          </a>
        ) : (
          <div className="flex flex-col items-center justify-center py-2.5 rounded-xl bg-slate-800/40 text-slate-500">
            <Phone className="h-4 w-4 mb-0.5" />
            <span>Appeler</span>
          </div>
        )}

        <Link
          href={`/evenement/${prestation.id}/chat`}
          className="flex flex-col items-center justify-center py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 active:scale-95 transition-all text-violet-300"
        >
          <MessageSquare className="h-4 w-4 mb-0.5" />
          <span>Chat</span>
        </Link>

        <a
          href="#setlist-section"
          className="flex flex-col items-center justify-center py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 active:scale-95 transition-all text-amber-300"
        >
          <Music className="h-4 w-4 mb-0.5" />
          <span>Setlist</span>
        </a>
      </div>
      {/* Barre d'actions d'édition si autorisé */}
      {canUserEdit && (
        <div className="flex items-center justify-between bg-slate-100/80 p-3 rounded-2xl border border-slate-200/80">
          <div className="flex items-center gap-2">
            <Badge variant="mediterranean">
              {isUserResponsible ? "Vous êtes Responsable 👑" : "Gestion Prestation"}
            </Badge>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Modifiable par la production et le responsable
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                icon={<Edit className="h-3.5 w-3.5" />}
              >
                Modifier
              </Button>
            )}
            {onDelete && canEditEvent(prestation) && (
              <Button
                variant="outline"
                size="sm"
                className="text-rose-600 border-rose-200 hover:bg-rose-50"
                onClick={onDelete}
                icon={<Trash2 className="h-3.5 w-3.5" />}
              >
                Supprimer
              </Button>
            )}
          </div>
        </div>
      )}

      {/* SECTION 1 & 2 & 3: Date, Titre, Statut & Horaires */}
      <Card className="p-5 sm:p-6 space-y-4 border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge
                variant={
                  prestation.status === "confirme"
                    ? "success"
                    : prestation.status === "option"
                    ? "warning"
                    : "rose"
                }
              >
                {prestation.status === "confirme"
                  ? "Prestation Confirmée"
                  : prestation.status === "option"
                  ? "Option d'Événement"
                  : "Prestation Annulée"}
              </Badge>
              <Badge variant="violet">Formation {prestation.formation}</Badge>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {prestation.titre}
            </h1>

            <div className="flex items-center gap-2 text-sm font-semibold text-mediterranean-600 mt-1 capitalize">
              <Calendar className="h-4 w-4 shrink-0 text-mediterranean-500" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* SECTION 2 & 3: Lieu, Adresse cliquable & Horaires Essentiels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Lieu & Adresse cliquable */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Lieu & Adresse
            </div>
            <div className="text-base font-bold text-slate-900">
              {prestation.lieu}
            </div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-mediterranean-600 hover:text-mediterranean-700 font-medium hover:underline group"
            >
              <MapPin className="h-3.5 w-3.5 text-mediterranean-500 shrink-0" />
              <span>{prestation.adresse}</span>
              <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-mediterranean-600 shrink-0" />
            </a>
            {prestation.infosLieu && (
              <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2">
                ℹ️ {prestation.infosLieu}
              </p>
            )}
          </div>

          {/* Horaires Essentiels */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Horaires Essentiels
            </div>
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="block text-[10px] font-semibold text-slate-400 uppercase">
                  Arrivée
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {prestation.heureArrivee}
                </span>
              </div>
              <div className="border-x border-slate-200 px-1">
                <span className="block text-[10px] font-semibold text-mediterranean-500 uppercase">
                  Début Jeu
                </span>
                <span className="text-sm font-extrabold text-mediterranean-600">
                  {prestation.heureDebut}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-semibold text-slate-400 uppercase">
                  Fin Prévue
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {prestation.heureFin}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* SECTION 5: Responsable de Prestation */}
      {responsable && (
        <Card className="p-5 border-violet-200/80 bg-gradient-to-r from-violet-50/30 to-white">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-violet-700">
              <Shield className="h-4 w-4 text-violet-500" />
              Responsable de Prestation
            </span>
            {isUserResponsible && (
              <Badge variant="violet" size="sm">
                C&apos;est vous !
              </Badge>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar
                name={`${responsable.prenom} ${responsable.nom}`}
                size="md"
                status="online"
              />
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {responsable.prenom} {responsable.nom}
                </div>
                <div className="text-xs text-slate-500">
                  {responsable.instrument || ROLE_DISPLAY_NAMES[responsable.role]}
                </div>
              </div>
            </div>

            {/* Boutons d'action rapide contact */}
            <div className="flex items-center gap-2">
              {responsable.phone && (
                <>
                  <a href={`tel:${responsable.phone}`}>
                    <Button variant="outline" size="sm" icon={<Phone className="h-3.5 w-3.5 text-emerald-600" />}>
                      Appeler
                    </Button>
                  </a>
                  <a href={`sms:${responsable.phone}`}>
                    <Button variant="outline" size="sm" icon={<MessageSquare className="h-3.5 w-3.5 text-mediterranean-600" />}>
                      SMS
                    </Button>
                  </a>
                </>
              )}
              {responsable.email && (
                <a href={`mailto:${responsable.email}`}>
                  <Button variant="outline" size="sm" icon={<Mail className="h-3.5 w-3.5 text-violet-600" />}>
                    Mail
                  </Button>
                </a>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* SECTION 6 & 7: Musiciens Présents & Formation */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="h-4 w-4 text-slate-500" />
            Équipe de Scène ({musicians.length} musiciens)
          </div>
          <Badge variant="mediterranean">Formation {prestation.formation}</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {musicians.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100"
            >
              <Avatar name={`${m.prenom} ${m.nom}`} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-slate-800 truncate">
                  {m.prenom} {m.nom}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {m.instrument || ROLE_DISPLAY_NAMES[m.role]}
                </div>
              </div>
              {m.id === prestation.responsableId && (
                <Badge variant="violet" size="sm">
                  Lead
                </Badge>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* SECTION MATÉRIEL ET MISSIONS SPÉCIFIQUES (Prompt 009) */}
      <PrestationMissionsCard prestationId={prestation.id} />

      {/* SECTION 8, 9, 10, 11: Dress Code, Matériel, Remarques & Demandes Spéciales */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Dress code */}
        {prestation.dressCode && (
          <Card className="p-4 space-y-1.5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Shirt className="h-4 w-4 text-violet-500" />
              Dress Code
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {prestation.dressCode}
            </p>
          </Card>
        )}

        {/* Matériel & Missions */}
        {prestation.materielMissions && (
          <Card className="p-4 space-y-1.5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Package className="h-4 w-4 text-rose-500" />
              Matériel & Missions Spécifiques
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {prestation.materielMissions}
            </p>
          </Card>
        )}

        {/* Remarques Production */}
        {prestation.remarquesProduction && (
          <Card className="p-4 space-y-1.5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-mediterranean-500" />
              Remarques Production
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {prestation.remarquesProduction}
            </p>
          </Card>
        )}

        {/* Demandes Particulières Client */}
        {prestation.demandesSpeciales && (
          <Card className="p-4 space-y-1.5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="h-4 w-4 text-rose-500" />
              Demandes Particulières Client / Mariés
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium bg-rose-50/50 p-2.5 rounded-xl border border-rose-100">
              {prestation.demandesSpeciales}
            </p>
          </Card>
        )}
      </div>

      {/* SECTION SETLIST ET INTÉGRATION iREAL PRO (Prompt 010) */}
      <PrestationSetlistCard prestation={prestation} />


      {/* SECTION CHAT PRIVÉ PAR PRESTATION (Prompt 011) */}
      <PrestationChatCard prestation={prestation} />

      {/* SECTION DOCUMENTS ASSOCIÉS À LA PRESTATION (Prompt 017 & 019) */}
      {(() => {
        const linkedDocs = documentService.getByPrestationId(prestation.id, user);
        if (linkedDocs.length === 0) return null;

        return (
          <Card className="p-5 space-y-3 border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                <FileText className="h-4 w-4 text-violet-600" />
                <span>Documents & Fiches Techniques Associés ({linkedDocs.length})</span>
              </div>
              <Link href="/documents">
                <Badge variant="violet" size="sm">Espace Documents</Badge>
              </Link>
            </div>

            <div className="space-y-2">
              {linkedDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs"
                >
                  <div className="space-y-0.5 min-w-0 pr-2">
                    <span className="font-bold text-slate-900 truncate block">
                      📄 {doc.nom}
                    </span>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {doc.description || `Ajouté par ${doc.addedBy}`}
                    </span>
                  </div>

                  <a
                    href={doc.fileUrl}
                    download={doc.nom}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Download className="h-3.5 w-3.5" />}
                    >
                      Télécharger
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          </Card>
        );
      })()}
    </div>
  );
}

