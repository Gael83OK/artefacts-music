import { BottomNav } from "@/components/layout/BottomNav";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="mx-auto min-h-screen max-w-lg bg-offwhite">
      {/* Contenu principal */}
      <main className="px-5 pt-6 pb-16 safe-top">
        {children}
      </main>

      {/* Navigation inférieure */}
      <BottomNav />
    </div>
  );
}