/**
 * Barre de navigation inférieure
 * Pattern mobile-first moderne pour smartphone native
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_ITEMS } from "@/lib/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  onOpenMobileMenu?: () => void;
}

export function BottomNav({ onOpenMobileMenu }: BottomNavProps) {
  const pathname = usePathname();

  // Navigation vers les onglets principaux de bas de page
  const bottomTabs = NAVIGATION_ITEMS.filter((item) => item.isBottomTab);

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/90 bg-white/90 backdrop-blur-2xl safe-bottom shadow-[0_-4px_20px_0_rgba(15,23,42,0.06)]"
      aria-label="Navigation mobile"
    >
      <div className="flex items-center justify-around px-2 py-1.5">
        {bottomTabs.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 rounded-2xl px-2 py-1.5 transition-all duration-200 relative min-h-[50px] flex-1 select-none",
                isActive
                  ? "text-violet-600 font-extrabold bg-violet-50/80 shadow-xs"
                  : "text-slate-400 hover:text-slate-600 active:scale-95"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-transform duration-200",
                  isActive && "scale-110 text-violet-600"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-[10px] tracking-tight font-extrabold">{item.label}</span>

              {isActive && (
                <span className="absolute top-0.5 h-1 w-5 bg-gradient-to-r from-violet-600 to-mediterranean-500 rounded-full shadow-xs animate-fade-in" />
              )}
            </Link>
          );
        })}

        {/* 5ème déclencheur : Menu mobile latéral */}
        <button
          onClick={onOpenMobileMenu}
          className="flex flex-col items-center justify-center gap-0.5 rounded-2xl px-2 py-1.5 text-slate-400 hover:text-slate-600 active:scale-95 transition-all min-h-[50px] flex-1 select-none"
        >
          <Menu className="h-5 w-5" />
          <span className="text-[10px] tracking-tight font-extrabold">Plus</span>
        </button>
      </div>
    </nav>
  );
}