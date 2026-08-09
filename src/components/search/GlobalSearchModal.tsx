"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { searchService } from "@/lib/search-service";
import { GroupedSearchResults, SearchResultCategory, SearchResultItem } from "@/types/search";
import { Badge } from "@/components/ui/Badge";
import {
  Search,
  X,
  History,
  Trash2,
  Music,
  Calendar,
  Mic2,
  Users,
  FileText,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_LABELS: Record<SearchResultCategory, { label: string; icon: React.ReactNode; color: string }> = {
  morceau: { label: "MORCEAUX", icon: <Music className="h-3.5 w-3.5 text-slate-600" />, color: "bg-slate-100 text-slate-800" },
  prestation: { label: "PRESTATIONS", icon: <Calendar className="h-3.5 w-3.5 text-mediterranean-600" />, color: "bg-mediterranean-50 text-mediterranean-800" },
  repetition: { label: "RÉPÉTITIONS", icon: <Mic2 className="h-3.5 w-3.5 text-violet-600" />, color: "bg-violet-50 text-violet-800" },
  musician: { label: "MUSICIENS & ÉQUIPE", icon: <Users className="h-3.5 w-3.5 text-emerald-600" />, color: "bg-emerald-50 text-emerald-800" },
  document: { label: "DOCUMENTS", icon: <FileText className="h-3.5 w-3.5 text-rose-600" />, color: "bg-rose-50 text-rose-800" },
};

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GroupedSearchResults>({});
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const loadRecentHistory = React.useCallback(() => {
    if (user) {
      setRecentSearches(searchService.getRecentSearches(user.id));
    }
  }, [user]);

  useEffect(() => {
    if (isOpen) {
      loadRecentHistory();
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults({});
    }
  }, [isOpen, loadRecentHistory]);

  useEffect(() => {
    if (user && query.trim()) {
      const timer = setTimeout(() => {
        const res = searchService.search(query, user);
        setResults(res);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setResults({});
    }
  }, [query, user]);


  if (!isOpen) return null;

  const handleSelectResult = (item: SearchResultItem) => {
    if (user && query.trim()) {
      searchService.addRecentSearch(user.id, query.trim());
    }
    onClose();
    router.push(item.targetUrl);
  };

  const handleRunRecent = (term: string) => {
    setQuery(term);
  };

  const handleDeleteRecent = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    if (!user) return;
    searchService.removeRecentSearch(user.id, term);
    loadRecentHistory();
  };

  const handleClearHistory = () => {
    if (!user) return;
    searchService.clearRecentSearches(user.id);
    loadRecentHistory();
  };

  const categoryKeys = Object.keys(results) as SearchResultCategory[];
  const totalResultsCount = categoryKeys.reduce(
    (acc, cat) => acc + (results[cat]?.length || 0),
    0
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Recherche globale Artefacts Music"
    >
      {/* Overlay de fond flouté */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 z-50 overflow-hidden text-left flex flex-col max-h-[80vh]">

        {/* Champ de recherche principal */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <Search className="h-5 w-5 text-mediterranean-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher dans Artefacts Music..."
            className="flex-1 text-sm font-medium bg-transparent border-none focus:outline-none placeholder:text-slate-400"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-200/80 hover:bg-slate-300 text-slate-700 rounded-xl"
            >
              Fermer
            </button>
          )}
        </div>

        {/* Zone de contenu des résultats ou de l'historique */}
        <div className="p-4 overflow-y-auto space-y-5 flex-1">
          {/* CAS 1 :Champ vide -> Afficher l'historique des 5 dernières recherches */}
          {!query.trim() && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <History className="h-4 w-4 text-slate-400" />
                  <span>5 Dernières Recherches</span>
                </div>

                {recentSearches.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="text-[11px] font-semibold text-rose-500 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Effacer l&apos;historique</span>
                  </button>
                )}
              </div>

              {recentSearches.length === 0 ? (
                <div className="py-6 text-center space-y-1">
                  <p className="text-xs font-bold text-slate-700">Aucune recherche récente.</p>
                  <p className="text-[11px] text-slate-500">
                    Saisissez un nom de musicien, un titre de morceau ou un lieu de prestation.
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 pt-1">
                  {recentSearches.map((term) => (
                    <div
                      key={term}
                      onClick={() => handleRunRecent(term)}
                      className="group flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-mediterranean-50 text-slate-800 hover:text-mediterranean-800 rounded-xl text-xs font-medium cursor-pointer transition-colors border border-slate-200/70"
                    >
                      <Search className="h-3 w-3 text-slate-400 group-hover:text-mediterranean-600" />
                      <span>{term}</span>
                      <button
                        onClick={(e) => handleDeleteRecent(e, term)}
                        className="p-0.5 text-slate-400 hover:text-rose-600 rounded-md"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CAS 2 : Recherche saisie mais aucun résultat trouvé */}
          {query.trim() && totalResultsCount === 0 && (
            <div className="py-10 text-center space-y-2">
              <Sparkles className="h-8 w-8 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">
                Aucun résultat trouvé pour &quot;{query}&quot;
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Vérifiez l&apos;orthographe ou essayez avec un nom de ville, d&apos;artiste ou d&apos;événement.
              </p>
            </div>
          )}

          {/* CAS 3 : Résultats regroupés par catégories */}
          {query.trim() && totalResultsCount > 0 && (
            <div className="space-y-5">
              {categoryKeys.map((category) => {
                const items = results[category];
                if (!items || items.length === 0) return null;

                const catInfo = CATEGORY_LABELS[category];

                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
                      {catInfo.icon}
                      <span>{catInfo.label} ({items.length})</span>
                    </div>

                    <div className="space-y-1.5">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelectResult(item)}
                          className="flex items-center justify-between p-3 bg-slate-50 hover:bg-mediterranean-50/60 rounded-2xl border border-slate-200/80 cursor-pointer transition-all group"
                        >
                          <div className="space-y-0.5 min-w-0 pr-2">
                            <div className="text-xs font-bold text-slate-900 group-hover:text-mediterranean-900 truncate">
                              {item.title}
                            </div>
                            {item.subtitle && (
                              <div className="text-[11px] text-slate-500 truncate">
                                {item.subtitle}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {item.badge && (
                              <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${catInfo.color}`}>
                                {item.badge}
                              </span>
                            )}
                            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-mediterranean-600 transition-transform group-hover:translate-x-0.5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
