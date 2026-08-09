import { AuthUser } from "@/types/auth";
import { INITIAL_MOCK_USERS, StoredUserAccount } from "./mock-users";
import { supabase } from "./supabase";

const SESSION_KEY = "artefacts_auth_session";
const ACCOUNTS_KEY = "artefacts_user_accounts";

// Helper to initialize accounts storage in browser
function getAccounts(): StoredUserAccount[] {
  if (typeof window === "undefined") return INITIAL_MOCK_USERS;
  const stored = localStorage.getItem(ACCOUNTS_KEY);
  if (!stored) {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(INITIAL_MOCK_USERS));
    return INITIAL_MOCK_USERS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_MOCK_USERS;
  }
}

function saveAccounts(accounts: StoredUserAccount[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  }
}

export const authService = {
  /** Récupère tous les profils disponibles pour le sélecteur d'accueil */
  getAvailableProfiles(): AuthUser[] {
    const accounts = getAccounts();
    return accounts.map(({ passwordHash, ...user }) => user);
  },

  /** Trouve un profil par son ID */
  getProfileById(id: string): AuthUser | null {
    const accounts = getAccounts();
    const user = accounts.find((u) => u.id === id);
    if (!user) return null;
    const { passwordHash, ...authUser } = user;
    return authUser;
  },

  /** Trouve un profil par email */
  getProfileByEmail(email: string): AuthUser | null {
    const accounts = getAccounts();
    const user = accounts.find((u) => u.email && u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;
    const { passwordHash, ...authUser } = user;
    return authUser;
  },

  /** Connexion classique avec identifiant (email ou ID profil) et mot de passe */
  async login(identifier: string, password: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    const accounts = getAccounts();
    const cleanId = identifier.trim().toLowerCase();

    const user = accounts.find(
      (u) => u.id === identifier || (u.email && u.email.toLowerCase() === cleanId)
    );

    if (!user) {
      return { success: false, error: "Identifiant ou profil introuvable." };
    }

    if (user.isFirstLogin) {
      return {
        success: false,
        error: "C'est votre première connexion. Veuillez définir votre mot de passe.",
      };
    }

    if (user.passwordHash && user.passwordHash !== password) {
      return { success: false, error: "Mot de passe incorrect." };
    }

    // Attempt Supabase Auth login if active
    try {
      if (supabase && user.email) {
        await supabase.auth.signInWithPassword({
          email: user.email,
          password: password,
        });
      }
    } catch {
      // Graceful fallback to session storage
    }

    const { passwordHash, ...authUser } = user;
    this.setSession(authUser);
    return { success: true, user: authUser };
  },

  /** Première connexion : définition du mot de passe */
  async firstTimeSetup(
    userId: string,
    newPassword: string
  ): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    if (newPassword.length < 6) {
      return { success: false, error: "Le mot de passe doit contenir au moins 6 caractères." };
    }

    const accounts = getAccounts();
    const userIndex = accounts.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return { success: false, error: "Profil utilisateur non trouvé." };
    }

    // Update account with new password and set isFirstLogin to false
    accounts[userIndex].passwordHash = newPassword;
    accounts[userIndex].isFirstLogin = false;
    saveAccounts(accounts);

    const { passwordHash, ...authUser } = accounts[userIndex];
    this.setSession(authUser);
    return { success: true, user: authUser };
  },

  /** Demande de réinitialisation de mot de passe */
  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const accounts = getAccounts();
    const user = accounts.find((u) => u.email && u.email.toLowerCase() === cleanEmail);

    if (!user) {
      // For security, don't disclose if email exists or not
      return {
        success: true,
        message: "Si cette adresse e-mail existe, un lien de réinitialisation sécurisé a été envoyé.",
      };
    }

    try {
      if (supabase) {
        await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${window.location.origin}/auth/reinitialisation`,
        });
      }
    } catch {
      // Local fallback
    }

    return {
      success: true,
      message: "Un lien de réinitialisation sécurisé a été envoyé à votre adresse e-mail.",
    };
  },

  /** Réinitialisation du mot de passe */
  async resetPassword(
    email: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    if (newPassword.length < 6) {
      return { success: false, error: "Le mot de passe doit contenir au moins 6 caractères." };
    }

    const cleanEmail = email.trim().toLowerCase();
    const accounts = getAccounts();
    const userIndex = accounts.findIndex((u) => u.email && u.email.toLowerCase() === cleanEmail);

    if (userIndex === -1) {
      return { success: false, error: "Compte non trouvé pour cette adresse e-mail." };
    }

    accounts[userIndex].passwordHash = newPassword;
    accounts[userIndex].isFirstLogin = false;
    saveAccounts(accounts);

    return { success: true };
  },

  /** Gestion de l'espace actif pour les utilisateurs hybrides */
  getActiveSpace(): "musician" | "production" {
    if (typeof window === "undefined") return "musician";
    const stored = localStorage.getItem("artefacts_active_space");
    if (stored === "production" || stored === "musician") return stored;
    return "musician";
  },

  setActiveSpace(space: "musician" | "production") {
    if (typeof window !== "undefined") {
      localStorage.setItem("artefacts_active_space", space);
    }
  },

  /** Gestion de session */
  getSession(): AuthUser | null {
    if (typeof window === "undefined") return null;
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return null;
    try {
      return JSON.parse(sessionStr);
    } catch {
      return null;
    }
  },

  setSession(user: AuthUser) {
    if (typeof window !== "undefined") {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    }
  },

  clearSession() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem("artefacts_active_space");
    }
  },

  /** Modification du profil utilisateur (Prompt 015) */
  updateProfile(userId: string, updates: Partial<AuthUser>): AuthUser | null {
    const accounts = getAccounts();
    const index = accounts.findIndex((u) => u.id === userId);
    if (index === -1) return null;

    // Ne PAS autoriser la modification du rôle via l'édition de profil simple
    const { role, ...safeUpdates } = updates as any;

    const updatedAccount = {
      ...accounts[index],
      ...safeUpdates,
    };

    accounts[index] = updatedAccount;
    saveAccounts(accounts);

    const { passwordHash, ...authUser } = updatedAccount;
    const currentSession = this.getSession();
    if (currentSession && currentSession.id === userId) {
      this.setSession(authUser);
    }
    return authUser;
  },

  /** Administration : Ajouter un nouveau membre */
  addMember(memberData: Omit<AuthUser, "id" | "isFirstLogin">): AuthUser {
    const accounts = getAccounts();
    const newId = `mus-${Date.now()}`;
    const newMember: StoredUserAccount = {
      ...memberData,
      id: newId,
      isFirstLogin: false,
      actif: memberData.actif !== undefined ? memberData.actif : true,
    };

    accounts.push(newMember);
    saveAccounts(accounts);

    // Sync baseline profile to Supabase if client active
    if (supabase) {
      supabase
        .from("musicians")
        .upsert([{
          id: newId,
          prenom: newMember.prenom,
          role: newMember.instrument || newMember.role,
          ville: newMember.ville || null,
          actif: newMember.actif ?? true,
        }])
        .then(() => {});
    }

    const { passwordHash, ...authUser } = newMember;
    return authUser;
  },

  /** Administration : Modifier un membre existant (rôle inclus) */
  updateMemberAdmin(userId: string, updates: Partial<AuthUser>): AuthUser | null {
    const accounts = getAccounts();
    const index = accounts.findIndex((u) => u.id === userId);
    if (index === -1) return null;

    const updatedAccount = {
      ...accounts[index],
      ...updates,
    };

    accounts[index] = updatedAccount;
    saveAccounts(accounts);

    if (supabase) {
      supabase
        .from("musicians")
        .upsert([{
          id: userId,
          prenom: updatedAccount.prenom,
          role: updatedAccount.instrument || updatedAccount.role,
          ville: updatedAccount.ville || null,
          actif: updatedAccount.actif ?? true,
        }])
        .then(() => {});
    }

    const { passwordHash, ...authUser } = updatedAccount;
    const currentSession = this.getSession();
    if (currentSession && currentSession.id === userId) {
      this.setSession(authUser);
    }
    return authUser;
  },

  /** Administration : Basculer l'état actif/désactivé d'un membre */
  toggleMemberActive(userId: string): AuthUser | null {
    const accounts = getAccounts();
    const index = accounts.findIndex((u) => u.id === userId);
    if (index === -1) return null;

    const currentActif = accounts[index].actif !== false;
    accounts[index].actif = !currentActif;
    saveAccounts(accounts);

    if (supabase) {
      supabase
        .from("musicians")
        .update({ actif: !currentActif })
        .eq("id", userId)
        .then(() => {});
    }

    const { passwordHash, ...authUser } = accounts[index];
    return authUser;
  },
};


