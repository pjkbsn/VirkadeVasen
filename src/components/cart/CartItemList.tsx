"use client";

import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { useCartStore } from "@/store/cart-store";

import { CartItemsDisplay } from "./CartItemsDisplay";
import { useState } from "react";

export const CartItemList = () => {
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const { items } = useCartStore();

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
    <div className="flex flex-col w-full h-full items-center">
      {/* Gör till komponent då liknande finns i CartButton.tsx */}
      <div className="w-2/5">
        <div className="h-3/5">
          <CartItemsDisplay cartItems={items} />
        </div>
      </div>
      <div className="h-20 mt-10">
        <Button
          onClick={handleCheckout}
          disabled={isCheckingOut}
          className="w-full"
        >
          {isCheckingOut ? "Bearbetar..." : "Gå till kassan"}
        </Button>
      </div>
    </div>
  );
};
