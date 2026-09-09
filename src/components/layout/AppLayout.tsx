"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { MobileDrawer } from "@/components/layout/MobileDrawer";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen antialiased relative" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      {/* Halo ambiant premium dark — fixe, non interactif */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 85% 55% at 50% -5%, rgba(107,76,230,0.18) 0%, transparent 60%), " +
            "radial-gradient(ellipse 50% 40% at 92% 40%, rgba(139,109,250,0.09) 0%, transparent 55%), " +
            "radial-gradient(ellipse 50% 35% at 6%  82%, rgba(240,98,146,0.08) 0%, transparent 55%)",
        }}
      />

      {/* Sidebar desktop */}
      <Sidebar />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10">
        <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-5 md:py-8 pb-28 md:pb-10 max-w-4xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Drawer menu mobile */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Tab bar mobile */}
      <BottomNav onOpenMobileMenu={() => setMobileMenuOpen(true)} />
    </div>
  );
}