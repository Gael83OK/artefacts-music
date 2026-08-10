import React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  showShortcut?: boolean;
  className?: string;
}

export function SearchInput({
  placeholder = "Rechercher un événement, morceau, musicien...",
  showShortcut = true,
  className,
  ...props
}: SearchInputProps) {
  return (
    <div className={cn("relative flex items-center w-full", className)}>
      <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full h-10 min-h-[44px] pl-10 pr-12 text-xs sm:text-sm bg-slate-100/80 border border-slate-200/90 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-mediterranean-500/30 focus:border-mediterranean-500/80 focus:bg-white transition-all font-medium"
        {...props}
      />
      {showShortcut && (
        <div className="absolute right-3 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-white rounded-md border border-slate-200 shadow-xs pointer-events-none">
          <span>⌘</span>
          <span>K</span>
        </div>
      )}
    </div>
  );
}
