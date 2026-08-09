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
        className="w-full h-10 pl-10 pr-12 text-sm bg-slate-100/70 border border-slate-200/80 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-mediterranean-500/30 focus:border-mediterranean-500/80 focus:bg-white transition-all"
        {...props}
      />
      {showShortcut && (
        <div className="absolute right-3 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-slate-200/60 rounded border border-slate-300/40 pointer-events-none">
          <span>⌘</span>
          <span>K</span>
        </div>
      )}
    </div>
  );
}
