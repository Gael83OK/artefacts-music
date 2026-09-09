"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, Menu, LogOut } from "lucide-react";
import { NAVIGATION_ITEMS } from "@/lib/navigation";
import { BrandLogo } from "@/components/brand";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/context/AuthContext";
import { SpaceSwitcher } from "@/components/auth/SpaceSwitcher";
import { notificationService } from "@/lib/notification-service";
import { GlobalSearchModal } from "@/components/search/GlobalSearchModal";

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export function Header({ onOpenMobileMenu }: HeaderProps) {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const unreadCount = user ? notificationService.getUnreadCount(user.id) : 0;
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Titre basé sur la route
  const currentItem = NAVIGATION_ITEMS.find((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
  );

  const title = currentItem?.label || "Artefacts Music";

  const todayFormatted = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <header className="sticky top-0 z-20 glass-nav px-4 sm:px-6 py-3 flex items-center justify-between transition-all duration-200">
      {/* Mobile gauche: Menu trigger & Logo */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 active:scale-95 rounded-xl transition-all"
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/" className="active:scale-95 transition-transform">
          <BrandLogo size="sm" priority />
        </Link>
      </div>

      {/* Desktop gauche: Titre de la page et date */}
      <div className="hidden md:flex items-center gap-3">
        <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
          {title}
        </h1>
        <span className="text-slate-300">|</span>
        <span className="text-xs text-slate-500 font-medium capitalize">{todayFormatted}</span>
      </div>

      {/* Actions droite: Recherche, Switcher d'espace, Notifications & Profil */}
      <div className="flex items-center gap-2">
        {/* Déclencheur de la recherche globale */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100/90 hover:bg-slate-200/90 active:scale-95 text-slate-600 hover:text-slate-900 rounded-full transition-all text-xs font-semibold focus-visible:ring-2 focus-visible:ring-mediterranean-500"
          title="Rechercher dans Artefacts Music..."
          aria-label="Rechercher dans Artefacts Music"
        >
          <Search className="h-4 w-4 text-mediterranean-600" aria-hidden="true" />
          <span className="hidden sm:inline">Rechercher...</span>
        </button>

        <SpaceSwitcher />

        <Link
          href="/notifications"
          className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100/90 active:scale-95 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-mediterranean-500"
          title="Notifications"
          aria-label="Consulter les notifications"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white shadow-glow">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative">{unreadCount}</span>
            </span>
          )}
        </Link>

        {isAuthenticated && user ? (
          <div className="flex items-center gap-1.5">
            <Link
              href="/profil"
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 bg-slate-100/80 hover:bg-slate-200/80 active:scale-95 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-mediterranean-500"
              aria-label={`Accéder au profil de ${user.prenom} ${user.nom}`}
            >
              <Avatar
                name={`${user.prenom} ${user.nom}`}
                size="sm"
                status="online"
              />
              <span className="text-xs font-extrabold text-slate-800 hidden sm:inline">
                {user.prenom}
              </span>
            </Link>

            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 active:scale-95 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-rose-500"
              title="Se déconnecter"
              aria-label="Se déconnecter"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <Link
            href="/"
            className="text-xs font-extrabold text-mediterranean-600 hover:text-mediterranean-700 bg-mediterranean-50 px-3 py-1.5 rounded-full transition-colors"
          >
            Se connecter
          </Link>
        )}

        {/* Modal de Recherche Globale */}
        <GlobalSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
      </div>
    </header>
  );
}
