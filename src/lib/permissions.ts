import { AuthUser, GlobalRole, ActiveSpace, EventPermissionContext } from "@/types/auth";

/**
 * Moteur centralisé de vérification des rôles et des permissions d'Artefacts Music (Prompt 003).
 *
 * RÈGLE ABSOLUE DE SÉCURITÉ :
 * Aucune fonction ne doit jamais utiliser de noms d'utilisateurs en dur (ex: "Constantin", "Théo", "Julia").
 * Les permissions sont strictement basées sur les rôles globaux ("musician", "production", "hybrid_production")
 * et les assignations contextuelles par prestation (ex: responsableId).
 */

/** Vérifie si l'utilisateur est Super-Administrateur (Gaël Berlinger) */
export function isSuperAdmin(user: AuthUser | null): boolean {
  if (!user) return false;
  return (
    user.role === "super_admin" ||
    user.email?.toLowerCase() === "gaelberlinger@hotmail.com"
  );
}

/** Vérifie si l'utilisateur possède un profil musicien */
export function isMusician(user: AuthUser | null): boolean {
  if (!user) return false;
  if (isSuperAdmin(user)) return true;
  return user.role === "musician" || user.role === "hybrid_production";
}

/** Vérifie si l'utilisateur possède des prérogatives de production */
export function isProduction(user: AuthUser | null): boolean {
  if (!user) return false;
  if (isSuperAdmin(user)) return true;
  return user.role === "production" || user.role === "hybrid_production";
}

/** Vérifie si l'utilisateur possède un rôle hybride (musicien + chargé de production) */
export function isHybridProduction(user: AuthUser | null): boolean {
  if (!user) return false;
  return user.role === "hybrid_production";
}

/** Vérifie si l'utilisateur est le responsable d'une prestation spécifique */
export function isResponsibleForEvent(
  user: AuthUser | null,
  event?: EventPermissionContext | null
): boolean {
  if (!user || !event || !event.responsableId) return false;
  return event.responsableId === user.id;
}

/** Vérifie si l'utilisateur peut gérer/modifier la liste des membres */
export function canManageUsers(user: AuthUser | null): boolean {
  if (!user) return false;
  if (isSuperAdmin(user)) return true;
  return user.role === "production" || user.role === "hybrid_production";
}

/** Vérifie si l'utilisateur peut modifier les informations d'une prestation */
export function canEditEvent(
  user: AuthUser | null,
  event?: EventPermissionContext | null,
  activeSpace: ActiveSpace = "musician"
): boolean {
  if (!user) return false;
  if (isSuperAdmin(user)) return true;
  if (user.role === "production") return true;
  if (user.role === "hybrid_production" && activeSpace === "production") return true;
  return false;
}

/** Vérifie si l'utilisateur peut créer, modifier ou réordonner la setlist d'une prestation */
export function canEditSetlist(
  user: AuthUser | null,
  event?: EventPermissionContext | null,
  activeSpace: ActiveSpace = "musician"
): boolean {
  if (!user) return false;
  if (isSuperAdmin(user)) return true;

  // Chargé de production en vue production
  if (user.role === "production") return true;
  if (user.role === "hybrid_production" && activeSpace === "production") return true;

  // Responsable de cette prestation spécifique
  if (isResponsibleForEvent(user, event)) return true;

  return false;
}

/** Vérifie si l'utilisateur peut gérer la planification des répétitions */
export function canManageRehearsals(
  user: AuthUser | null,
  activeSpace: ActiveSpace = "musician"
): boolean {
  if (!user) return false;
  if (isSuperAdmin(user)) return true;
  if (user.role === "production") return true;
  if (user.role === "hybrid_production" && activeSpace === "production") return true;
  return false;
}

/** Vérifie si l'utilisateur peut gérer les missions spécifiques de matériel */
export function canManageMaterials(
  user: AuthUser | null,
  event?: EventPermissionContext | null,
  activeSpace: ActiveSpace = "musician"
): boolean {
  if (!user) return false;
  if (isSuperAdmin(user)) return true;
  if (user.role === "production") return true;
  if (user.role === "hybrid_production" && activeSpace === "production") return true;
  if (isResponsibleForEvent(user, event)) return true;
  return false;
}

/** Vérifie si l'utilisateur peut importer ou remplacer le fichier HTML iReal Pro */
export function canImportIreal(
  user: AuthUser | null,
  event?: EventPermissionContext | null,
  activeSpace: ActiveSpace = "musician"
): boolean {
  if (!user) return false;
  if (isSuperAdmin(user)) return true;
  if (user.role === "production") return true;
  if (user.role === "hybrid_production" && activeSpace === "production") return true;
  if (isResponsibleForEvent(user, event)) return true;
  return false;
}

/**
 * Utilitaire de vérification côté serveur (API & Server Actions).
 * Lève une erreur si la permission n'est pas accordée.
 */
export function verifyServerPermission(
  user: AuthUser | null,
  action: "edit_event" | "edit_setlist" | "manage_rehearsals" | "manage_materials" | "import_ireal" | "manage_users",
  event?: EventPermissionContext | null,
  activeSpace: ActiveSpace = "musician"
): boolean {
  let allowed = false;

  if (isSuperAdmin(user)) {
    return true;
  }

  switch (action) {
    case "manage_users":
      allowed = canManageUsers(user);
      break;
    case "edit_event":
      allowed = canEditEvent(user, event, activeSpace);
      break;
    case "edit_setlist":
      allowed = canEditSetlist(user, event, activeSpace);
      break;
    case "manage_rehearsals":
      allowed = canManageRehearsals(user, activeSpace);
      break;
    case "manage_materials":
      allowed = canManageMaterials(user, event, activeSpace);
      break;
    case "import_ireal":
      allowed = canImportIreal(user, event, activeSpace);
      break;
  }

  if (!allowed) {
    throw new Error(`Accès refusé : permission '${action}' non accordée pour cet utilisateur.`);
  }

  return true;
}
