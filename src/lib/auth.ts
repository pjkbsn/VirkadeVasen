"use server";

import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";

async function getServerSupabase() {
  return await createClient(cookies());
}

export async function signUp(email: string, password: string) {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  const supabase = await getServerSupabase();
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await getServerSupabase();
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}

export async function isAdmin() {
  const user = await getCurrentUser();
  return Boolean(user?.app_metadata.role === "admin");
}
