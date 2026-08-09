"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { BrandLogo } from "@/components/brand";
import { NAVIGATION_ITEMS, CATEGORY_LABELS } from "@/lib/navigation";
import { NavCategory } from "@/types/navigation";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const categories: NavCategory[] = ["operations", "personal", "management"];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-white shadow-2xl flex flex-col z-50">
        {/* Header with logo & close button */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <Link href="/" onClick={onClose}>
            <BrandLogo size="md" priority />
          </Link>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Categories & Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {categories.map((category) => {
            const items = NAVIGATION_ITEMS.filter(
              (item) => item.category === category
            );

            if (items.length === 0) return null;

            return (
              <div key={category} className="space-y-1">
                <div className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  {CATEGORY_LABELS[category]}
                </div>

                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                        isActive
                          ? "bg-mediterranean-50 text-mediterranean-700 font-semibold"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`h-4 w-4 ${
                            isActive
                              ? "text-mediterranean-600"
                              : "text-slate-400"
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <Badge
                          variant={item.badgeVariant || "mediterranean"}
                          size="sm"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* User profile footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <Link
            href="/profil"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <Avatar size="md" status="online" />
            <div>
              <div className="text-sm font-semibold text-slate-900">
                Musician Profile
              </div>
              <div className="text-xs text-slate-500">Voir mes réglages</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
