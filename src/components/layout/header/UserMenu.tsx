"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuthStore } from "@/store/auth-store";
import { CircleUserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const UserMenu = () => {
  const { signOut, isAdmin } = useAuthStore();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setOpen(false);
    const { error } = await signOut();

    if (!error) {
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
  };

  const handleMenuClose = () => {
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex flex-col items-center cursor-pointer ">
        <CircleUserRound className="size-6" />
      </PopoverTrigger>
      <PopoverContent className="w-40">
        <div className="grid gap-4">
          {/* <Link href="/account">Account</Link>
          <Link href="/orders">Mina ordrar</Link>
          <Link href="/settings">Inställningar</Link> */}
          {isAdmin && (
            <Link
              href="/admin"
              className="hover:underline"
              onClick={handleMenuClose}
            >
              Admin
            </Link>
          )}
          <Button onClick={handleSignOut} className="hover:cursor-pointer">
            Logga ut
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
