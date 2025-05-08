"use client";

import { LoginForm } from "@/components/auth/login-form";
import { useAuthStore } from "@/store/auth-store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { user, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/account");
    }
  }, [user, loading, router]);

  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-background rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Logga in eller registrera dig</h1>
          <p className="text-muted-foreground mt-2">
            Logga in för att handla och se dina ordrar
          </p>
        </div>

        <div className="text-center mt-4">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              <LoginForm />
            </>
          )}
        </div>
        <div className="flex text-center justify-center gap-1.5">
          Har du inget konto?
          <Link href="/signup" className="hover:underline">
            Skapa ett
          </Link>
        </div>
      </div>
    </div>
  );
}
