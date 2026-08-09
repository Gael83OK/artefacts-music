"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { EventPermissionContext } from "@/types/auth";

interface PermissionGuardProps {
  action: "edit_event" | "edit_setlist" | "manage_rehearsals" | "manage_materials" | "import_ireal";
  event?: EventPermissionContext | null;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({
  action,
  event,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const auth = useAuth();

  let hasAccess = false;

  switch (action) {
    case "edit_event":
      hasAccess = auth.canEditEvent(event);
      break;
    case "edit_setlist":
      hasAccess = auth.canEditSetlist(event);
      break;
    case "manage_rehearsals":
      hasAccess = auth.canManageRehearsals();
      break;
    case "manage_materials":
      hasAccess = auth.canManageMaterials(event);
      break;
    case "import_ireal":
      hasAccess = auth.canImportIreal(event);
      break;
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
