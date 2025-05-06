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

export const UserMenu = () => {
  const { signOut } = useAuthStore();
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await signOut();

    if (!error) {
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
  };

  return (
    <Popover>
      <PopoverTrigger className="flex flex-col items-center cursor-pointer">
        <CircleUserRound className="h-8 w-8" />
        <p className="hidden md:block">Mitt konto</p>
      </PopoverTrigger>
      <PopoverContent className="w-40">
        <div className="grid gap-4">
          <Link href="/account">Account</Link>
          <Link href="/orders">Mina ordrar</Link>
          <Link href="/settings">Inställningar</Link>
          <Button onClick={handleSignOut} className="hover:cursor-pointer">
            Logga ut
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
