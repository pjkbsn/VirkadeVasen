import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const storageKey = `sb-${
  new URL(supabaseUrl).hostname.split(".")[0]
}-auth-token`;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    flowType: "pkce",
    detectSessionInUrl: true,
    storageKey, // Use consistent storage key
    storage: {
      getItem: (key) => {
        if (typeof document === "undefined") return null;
        const item = document.cookie
          .split("; ")
          .find((row) => row.startsWith(`${key}=`))
          ?.split("=")[1];
        try {
          return item ? JSON.parse(decodeURIComponent(item)) : null;
        } catch (e) {
          return null;
        }
      },
      setItem: (key, value) => {
        if (typeof document !== "undefined") {
          // 7 days expiry
          const maxAge = 60 * 60 * 24 * 7;
          document.cookie = `${key}=${encodeURIComponent(
            JSON.stringify(value)
          )}; path=/; max-age=${maxAge}; SameSite=Lax${
            process.env.NODE_ENV === "production" ? "; Secure" : ""
          }`;
        }
      },
      removeItem: (key) => {
        if (typeof document !== "undefined") {
          document.cookie = `${key}=; path=/; max-age=0`;
        }
      },
    },
  },
});
