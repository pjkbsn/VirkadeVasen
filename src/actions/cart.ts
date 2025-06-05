"use server";

import { getCurrentUser } from "@/lib/auth";
import { cartItemSchema, productSchema } from "@/schemas";
import { CartItemList, Product } from "@/types";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";

type CartProps = {
  id: string;
  quantity: number;
};

export type ActionResultWithData<T> =
  | { success: true; data: T }
  | { success: false; error: string; data: T };

async function getServerSupabase() {
  return await createClient(cookies());
}

export const addToCart = async ({ id, quantity }: CartProps) => {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "User not authenticated" };
  }
  const supabase = await getServerSupabase();

  try {
    const { data, error } = await supabase
      .from("cart")
      .upsert({ user_id: user.id, product_id: id, quantity: quantity || 1 })
      .select();
    if (error) throw new Error(error.message);

    revalidatePath(".");

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error adding to cart: ", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export async function updateCartItemQuantity({ id, quantity }: CartProps) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  if (quantity < 1) {
    return { success: false, error: "Quantity must be atleast 1" };
  }

  const supabase = await getServerSupabase();
  try {
    const { data, error } = await supabase
      .from("cart")
      .update({ quantity })
      .match({ user_id: user.id, product_id: id });
    if (error) throw new Error(error.message);

    revalidatePath(".");
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error updating cart item quantity", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function removeCartItem(id: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  const supabase = await getServerSupabase();

  try {
    const { error } = await supabase
      .from("cart")
      .delete()
      .match({ product_id: id, user_id: user.id });
    if (error) throw new Error(error.message);
    revalidatePath(".");
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting item from cart", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getCart(): Promise<ActionResultWithData<CartItemList[]>> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "User not authenticated", data: [] };
  }

  const supabase = await getServerSupabase();

  try {
    const { data, error } = await supabase
      .from("cart")
      .select(
        `
        quantity,
        products:product_id(id, price, image_url
        ,colors:color_id(name, hex_code)
        ,product_groups:product_groups_id(id, name)
        )
        `
      )
      .match({ user_id: user.id });

    if (error) throw new Error(error.message);

    const parsed = z.array(cartItemSchema).parse(data);

    return {
      success: true,
      data: parsed,
    };
  } catch (error) {
    console.error("Error getting cart: ", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      data: [],
    };
  }
}
