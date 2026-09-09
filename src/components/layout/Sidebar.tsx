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
    <aside
      className="hidden md:flex flex-col w-64 h-screen sticky top-0 shrink-0 select-none z-30"
      style={{
        background: "rgba(14, 12, 26, 0.96)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "2px 0 24px rgba(0,0,0,0.3)",
      }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <Link href="/" className="inline-block hover:opacity-90 transition-all active:scale-[0.99]">
          <BrandLogo size="md" priority />
        </Link>
      </div>

      {/* Recherche */}
      <div className="px-4 mb-4">
        <SearchInput placeholder="Recherche (⌘K)..." showShortcut />
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 space-y-6">
        {categories.map((category) => {
          const items = NAVIGATION_ITEMS.filter((item) => item.category === category);
          if (items.length === 0) return null;

          return (
            <div key={category} className="space-y-1">
              <div
                className="px-3 text-[10px] font-black uppercase tracking-widest mb-2.5"
                style={{ color: "var(--text-muted)" }}
              >
                {CATEGORY_LABELS[category]}
              </div>

              {items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="group relative flex items-center justify-between px-3 py-2 text-sm font-semibold rounded-xl transition-all duration-200"
                    style={{
                      background: isActive
                        ? "linear-gradient(135deg, rgba(139,109,250,0.18) 0%, rgba(139,109,250,0.06) 100%)"
                        : "transparent",
                      color: isActive ? "#A78BFA" : "var(--text-secondary)",
                      fontWeight: isActive ? 700 : 500,
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className="h-4 w-4 shrink-0 transition-all duration-200 group-hover:scale-110"
                        style={{
                          color: isActive ? "#A78BFA" : "var(--text-muted)",
                          filter: isActive ? "drop-shadow(0 0 5px rgba(167,139,250,0.5))" : "none",
                        }}
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

                    {/* Indicateur gauche violet */}
                    {isActive && (
                      <span
                        className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full"
                        style={{
                          background: "linear-gradient(180deg, #A78BFA, #F472B6)",
                          boxShadow: "0 0 8px rgba(167,139,250,0.5)",
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Profil bas */}
      <div
        className="m-3 p-3 rounded-2xl flex items-center justify-between group cursor-pointer transition-all duration-200"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {isAuthenticated && user ? (
          <Link href="/profil" className="flex items-center gap-3 min-w-0 flex-1">
            <Avatar
              name={`${user.prenom} ${user.nom}`}
              size="sm"
              status="online"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold truncate" style={{ color: "var(--text-primary)" }}>
                {user.prenom} {user.nom}
              </div>
              <div className="text-[11px] truncate flex items-center gap-1 font-medium mt-0.5" style={{ color: "var(--text-muted)" }}>
                <Sparkles className="h-3 w-3 text-amber-400 shrink-0" />
                <span>{ROLE_LABELS[user.role]}</span>
              </div>
            </div>
          </Link>
        ) : (
          <Link href="/" className="flex items-center gap-3 min-w-0 flex-1">
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <UserCheck className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold truncate" style={{ color: "var(--text-secondary)" }}>Non connecté</div>
              <div className="text-[11px] font-medium truncate" style={{ color: "#A78BFA" }}>Choisir un profil</div>
            </div>
          </Link>
        )}
        <ChevronRight
          className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5"
          style={{ color: "var(--text-muted)" }}
        />
      </div>
    </aside>
  );
}
