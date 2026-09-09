"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand";
import { NAVIGATION_ITEMS, CATEGORY_LABELS } from "@/lib/navigation";
import { NavCategory } from "@/types/navigation";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { SearchInput } from "@/components/ui/SearchInput";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABELS } from "@/lib/mock-users";
import { Sparkles, ChevronRight, UserCheck } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();

  const categories: NavCategory[] = ["operations", "personal", "management"];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-200/70 bg-white/80 backdrop-blur-2xl h-screen sticky top-0 shrink-0 select-none z-30 shadow-[1px_0_10px_0_rgba(15,23,42,0.02)]">
      {/* Header avec Logo */}
      <div className="px-5 pt-6 pb-4">
        <Link href="/" className="inline-block hover:opacity-90 transition-all hover:scale-[1.01] active:scale-[0.99]">
          <BrandLogo size="md" priority />
        </Link>
      </div>

      {/* Barre de recherche rapide style Linear */}
      <div className="px-4 mb-4">
        <SearchInput placeholder="Recherche (⌘K)..." showShortcut />
      </div>

      {/* Liste des liens de navigation par catégorie */}
      <div className="flex-1 overflow-y-auto px-3 space-y-6 scrollbar-thin">
        {categories.map((category) => {
          const items = NAVIGATION_ITEMS.filter(
            (item) => item.category === category
          );

          if (items.length === 0) return null;

          return (
            <div key={category} className="space-y-1">
              <div className="px-3 text-[11px] font-bold text-slate-400/90 uppercase tracking-widest mb-2.5">
                {CATEGORY_LABELS[category]}
              </div>

              {items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`group relative flex items-center justify-between px-3 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-mediterranean-500/10 via-mediterranean-500/5 to-transparent text-mediterranean-700 font-extrabold shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                          isActive
                            ? "text-mediterranean-600 drop-shadow-sm"
                            : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <Badge
                        variant={item.badgeVariant || "mediterranean"}
                        size="sm"
                        pulse={isActive}
                      >
                        {item.badge}
                      </Badge>
                    )}

                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-gradient-to-b from-mediterranean-400 to-mediterranean-600 rounded-r-full shadow-glow" />
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Profil rapide en bas de sidebar */}
      <div className="p-3 m-3 bg-gradient-to-b from-slate-50/90 to-slate-100/70 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:border-slate-300 hover:shadow-card transition-all cursor-pointer group">
        {isAuthenticated && user ? (
          <Link href="/profil" className="flex items-center gap-3 min-w-0 flex-1">
            <Avatar
              name={`${user.prenom} ${user.nom}`}
              size="sm"
              status="online"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-800 truncate">
                {user.prenom} {user.nom}
              </div>
              <div className="text-[11px] text-slate-500 truncate flex items-center gap-1 font-medium">
                <Sparkles className="h-3 w-3 text-amber-500 shrink-0 animate-pulse" />
                <span>{ROLE_LABELS[user.role]}</span>
              </div>
            </div>
          </Link>
        ) : (
          <Link href="/" className="flex items-center gap-3 min-w-0 flex-1">
            <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center">
              <UserCheck className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-slate-800 truncate">
                Non connecté
              </div>
              <div className="text-[11px] text-mediterranean-600 font-medium truncate">
                Choisir un profil
              </div>
            </div>
          </Link>
        )}
        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
      </div>
    </aside>
  );
}

