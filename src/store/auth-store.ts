// store/authStore.ts
import { create } from "zustand";
import { AuthError, User } from "@supabase/supabase-js";
import { getCurrentUser, signIn, signOut, signUp } from "@/lib/auth";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  success: string | null;
  isAdmin: boolean;

  setSuccess: (message: string | null) => void;
  clearError: () => void;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signUp: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  success: null,
  isAdmin: false,
  setSuccess: (message) => set({ success: message }), // Ifall vill implementera customsuccess message
  clearError: () => set({ error: null }), //Ifall behöver rensa error meddelande

  initialize: async () => {
    set({ loading: true, error: null });
    try {
      const currentUser = await getCurrentUser();
      const adminStatus = currentUser
        ? currentUser?.app_metadata?.role === "admin"
        : false;
      set({
        user: currentUser,
        isAdmin: adminStatus,
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    const result = await signIn(email, password);
    if (!result.error && result.data?.user) {
      const adminStatus = result.data.user?.app_metadata?.role === "admin";
      set({
        user: result.data.user,
        isAdmin: adminStatus,
        loading: false,
        success: "Du loggas nu in",
      });
    } else {
      set({ error: result.error?.message, loading: false });
    }
    return { error: result.error };
  },

  signUp: async (email, password) => {
    set({ loading: true, error: null });
    const result = await signUp(email, password);
    if (!result.error && result.data?.user) {
      const adminStatus = result.data.user?.app_metadata?.role === "admin";
      set({
        user: result.data.user,
        isAdmin: adminStatus,
        loading: false,
        success: "Verifiering har skickats till din email!",
      });
    } else {
      set({ error: result.error?.message, loading: false });
    }
    return { error: result.error };
  },

  signOut: async () => {
    set({ loading: true, error: null });
    const result = await signOut();
    if (!result.error) {
      set({
        user: null,
        isAdmin: false,
        loading: false,
        success: "Du loggas nu ut",
      });
    } else {
      set({ error: result.error?.message, loading: false });
    }
    return { error: result.error };
  },
}));

// Initialize auth state immediately
useAuthStore.getState().initialize();
