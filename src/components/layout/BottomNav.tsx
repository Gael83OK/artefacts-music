/**
 * BottomNav — Tab bar premium style iOS 18
 * Pill animée, icônes avec glow actif, effet verre dépoli profond
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_ITEMS } from "@/lib/navigation";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  onOpenMobileMenu?: () => void;
}

export function BottomNav({ onOpenMobileMenu }: BottomNavProps) {
  const pathname = usePathname();

  const bottomTabs = NAVIGATION_ITEMS.filter((item) => item.isBottomTab);

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-bottom-nav safe-bottom"
      aria-label="Navigation mobile"
    >
      <div className="flex items-center justify-around px-1 pt-2 pb-1">
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
                "relative flex flex-col items-center justify-center gap-[3px] px-3 py-2 rounded-2xl transition-all duration-300 flex-1 select-none min-h-[52px] group",
                isActive
                  ? "text-violet-600"
                  : "text-slate-400 hover:text-slate-600 active:scale-90"
              )}
              aria-current={isActive ? "page" : undefined}
              style={
                isActive
                  ? { WebkitTapHighlightColor: "transparent" }
                  : undefined
              }
            >
              {/* Pill de fond actif */}
              {isActive && (
                <span
                  className="absolute inset-0 mx-1.5 rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(122,90,248,0.12) 0%, rgba(56,189,248,0.08) 100%)",
                    animation: "scaleIn 0.25s cubic-bezier(0.16,1,0.3,1)",
                  }}
                />
              )}

              {/* Icône avec glow animé si actif */}
              <span
                className={cn(
                  "relative flex items-center justify-center w-7 h-7 rounded-xl transition-all duration-300",
                  isActive
                    ? "text-violet-600"
                    : "text-slate-400 group-hover:text-slate-600"
                )}
                style={
                  isActive
                    ? {
                        filter: "drop-shadow(0 0 6px rgba(122,90,248,0.4))",
                      }
                    : undefined
                }
              >
                <Icon
                  className={cn(
                    "h-[22px] w-[22px] transition-all duration-300",
                    isActive && "scale-110"
                  )}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
              </span>

              {/* Label */}
              <span
                className={cn(
                  "text-[10px] font-bold tracking-tight transition-all duration-300 leading-none",
                  isActive ? "text-violet-600 font-extrabold" : "text-slate-400"
                )}
              >
                {item.label}
              </span>

              {/* Indicateur ligne dégradée en haut */}
              {isActive && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-[2.5px] w-8 rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, #38BDF8, #7A5AF8, #EC4899)",
                    animation: "navIndicatorSlide 0.3s cubic-bezier(0.16,1,0.3,1)",
                  }}
                />
              )}
            </Link>
          );
        })}

        {/* Bouton Plus */}
        <button
          onClick={onOpenMobileMenu}
          className="relative flex flex-col items-center justify-center gap-[3px] px-3 py-2 rounded-2xl text-slate-400 hover:text-slate-600 active:scale-90 transition-all duration-300 flex-1 min-h-[52px] select-none"
          aria-label="Ouvrir le menu complet"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-xl">
            <MoreHorizontal
              className="h-[22px] w-[22px]"
              strokeWidth={1.8}
            />
          </span>
          <span className="text-[10px] font-bold tracking-tight leading-none">
            Plus
          </span>
        </button>
      </div>
    </nav>
  );
}