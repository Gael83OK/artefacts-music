/**
 * Types TypeScript pour l'authentification, les rôles et les permissions (Prompt 003)
 */

export type GlobalRole = "musician" | "production" | "hybrid_production" | "super_admin";

export type ActiveSpace = "musician" | "production";

// Complete UserRole type supporting both official Prompt 003 roles and legacy aliases
export type UserRole =
  | GlobalRole
  | "administrateur"
  | "charge_production"
  | "responsable_prestation"
  | "super_admin";

export interface UserPermissions {
  canManageEvents: boolean;
  canManageEquipment: boolean;
  canManageUsers: boolean;
  canViewAllCalendars: boolean;
  canManageSetlists: boolean;
  canViewAdminDocs: boolean;
  canManageRehearsals?: boolean;
  canManageDocuments?: boolean;
  canManageIndisponibilites?: boolean;
  canManageSettings?: boolean;
  isSuperAdmin?: boolean;
}

export interface AuthUser {
  id: string;
  email?: string;
  prenom: string;
  nom: string;
  role: GlobalRole;
  instrument?: string;
  isFirstLogin: boolean;
  avatarUrl?: string;
  phone?: string;
  ville?: string;
  actif?: boolean;
  anniversaireIntermittenceDate?: string;
  createdAt?: string;
}


export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: GlobalRole | null;
  activeSpace: ActiveSpace;
}

export interface EventPermissionContext {
  id: string;
  responsableId?: string; // Musician ID assigned as gig lead for this specific event
  musicianIds?: string[]; // List of assigned musician IDs
}
