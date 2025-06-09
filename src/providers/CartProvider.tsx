"use client";

import { getCart } from "@/actions/cart";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { useEffect } from "react";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { addItem, clearCart } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      // User is logged in, fetch their cart
      const fetchCart = async () => {
        try {
          // clearCart();
          const { data, success } = await getCart();

          if (success && data) {
            data.forEach((item) => {
              addItem({
                id: item.products.id,
                name: item.products.product_groups.name,
                color: item.products.colors.name,
                image: item.products.image_url[0],
                quantity: item.quantity,
                price: item.products.price,
              });
            });
          }
        } catch (error) {
          console.error("Error fetching cart; ", error);
        }
      };
      fetchCart();
    } else {
      // User is logged out, clear the cart
      clearCart();
    }
  }, [user, addItem, clearCart]);

  return children;
}
