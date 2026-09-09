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
    <div className="flex min-h-screen text-slate-900 antialiased relative">
      {/* Halo ambiant fixe en arrière-plan */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(120,90,248,0.07) 0%, transparent 60%), radial-gradient(ellipse 50% 35% at 90% 50%, rgba(56,189,248,0.05) 0%, transparent 55%), radial-gradient(ellipse 45% 30% at 5% 80%, rgba(244,114,182,0.04) 0%, transparent 50%)",
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