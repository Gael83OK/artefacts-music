import { BottomNav } from "@/components/layout/BottomNav";
import { BrandLogo } from "@/components/brand";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="mx-auto min-h-screen max-w-lg bg-offwhite">
      {/* Logo Artefacts */}
      <header className="flex justify-center px-5 pt-6">
        <BrandLogo size="md" priority />
      </header>

      {/* Contenu principal */}
      <main className="px-5 pb-28 pt-6 safe-top">
        {children}
      </main>

      {/* Navigation inférieure */}
      <BottomNav />
    </div>
  );
}