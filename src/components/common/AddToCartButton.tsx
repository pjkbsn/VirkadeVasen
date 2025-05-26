"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Product } from "@/types";
import { useCartStore } from "@/store/cart-store";
import { addToCart } from "@/actions/cart";
import { toast } from "sonner";

type AddToCartButtonProps = {
  product: Product;
};

export const AddToCartButton = ({ product }: AddToCartButtonProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const { addItem, items } = useCartStore();

  const existingItem = items.find((item) => item.id === product.id);

  const handleAddToCart = async () => {
    addItem({
      id: product?.id,
      name: product?.product_groups.name,
      color: product?.colors.name,
      image: product?.image_url[0],
      quantity: quantity,
      price: product?.price,
    });

    try {
      const result = await addToCart({
        id: product.id,
        quantity,
      });

      if (!result.success) {
        if (existingItem) {
          useCartStore
            .getState()
            .updateQuantity(product.id, existingItem.quantity);
        } else {
          useCartStore.getState().removeItem(product.id);
        }
        toast.error(result.error || "Failed to add to cart");
      } else {
        toast.success("Added to cart!");
      }
    } catch (error) {
      if (existingItem) {
        useCartStore
          .getState()
          .updateQuantity(product.id, existingItem.quantity);
      } else {
        useCartStore.getState().removeItem(product.id);
      }
      console.error("Failed to add to cart");
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
