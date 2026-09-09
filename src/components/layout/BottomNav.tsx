/**
 * BottomNav — Tab bar premium dark
 * Style: iOS 18 dark, pill violet chaud, glow doré sur actif
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
                "relative flex flex-col items-center justify-center gap-[3px] px-3 py-2 rounded-2xl transition-all duration-300 flex-1 select-none min-h-[52px] group"
              )}
              style={{ color: isActive ? "#A78BFA" : "var(--text-muted)" }}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Pill de fond violet chaud */}
              {isActive && (
                <span
                  className="absolute inset-0 mx-1.5 rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(139,109,250,0.16) 0%, rgba(240,98,146,0.09) 100%)",
                    border: "1px solid rgba(139,109,250,0.15)",
                    animation: "scaleIn 0.25s cubic-bezier(0.16,1,0.3,1)",
                  }}
                />
              )}

              {/* Icône avec glow violet si actif */}
              <span
                className="relative flex items-center justify-center w-7 h-7 rounded-xl transition-all duration-300"
                style={
                  isActive
                    ? { filter: "drop-shadow(0 0 8px rgba(167,139,250,0.6))" }
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
                className="text-[10px] font-bold tracking-tight transition-all duration-300 leading-none"
                style={{
                  color: isActive ? "#A78BFA" : "var(--text-muted)",
                  fontWeight: isActive ? 800 : 600,
                }}
              >
                {item.label}
              </span>

              {/* Indicateur ligne dégradée violet → rose → or */}
              {isActive && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-8 rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, #A78BFA, #F472B6, #FCD34D)",
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
          className="relative flex flex-col items-center justify-center gap-[3px] px-3 py-2 rounded-2xl transition-all duration-300 flex-1 min-h-[52px] select-none active:scale-90"
          style={{ color: "var(--text-muted)" }}
          aria-label="Ouvrir le menu"
        >
          <span className="flex items-center justify-center w-7 h-7">
            <MoreHorizontal className="h-[22px] w-[22px]" strokeWidth={1.8} />
          </span>
          <span className="text-[10px] font-bold tracking-tight leading-none">
            Plus
          </span>
        </button>
      </div>
    </nav>
  );
}