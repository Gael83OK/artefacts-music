"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { BrandLogo } from "@/components/brand";
import { NAVIGATION_ITEMS, CATEGORY_LABELS } from "@/lib/navigation";
import { NavCategory } from "@/types/navigation";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/context/AuthContext";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const categories: NavCategory[] = ["operations", "personal", "management"];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-white shadow-2xl flex flex-col z-50 animate-slide-up rounded-r-3xl overflow-hidden">
        {/* En-tête avec logo & bouton fermer */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <Link href="/" onClick={onClose} className="active:scale-95 transition-transform">
            <BrandLogo size="md" priority />
          </Link>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 active:scale-95 rounded-xl transition-all"
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Catégories & Liens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {categories.map((category) => {
            const items = NAVIGATION_ITEMS.filter(
              (item) => item.category === category
            );

            if (items.length === 0) return null;

            return (
              <div key={category} className="space-y-1">
                <div className="px-3 text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">
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
                      onClick={onClose}
                      className={`flex items-center justify-between px-3 py-2.5 text-xs font-extrabold rounded-2xl transition-all duration-150 active:scale-[0.98] ${
                        isActive
                          ? "bg-violet-50/90 text-violet-700 font-black shadow-xs"
                          : "text-slate-700 hover:bg-slate-100/80"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-1.5 rounded-xl transition-colors ${
                            isActive
                              ? "bg-violet-600 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <Badge
                          variant={item.badgeVariant || "mediterranean"}
                          size="sm"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Pied de page du menu avec le profil utilisateur */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80">
          <Link
            href="/profil"
            onClick={onClose}
            className="flex items-center gap-3 active:scale-95 transition-transform"
          >
            <Avatar name={user ? `${user.prenom} ${user.nom}` : "Musique"} size="md" status="online" />
            <div className="min-w-0">
              <div className="text-xs font-extrabold text-slate-900 truncate">
                {user ? `${user.prenom} ${user.nom}` : "Profil Musicien"}
              </div>
              <div className="text-[10px] text-slate-500 font-medium truncate">Voir mes réglages</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
