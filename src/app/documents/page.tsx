"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { documentService } from "@/lib/document-service";
import { CentralDocument, DocCategory } from "@/types/document";
import { DocumentFormModal } from "@/components/documents/DocumentFormModal";
import { PdfPreviewModal } from "@/components/documents/PdfPreviewModal";
import {
  FileText,
  Search,
  Plus,
  Download,
  Eye,
  Edit2,
  Trash2,
  Music,
  Calendar,
  Mic2,
  UserCheck,
  ArrowRight,
  Filter,
  ArrowUpDown,
  Sparkles,
} from "lucide-react";

type CategoryFilter = "all" | DocCategory;
type SortOption = "recent" | "oldest" | "alpha";

export default function DocumentsPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<CentralDocument[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [documentToEdit, setDocumentToEdit] = useState<CentralDocument | null>(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [documentToPreview, setDocumentToPreview] = useState<CentralDocument | null>(null);

  const loadDocuments = React.useCallback(() => {
    if (user) {
      setDocuments(documentService.getDocumentsForUser(user));
    }
  }, [user]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  if (!user) return null;

  const handleAdd = () => {
    setDocumentToEdit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (doc: CentralDocument) => {
    setDocumentToEdit(doc);
    setIsFormOpen(true);
  };

  const handlePreview = (doc: CentralDocument) => {
    setDocumentToPreview(doc);
    setIsPreviewOpen(true);
  };

  const handleDelete = (doc: CentralDocument) => {
    if (confirm(`Voulez-vous vraiment supprimer le document "${doc.nom}" ?`)) {
      documentService.deleteDocument(doc.id, user);
      loadDocuments();
    }
  };

  const handleSaveDocument = (data: Partial<CentralDocument>) => {
    if (documentToEdit) {
      documentService.updateMetadata(documentToEdit.id, data, user);
    } else {
      documentService.addDocument(data as any, user);
    }
    loadDocuments();
  };

  // Filtering & Sorting
  const filteredDocuments = documents.filter((doc) => {
    // Category filter
    if (activeCategory !== "all" && doc.categorie !== activeCategory) {
      return false;
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      const nom = doc.nom.toLowerCase();
      const cat = doc.categorie.toLowerCase();
      const desc = (doc.description || "").toLowerCase();
      const song = (doc.songTitle || "").toLowerCase();
      const prest = (doc.prestationTitle || "").toLowerCase();

      return (
        nom.includes(q) ||
        cat.includes(q) ||
        desc.includes(q) ||
        song.includes(q) ||
        prest.includes(q)
      );
    }

    return true;
  });

  // Sort
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.dateAjout).getTime() - new Date(a.dateAjout).getTime();
    }
    if (sortBy === "oldest") {
      return new Date(a.dateAjout).getTime() - new Date(b.dateAjout).getTime();
    }
    if (sortBy === "alpha") {
      return a.nom.localeCompare(b.nom);
    }
    return 0;
  });

  const getDocTypeIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5 text-rose-600 shrink-0" />;
      case "audio":
        return <Music className="h-5 w-5 text-violet-600 shrink-0" />;
      case "html":
        return <FileText className="h-5 w-5 text-mediterranean-600 shrink-0" />;
      default:
        return <FileText className="h-5 w-5 text-slate-500 shrink-0" />;
    }
  };

  const getCategoryBadgeVariant = (cat: DocCategory) => {
    switch (cat) {
      case "administratif":
        return "rose";
      case "musical":
        return "mediterranean";
      case "prestation":
        return "violet";
      case "repetition":
        return "warning";
      default:
        return "neutral";
    }
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6 max-w-4xl mx-auto">
        <PageHeader
          title="Documents"
          subtitle="Espace documentaire centralisé — Partitions, fiches techniques, contrats et supports de travail."
          badge={<Badge variant="mediterranean">Centre Documentaire Unique</Badge>}
          actions={
            <Button
              variant="mediterranean"
              size="sm"
              onClick={handleAdd}
              icon={<Plus className="h-4 w-4" />}
            >
              Ajouter un document
            </Button>
          }
        />

        {/* Barre de Recherche, Filtres de Catégories et Tri */}
        <div className="space-y-3 bg-slate-100/70 p-3.5 rounded-2xl border border-slate-200/80">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Onglets Filtres Catégories */}
            <div className="flex flex-wrap items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 w-full sm:w-auto overflow-x-auto">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeCategory === "all"
                    ? "bg-mediterranean-600 text-white shadow-sm font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Tous ({documents.length})
              </button>
              <button
                onClick={() => setActiveCategory("administratif")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeCategory === "administratif"
                    ? "bg-rose-500 text-white shadow-sm font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Administratif
              </button>
              <button
                onClick={() => setActiveCategory("musical")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeCategory === "musical"
                    ? "bg-mediterranean-600 text-white shadow-sm font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Musical
              </button>
              <button
                onClick={() => setActiveCategory("prestation")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeCategory === "prestation"
                    ? "bg-violet-600 text-white shadow-sm font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Prestations
              </button>
              <button
                onClick={() => setActiveCategory("repetition")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeCategory === "repetition"
                    ? "bg-amber-500 text-white shadow-sm font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Répétitions
              </button>
              <button
                onClick={() => setActiveCategory("autre")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeCategory === "autre"
                    ? "bg-slate-700 text-white shadow-sm font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Autres
              </button>
            </div>

            {/* Tri */}
            <div className="flex items-center gap-1.5 text-xs w-full sm:w-auto justify-end">
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-8 px-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-none"
              >
                <option value="recent">Plus récent</option>
                <option value="oldest">Plus ancien</option>
                <option value="alpha">Ordre alphabétique</option>
              </select>
            </div>
          </div>

          {/* Recherche */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom de document, catégorie, date ou élément lié..."
              className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mediterranean-500/30"
            />
          </div>
        </div>

        {/* Liste des Documents (Cartes réactives mobile-first) */}
        <div className="space-y-3">
          {sortedDocuments.length === 0 ? (
            /* ÉTATS VIDES EXIGÉS PAR LE PROMPT 017 SECTION 23 */
            <Card className="p-8 text-center border-dashed">
              <FileText className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-900">
                {search.trim()
                  ? "Aucun document ne correspond à votre recherche."
                  : activeCategory !== "all"
                  ? "Aucun document dans cette catégorie."
                  : "Aucun document disponible."}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {search.trim()
                  ? "Essayez d'autres mots-clés ou réinitialisez la recherche."
                  : "Ajoutez un document pour enrichir le système central."}
              </p>
            </Card>
          ) : (
            sortedDocuments.map((doc) => {
              const formattedDate = new Date(doc.dateAjout).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <Card
                  key={doc.id}
                  className="p-4 transition-all hover:border-slate-300 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="p-2.5 bg-slate-100 rounded-2xl shrink-0 mt-0.5">
                        {getDocTypeIcon(doc.type)}
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-extrabold text-slate-900 tracking-tight break-words max-w-full">
                            {doc.nom}
                          </h4>
                          <Badge variant={getCategoryBadgeVariant(doc.categorie)} size="sm">
                            {doc.categorie}
                          </Badge>
                        </div>

                        {doc.description && (
                          <p className="text-xs text-slate-600 leading-relaxed italic">
                            {doc.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-medium pt-0.5">
                          <span>📅 {formattedDate}</span>
                          {doc.taille && <span>💾 {doc.taille}</span>}
                          {doc.addedBy && <span>👤 Par {doc.addedBy}</span>}
                        </div>

                        {/* LIENS DE CONTEXTE TRANSVERSAUX (Morceau, Prestation, Répétition) */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {doc.songId && doc.songTitle && (
                            <Link href={`/espace-musical/${doc.songId}`}>
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-mediterranean-700 bg-mediterranean-50 hover:bg-mediterranean-100 px-2.5 py-0.5 rounded-lg transition-colors border border-mediterranean-200/60">
                                <Music className="h-3 w-3" />
                                <span>Morceau : {doc.songTitle}</span>
                              </span>
                            </Link>
                          )}

                          {doc.prestationId && doc.prestationTitle && (
                            <Link href={`/evenement/${doc.prestationId}`}>
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 px-2.5 py-0.5 rounded-lg transition-colors border border-violet-200/60">
                                <Calendar className="h-3 w-3" />
                                <span>Prestation : {doc.prestationTitle}</span>
                              </span>
                            </Link>
                          )}

                          {doc.repetitionId && doc.repetitionTitle && (
                            <Link href={`/repetitions/${doc.repetitionId}`}>
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-0.5 rounded-lg transition-colors border border-amber-200/60">
                                <Mic2 className="h-3 w-3" />
                                <span>Répétition : {doc.repetitionTitle}</span>
                              </span>
                            </Link>
                          )}

                          {doc.categorie === "administratif" && (
                            <Link href="/administratif">
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-0.5 rounded-lg transition-colors border border-rose-200/60">
                                <UserCheck className="h-3 w-3" />
                                <span>Espace Administratif</span>
                              </span>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions directes au bas du document */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2 text-xs">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview(doc)}
                      icon={<Eye className="h-3.5 w-3.5 text-slate-600" />}
                    >
                      Aperçu
                    </Button>

                    <a
                      href={doc.fileUrl}
                      download={doc.nom}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="mediterranean"
                        size="sm"
                        icon={<Download className="h-3.5 w-3.5" />}
                      >
                        Télécharger
                      </Button>
                    </a>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(doc)}
                      icon={<Edit2 className="h-3.5 w-3.5 text-slate-500" />}
                    >
                      Métadonnées
                    </Button>

                    <button
                      onClick={() => handleDelete(doc)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Supprimer le document"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Modal Formulaire (Ajout / Édition) */}
        <DocumentFormModal
          isOpen={isFormOpen}
          documentToEdit={documentToEdit}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveDocument}
        />

        {/* Modal Aperçu PDF */}
        <PdfPreviewModal
          isOpen={isPreviewOpen}
          document={documentToPreview}
          onClose={() => setIsPreviewOpen(false)}
        />
      </div>
    </ProtectedRoute>
  );
}
