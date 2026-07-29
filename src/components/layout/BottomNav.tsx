/**
 * Barre de navigation inférieure
 * Pattern mobile-first, prête pour une future app native
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white/95 backdrop-blur-xl pb-2"
      aria-label="Navigation principale"
    >
      <div className="mx-auto flex max-w-lg items-center justify-between px-2 py-2">
        {navItems.map((item) => {
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
                "flex flex-1 flex-col items-center justify-center rounded-lg px-1 py-2 transition-colors duration-200",
                isActive
                  ? "text-mediterranean"
                  : "text-gray-400 hover:text-gray-600"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "h-5 w-5",
                  isActive && "stroke-[2.5]"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />

              <span className="mt-1 text-[10px] font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}