import { AuthUser, GlobalRole, UserPermissions } from "@/types/auth";

export const ROLE_DISPLAY_NAMES: Record<GlobalRole, string> = {
  super_admin: "Super-administrateur",
  hybrid_production: "Production + Musicien",
  production: "Production",
  musician: "Musicien",
};

export const ROLE_LABELS = ROLE_DISPLAY_NAMES;

export function getUserRoleLabel(user: AuthUser): string {
  if (user.role === "super_admin") {
    return "Super-administrateur";
  }
  if (user.role === "hybrid_production") {
    return "Production + Musicien";
  }
  if (user.role === "production") {
    return "Production";
  }
  if (user.role === "musician") {
    return "Musicien";
  }
  return "Membre Artefacts";
}

export const ROLE_PERMISSIONS: Record<GlobalRole, UserPermissions> = {
  super_admin: {
    canManageEvents: true,
    canManageEquipment: true,
    canManageUsers: true,
    canViewAllCalendars: true,
    canManageSetlists: true,
    canViewAdminDocs: true,
    canManageRehearsals: true,
    canManageDocuments: true,
    canManageIndisponibilites: true,
    canManageSettings: true,
    isSuperAdmin: true,
  },
  production: {
    canManageEvents: true,
    canManageEquipment: true,
    canManageUsers: true,
    canViewAllCalendars: true,
    canManageSetlists: true,
    canViewAdminDocs: true,
    canManageRehearsals: true,
    canManageDocuments: true,
    canManageIndisponibilites: true,
  },
  hybrid_production: {
    canManageEvents: true,
    canManageEquipment: true,
    canManageUsers: true,
    canViewAllCalendars: true,
    canManageSetlists: true,
    canViewAdminDocs: true,
    canManageRehearsals: true,
    canManageDocuments: true,
    canManageIndisponibilites: true,
  },
  musician: {
    canManageEvents: false,
    canManageEquipment: false,
    canManageUsers: false,
    canViewAllCalendars: false,
    canManageSetlists: false,
    canViewAdminDocs: false,
    canManageRehearsals: false,
    canManageDocuments: false,
    canManageIndisponibilites: false,
  },
};

export interface StoredUserAccount extends AuthUser {
  passwordHash?: string;
}

export const INITIAL_MOCK_USERS: StoredUserAccount[] = [
  {
    id: "mus-1",
    email: "Constantin.lounis@gmail.com",
    prenom: "Constantin",
    nom: "Lounis",
    role: "hybrid_production",
    instrument: "Batteur",
    isFirstLogin: false,
    phone: "06 16 71 21 73",
    ville: "Rognes",
    actif: true,
    passwordHash: "password123",
  },
  {
    id: "mus-2",
    prenom: "Théo",
    nom: "Lounis",
    role: "hybrid_production",
    instrument: "Guitariste",
    isFirstLogin: false,
    phone: "06 21 96 41 36",
    ville: "Cadenet",
    actif: true,
    passwordHash: "password123",
  },
  {
    id: "mus-3",
    prenom: "Atlantine",
    nom: "Boggio-Pasqua",
    role: "musician",
    instrument: "Chant",
    isFirstLogin: false,
    phone: "06 34 54 57 24",
    ville: "Cadenet",
    actif: true,
  },
  {
    id: "mus-4",
    prenom: "Joëlle",
    nom: "Raolina",
    role: "musician",
    instrument: "Chant",
    isFirstLogin: false,
    phone: "06 95 79 72 93",
    ville: "Bretagne",
    actif: true,
  },
  {
    id: "mus-5",
    email: "gaelberlinger@hotmail.com",
    prenom: "Gaël",
    nom: "Berlinger",
    role: "super_admin",
    instrument: "Piano",
    isFirstLogin: false,
    phone: "06 50 02 90 42",
    ville: "La Crau",
    actif: true,
    passwordHash: "password123",
  },
  {
    id: "mus-6",
    prenom: "Liam",
    nom: "Corallini",
    role: "musician",
    instrument: "Guitare",
    isFirstLogin: false,
    ville: "Nîmes",
    actif: true,
  },
  {
    id: "mus-7",
    prenom: "Ugo",
    nom: "Deschamps",
    role: "musician",
    instrument: "Batteur",
    isFirstLogin: false,
    phone: "06 51 83 73 99",
    ville: "Avignon",
    actif: true,
  },
  {
    id: "mus-8",
    prenom: "Julia",
    nom: "Lounis",
    role: "production",
    instrument: "Production",
    isFirstLogin: false,
    ville: "Rognes",
    actif: true,
  },
  {
    id: "mus-9",
    prenom: "Alexia",
    nom: "Mornet",
    role: "musician",
    instrument: "Chant",
    isFirstLogin: false,
    phone: "06 32 57 43 29",
    actif: true,
  },
  {
    id: "mus-10",
    prenom: "Sergio",
    nom: "Armanelli",
    role: "production",
    instrument: "Production",
    isFirstLogin: false,
    phone: "06 50 72 35 82",
    ville: "Avignon",
    actif: true,
  },
];
