"use client";

import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { CircleUserRound } from "lucide-react";
import { useState } from "react";

export const LoginSheet = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [createAccount, setCreateAccount] = useState<boolean>(false);

  const handleCreateAccount = () => {
    if (createAccount) {
      setCreateAccount(false);
    } else {
      setCreateAccount(true);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="cursor-pointer relative">
        <CircleUserRound className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent side="right" className="flex">
        <SheetHeader>
          <SheetTitle className="text-center">Logga in</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-5 mb-10 p-5">
          {!createAccount ? <LoginForm /> : <SignupForm />}
          <Button onClick={handleCreateAccount} className="w-full">
            {!createAccount ? "Skapa konto" : "Tillbaka"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
