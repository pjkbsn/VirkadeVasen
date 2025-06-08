"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "../../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import { CartItemsDisplay } from "@/components/cart/CartItemsDisplay";

export const CartButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const { items } = useCartStore();

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error("Din varukorg är tom");
      return;
    }

    setIsCheckingOut(true);
    try {
      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Network response was not ok");
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error redirecting to checkout:", error);
      toast.error("Det gick inte att gå till kassan. Försök igen senare.");
    } finally {
      setIsCheckingOut(false);
    }
  };
  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger className="cursor-pointer relative">
          <ShoppingCart className="size-6" />
          {items.length > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {items.length}
            </div>
          )}
        </SheetTrigger>
        <SheetContent side="right" className="flex">
          <SheetHeader>
            <SheetTitle className="text-center">Varukorg</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>

          {/* Gör till komponent då liknande finns i CartItemList.tsx */}
          <CartItemsDisplay cartItems={items} />
          <div className="flex flex-col gap-5 mb-10 p-5">
            <p className="flex justify-between">
              Total: <span>{totalPrice} kr</span>
            </p>
            <Button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full"
              // className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full text-center"
            >
              {isCheckingOut ? "Bearbetar..." : "Gå till kassan"}
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Fortsätt handla
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
