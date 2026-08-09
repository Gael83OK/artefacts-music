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
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-200/80 bg-white/90 backdrop-blur-xl h-screen sticky top-0 shrink-0 select-none z-30">
      {/* Header avec Logo */}
      <div className="px-5 pt-6 pb-4">
        <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
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
              <div className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
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
                    className={`group relative flex items-center justify-between px-3 py-2 text-sm font-medium rounded-xl transition-all duration-150 ${
                      isActive
                        ? "bg-mediterranean-50 text-mediterranean-700 shadow-sm font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          isActive
                            ? "text-mediterranean-600"
                            : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <Badge
                        variant={item.badgeVariant || "mediterranean"}
                        size="sm"
                      >
                        {item.badge}
                      </Badge>
                    )}

                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 bg-mediterranean-500 rounded-r-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Profil rapide en bas de sidebar */}
      <div className="p-3 m-3 bg-slate-50/80 rounded-2xl border border-slate-200/70 flex items-center justify-between hover:bg-slate-100/80 transition-colors cursor-pointer group">
        {isAuthenticated && user ? (
          <Link href="/profil" className="flex items-center gap-3 min-w-0 flex-1">
            <Avatar
              name={`${user.prenom} ${user.nom}`}
              size="sm"
              status="online"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-slate-800 truncate">
                {user.prenom} {user.nom}
              </div>
              <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-500 shrink-0" />
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
        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 shrink-0" />
      </div>
    </aside>
  );
}

