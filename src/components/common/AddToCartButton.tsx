"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Product } from "@/types";
import { useCartStore } from "@/store/cart-store";
import { addToCart, updateCartItemQuantity } from "@/actions/cart";
import { toast } from "sonner";

type AddToCartButtonProps = {
  product: Product;
};

// FIXA OM GÅR IN PÅ SAMMA PRODUKT OCH LÄGGER TILL FLER ANTAL
// SKA DET PLUSSAS PÅ PÅ BEFINTLIGT ANTAL

export const AddToCartButton = ({ product }: AddToCartButtonProps) => {
  const [quantity, setQuantity] = useState<number>(1);

  const { addItem, items, updateQuantity } = useCartStore();

  const existingItem = items.find((item) => item.id === product.id);
  const handleAddToCart = async () => {
    const newQuantity = existingItem
      ? existingItem.quantity + quantity
      : quantity;
    if (existingItem) {
      updateQuantity(existingItem.id, newQuantity);
    } else {
      addItem({
        id: product?.id,
        name: product?.product_groups.name,
        color: product?.colors.name,
        image: product?.image_url[0],
        quantity: quantity,
        price: product?.price,
      });
    }

    try {
      if (existingItem) {
        const result = await updateCartItemQuantity({
          id: existingItem.id,
          quantity: newQuantity,
        });

        if (!result.success) {
          useCartStore
            .getState()
            .updateQuantity(product.id, existingItem.quantity);
        }
      } else {
        const result = await addToCart({
          id: product.id,
          quantity,
        });

        if (!result.success) {
          useCartStore.getState().removeItem(product.id);

          toast.error(result.error || "Failed to add to cart");
        } else {
          toast.success("Added to cart!");
        }
      }
    } catch (error: unknown) {
      if (existingItem) {
        useCartStore
          .getState()
          .updateQuantity(product.id, existingItem.quantity);
      } else {
        useCartStore.getState().removeItem(product.id);
      }
      console.error(
        error instanceof Error ? error.message : "Failed to add to cart"
      );
    }
  };

  const handleQuantity = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="flex flex-col w-full items-center gap-5">
      <div className="flex gap-5 items-center">
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={() => handleQuantity(quantity - 1)}
        >
          -
        </Button>
        <p>{quantity}</p>
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={() => handleQuantity(quantity + 1)}
        >
          +
        </Button>
      </div>
      <Button onClick={handleAddToCart} className="w-3/4 cursor-pointer">
        Lägg i varukorg
      </Button>
    </div>
  );
};
