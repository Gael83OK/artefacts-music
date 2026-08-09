"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthUser, GlobalRole, ActiveSpace, EventPermissionContext, UserPermissions } from "@/types/auth";
import { authService } from "@/lib/auth-service";
import { ROLE_PERMISSIONS } from "@/lib/mock-users";
import * as perm from "@/lib/permissions";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: GlobalRole | null;
  activeSpace: ActiveSpace;
  setActiveSpace: (space: ActiveSpace) => void;
  switchSpace: () => void;
  permissions: UserPermissions | null;

  // Actions d'authentification
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  firstTimeSetup: (userId: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (email: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;

  // Fonctions de vérification des permissions (Prompt 003 & 031)
  isMusician: boolean;
  isProduction: boolean;
  isHybridProduction: boolean;
  isSuperAdmin: boolean;
  canManageUsers: boolean;
  isResponsibleForEvent: (event?: EventPermissionContext | null) => boolean;
  canEditEvent: (event?: EventPermissionContext | null) => boolean;
  canEditSetlist: (event?: EventPermissionContext | null) => boolean;
  canManageRehearsals: () => boolean;
  canManageMaterials: (event?: EventPermissionContext | null) => boolean;
  canImportIreal: (event?: EventPermissionContext | null) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [activeSpace, setActiveSpaceState] = useState<ActiveSpace>("musician");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session and active space on client mount
    const activeUser = authService.getSession();
    const storedSpace = authService.getActiveSpace();

    if (activeUser) {
      setUser(activeUser);
      // Default to production space if pure production role, else stored space
      if (activeUser.role === "production") {
        setActiveSpaceState("production");
      } else {
        setActiveSpaceState(storedSpace);
      }
    }
    setIsLoading(false);
  }, []);

  const setActiveSpace = (space: ActiveSpace) => {
    setActiveSpaceState(space);
    authService.setActiveSpace(space);
  };

  const switchSpace = () => {
    const nextSpace: ActiveSpace = activeSpace === "musician" ? "production" : "musician";
    setActiveSpace(nextSpace);
  };

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    const res = await authService.login(identifier, password);
    if (res.success && res.user) {
      setUser(res.user);
      if (res.user.role === "production") {
        setActiveSpace("production");
      } else {
        setActiveSpace("musician");
      }
    }
    setIsLoading(false);
    return res;
  };

  const firstTimeSetup = async (userId: string, newPassword: string) => {
    setIsLoading(true);
    const res = await authService.firstTimeSetup(userId, newPassword);
    if (res.success && res.user) {
      setUser(res.user);
      setActiveSpace("musician");
    }
    setIsLoading(false);
    return res;
  };

  const requestPasswordReset = async (email: string) => {
    return authService.requestPasswordReset(email);
  };

  const resetPassword = async (email: string, newPassword: string) => {
    return authService.resetPassword(email, newPassword);
  };

  const logout = () => {
    authService.clearSession();
    setUser(null);
    setActiveSpaceState("musician");
  };

  const role = user?.role || null;
  const permissions = role ? ROLE_PERMISSIONS[role] : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        role,
        activeSpace,
        setActiveSpace,
        switchSpace,
        permissions,
        login,
        firstTimeSetup,
        requestPasswordReset,
        resetPassword,
        logout,

        // Prompt 003 & 031 permission helpers bound to current user & activeSpace
        isMusician: perm.isMusician(user),
        isProduction: perm.isProduction(user),
        isHybridProduction: perm.isHybridProduction(user),
        isSuperAdmin: perm.isSuperAdmin(user),
        canManageUsers: perm.canManageUsers(user),
        isResponsibleForEvent: (event) => perm.isResponsibleForEvent(user, event),
        canEditEvent: (event) => perm.canEditEvent(user, event, activeSpace),
        canEditSetlist: (event) => perm.canEditSetlist(user, event, activeSpace),
        canManageRehearsals: () => perm.canManageRehearsals(user, activeSpace),
        canManageMaterials: (event) => perm.canManageMaterials(user, event, activeSpace),
        canImportIreal: (event) => perm.canImportIreal(user, event, activeSpace),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un <AuthProvider>");
  }
  return context;
}
