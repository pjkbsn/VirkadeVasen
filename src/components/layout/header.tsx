"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { CartButton } from "./header/CartButton";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CircleUserRound } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { ThemeToggle } from "../theme/ThemeToggle";
import { UserMenu } from "./header/UserMenu";

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { user } = useAuthStore();

  return (
    <header
      className={cn(
        "z-50 w-full transition-all duration-300",
        isHomePage
          ? "absolute bg-transparent text-white p-4 md:p-5"
          : "sticky top-0 bg-slate-800 text-white shadow-md p-2 md:p-3 h-20"
      )}
    >
      <nav className="flex justify-between gap-4">
        {/* Left side - Logo and products */}
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="z-20 col-start-1 row-start-1 self-center">
            <Image
              src="/vvlogo.png"
              alt="Logo"
              width={150}
              height={150}
              className={cn(
                isHomePage ? "w-auto h-10 md:h-15 lg:h-24" : "w-14 h-14"
              )}
            />
          </Link>
          <div className="flex flex-col items-start md:items-end md:flex-row md:gap-4">
            <Link href="/products" className="cursor-pointer hover:underline">
              Produkter
            </Link>
          </div>
        </div>

        {/* Right side - Auth and cart */}
        <div className="flex items-center gap-4">
          {user ? (
            <UserMenu />
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hover:underline flex flex-col items-center"
              >
                <CircleUserRound className="h-8 w-8" />
                Logga in
              </Link>
            </div>
          )}
          <CartButton />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
