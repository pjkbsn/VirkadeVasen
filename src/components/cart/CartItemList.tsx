"use client";

import { CartItemQuantity } from "@/components/common/CartItemQuantity";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { Product } from "@/types";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart-store";
import { removeCartItem } from "@/actions/cart";
import { CartItemsDisplay } from "./CartItemsDisplay";

export const CartItemList = () => {
  const { items } = useCartStore();

  return (
    <div className="flex flex-col w-full h-full items-center">
      {/* Gör till komponent då liknande finns i CartButton.tsx */}
      <div className="w-2/5">
        <div className="h-3/5">
          <CartItemsDisplay cartItems={items} />
        </div>
      </div>
      <div className="h-20">
        <h1>Betala här _</h1>
      </div>
    </div>
  );
};
