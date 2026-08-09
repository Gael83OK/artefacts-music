/**
 * Barre de navigation inférieure
 * Pattern mobile-first, prête pour une future app native
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

  // Pick top items flagged for bottom tab
  const bottomTabs = NAVIGATION_ITEMS.filter((item) => item.isBottomTab);

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/90 bg-white/95 backdrop-blur-2xl safe-bottom shadow-lg"
      aria-label="Navigation mobile"
    >
      <div className="flex items-center justify-around px-1 py-1">
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
                "flex flex-col items-center justify-center gap-0.5 rounded-2xl px-2.5 py-1.5 transition-all duration-200 relative min-h-[48px] flex-1",
                isActive
                  ? "text-violet-600 font-bold bg-violet-50/70"
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
              <span className="text-[10px] tracking-tight font-medium">{item.label}</span>

              {isActive && (
                <span className="absolute top-0 h-1 w-6 bg-gradient-to-r from-violet-600 to-mediterranean-500 rounded-full shadow-sm" />
              )}
            </Link>
          );
        })}

        {/* 5th item: Menu drawer trigger */}
        <button
          onClick={onOpenMobileMenu}
          className="flex flex-col items-center justify-center gap-0.5 rounded-2xl px-2.5 py-1.5 text-slate-400 hover:text-slate-600 active:scale-95 transition-all min-h-[48px] flex-1"
        >
          <Menu className="h-5 w-5" />
          <span className="text-[10px] tracking-tight font-medium">Plus</span>
        </button>
      </div>
    </nav>
  );
}