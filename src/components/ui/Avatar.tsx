import React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  name?: string;
  role?: string;
  size?: "sm" | "md" | "lg";
  status?: "online" | "offline" | "busy";
  className?: string;
  alt?: string;
}


export function Avatar({
  name = "Musiciens Artefacts",
  role,
  size = "md",
  status,
  className,
  alt,
}: AvatarProps) {

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  const statusColors = {
    online: "bg-emerald-500",
    offline: "bg-slate-300",
    busy: "bg-rose-500",
  };

  return (
    <div
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      aria-label={alt || `Photo de profil de ${name}`}
      role="img"
    >
      <div
        className={cn(
          "flex items-center justify-center font-semibold rounded-full bg-gradient-to-tr from-mediterranean-500 to-violet-500 text-white shadow-sm ring-2 ring-white",
          sizeClasses[size]
        )}
      >
        {initials}
      </div>


      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-white",
            statusColors[status]
          )}
        />
      )}
    </div>
  );
}
