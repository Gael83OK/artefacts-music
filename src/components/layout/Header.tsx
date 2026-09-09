"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, LogOut } from "lucide-react";
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const currentItem = NAVIGATION_ITEMS.find((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
  );
  const title = currentItem?.label || "Artefacts Music";

  return (
    <>
      <header
        className="sticky top-0 z-20 px-4 sm:px-5 flex items-center justify-between h-14 transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(255,255,255,0.90)"
            : "rgba(255,255,255,0.70)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderBottom: scrolled
            ? "1px solid rgba(15,23,42,0.06)"
            : "1px solid rgba(255,255,255,0.4)",
          boxShadow: scrolled
            ? "0 1px 0 rgba(15,23,42,0.04), 0 4px 20px rgba(15,23,42,0.05)"
            : "none",
        }}
      >
        {/* Mobile: Logo Artefacts */}
        <div className="flex items-center gap-2.5 md:hidden">
          <Link href="/" className="active:scale-95 transition-transform">
            <BrandLogo size="sm" priority />
          </Link>
        </div>

        {/* Desktop: Titre de la page */}
        <div className="hidden md:flex items-center gap-3">
          <h1 className="text-sm font-bold text-slate-800 tracking-tight">{title}</h1>
        </div>

        {/* Actions droite */}
        <div className="flex items-center gap-1.5">
          {/* Recherche */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 active:scale-95"
            style={{
              background: "rgba(241,245,249,0.8)",
              border: "1px solid rgba(255,255,255,0.6)",
            }}
            aria-label="Rechercher dans Artefacts Music"
          >
            <Search className="h-[17px] w-[17px] text-slate-500" />
            <span className="hidden sm:inline text-xs font-medium text-slate-500">
              Rechercher…
            </span>
          </button>

          <SpaceSwitcher />

          {/* Notifications */}
          <Link
            href="/notifications"
            className="relative h-9 w-9 flex items-center justify-center rounded-full transition-all duration-200 active:scale-95"
            style={{
              background: "rgba(241,245,249,0.8)",
              border: "1px solid rgba(255,255,255,0.6)",
            }}
            aria-label="Consulter les notifications"
          >
            <Bell className="h-[17px] w-[17px] text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white shadow-sm">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-60" />
                <span className="relative z-10">{unreadCount}</span>
              </span>
            )}
          </Link>

          {/* Avatar / Profil */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-1">
              <Link
                href="/profil"
                className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full transition-all duration-200 active:scale-95"
                style={{
                  background: "rgba(241,245,249,0.8)",
                  border: "1px solid rgba(255,255,255,0.6)",
                }}
                aria-label={`Accéder au profil de ${user.prenom} ${user.nom}`}
              >
                <Avatar
                  name={`${user.prenom} ${user.nom}`}
                  size="sm"
                  status="online"
                />
                <span className="text-xs font-semibold text-slate-700 hidden sm:inline">
                  {user.prenom}
                </span>
              </Link>

              <button
                onClick={logout}
                className="h-9 w-9 flex items-center justify-center rounded-full text-slate-400 hover:text-rose-500 transition-all duration-200 active:scale-95"
                aria-label="Se déconnecter"
                title="Se déconnecter"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/"
              className="text-xs font-semibold text-violet-600 px-3 py-2 rounded-full transition-all duration-200 active:scale-95"
              style={{
                background: "rgba(122,90,248,0.08)",
                border: "1px solid rgba(122,90,248,0.15)",
              }}
            >
              Se connecter
            </Link>
          )}
        </div>
      </header>

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
