import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

const supabase = createClient();

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}

export async function isAdmin() {
  const user = await getCurrentUser();
  return Boolean(user?.app_metadata.role === "admin");
}
