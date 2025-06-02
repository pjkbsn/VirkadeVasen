"use client";

import { useAuthStore } from "@/store/auth-store";
import { User } from "@supabase/supabase-js";
import { useEffect } from "react";

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User | null;
}) {
  // Initialize auth store with server-provided user
  // Initialize state immediately, not in useEffect
  // This prevents flash by setting the state before first render
  useEffect(() => {
    // Set auth state synchronously at module load time
    useAuthStore.setState({
      user: initialUser,
      loading: false,
      isAdmin: initialUser?.app_metadata?.role === "admin" || false,
    });
  }, [initialUser]);

  return children;
}
