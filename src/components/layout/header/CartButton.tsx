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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartStore } from "@/store/cart-store";
import { CartItemQuantity } from "@/components/common/CartItemQuantity";
import { removeCartItem } from "@/actions/cart";
import { toast } from "sonner";
import Link from "next/link";
import { CartItemsDisplay } from "@/components/cart/CartItemsDisplay";
export const CartButton = () => {
  const [isOpen, setIsOpen] = useState(false);
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

  // const handleDeleteItem = async (id: string) => {
  //   const currentItem = items.find((product) => product.id === id);
  //   console.log("currentItem", currentItem);
  //   console.log("currentItem", id);

  //   if (!currentItem) {
  //     toast.error("CurrentItem not found");
  //     return;
  //   }

  //   useCartStore.getState().removeItem(id);

  //   try {
  //     const result = await removeCartItem(id);
  //     if (!result.success) {
  //       toast.error("Failed to remove item");
  //       useCartStore.getState().addItem(currentItem);
  //     } else {
  //       toast.success("Successfully removed item");
  //     }
  //   } catch (error) {
  //     toast.error("Something went wrong");
  //     useCartStore.getState().addItem(currentItem);
  //   }
  // };

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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
            <Link
              href="/cart"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full text-center"
            >
              Gå till kassan
            </Link>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Fortsätt handla
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
