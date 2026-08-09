"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { prestationService } from "@/lib/prestation-service";
import { Prestation } from "@/types/prestation";
import { AuthUser } from "@/types/auth";
import { PrestationDetailCard } from "@/components/prestations/PrestationDetailCard";
import { PrestationFormModal } from "@/components/prestations/PrestationFormModal";
import { DeleteConfirmModal } from "@/components/prestations/DeleteConfirmModal";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { AccessDeniedCard } from "@/components/ui/AccessDeniedCard";
import { ArrowLeft, Calendar, Plus } from "lucide-react";


interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PrestationDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user, canEditEvent } = useAuth();

  const [prestation, setPrestation] = useState<Prestation | null>(null);
  const [musicians, setMusicians] = useState<AuthUser[]>([]);
  const [responsable, setResponsable] = useState<AuthUser | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    const data = prestationService.getById(id);
    if (data) {
      setPrestation(data);
      setMusicians(prestationService.getMusiciansForPrestation(id));
      setResponsable(prestationService.getResponsableForPrestation(id));
    }
  }, [id]);

  const handleSave = (updatedData: Omit<Prestation, "id" | "updatedAt">) => {
    if (!prestation) return;
    const updated = prestationService.update(
      prestation.id,
      updatedData,
      user ? `${user.prenom} ${user.nom}` : "Production"
    );
    if (updated) {
      setPrestation(updated);
      setMusicians(prestationService.getMusiciansForPrestation(id));
      setResponsable(prestationService.getResponsableForPrestation(id));
    }
  };

  const handleDelete = () => {
    if (!prestation) return;
    prestationService.delete(prestation.id);
    router.push("/calendrier");
  };

  const handleArchive = () => {
    if (!prestation) return;
    const archived = prestationService.archive(
      prestation.id,
      user ? `${user.prenom} ${user.nom}` : "Production"
    );
    if (archived) {
      setPrestation(archived);
    }
    setIsDeleteOpen(false);
  };

  if (!prestation) {
    return (
      <div className="space-y-6 text-center py-12">
        <h2 className="text-xl font-bold text-slate-900">Prestation introuvable</h2>
        <p className="text-xs text-slate-500">
          Cette prestation n&apos;existe pas ou a été supprimée.
        </p>
        <Link href="/calendrier">
          <Button variant="mediterranean" icon={<ArrowLeft className="h-4 w-4" />}>
            Retour au calendrier
          </Button>
        </Link>
      </div>
    );
  }

  // Contrôle strict des autorisations côté serveur/service (Prompt 021)
  const isProduction = user?.role === "production" || user?.role === "hybrid_production";
  const isParticipant = user && prestation.musicianIds.includes(user.id);

  if (user && !isProduction && !isParticipant) {
    return <AccessDeniedCard />;
  }



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/calendrier">
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowLeft className="h-4 w-4" />}
          >
            Retour aux prestations
          </Button>
        </Link>

        {canEditEvent(prestation) && (
          <Button
            variant="mediterranean"
            size="sm"
            onClick={() => setIsEditOpen(true)}
            icon={<Plus className="h-4 w-4" />}
          >
            Modifier la fiche
          </Button>
        )}
      </div>

      {/* Fiche de détail principale ordonnée */}
      <PrestationDetailCard
        prestation={prestation}
        musicians={musicians}
        responsable={responsable}
        onEdit={() => setIsEditOpen(true)}
        onDelete={() => setIsDeleteOpen(true)}
      />

      {/* Formulaire Modal d'édition */}
      <PrestationFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSave}
        initialData={prestation}
      />

      {/* Modal de suppression sécurisée */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        prestationTitle={prestation.titre}
        onClose={() => setIsDeleteOpen(false)}
        onConfirmDelete={handleDelete}
        onConfirmArchive={handleArchive}
      />
    </div>
  );
}