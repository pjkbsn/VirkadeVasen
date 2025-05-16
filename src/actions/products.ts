"use server";

import { productVariantSchema } from "@/schemas";
import {
  CreateProductGroups,
  CreateProduct,
  ProductGroups,
  UpdateProduct,
  Product,
} from "@/types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";

// Base type with mandatory success field
export type ActionResult =
  | { success: true }
  | { success: false; error: string };

// Type for functions that return data
export type ActionResultWithData<T> =
  | { success: true; data: T }
  | { success: false; error: string; data?: T };

// Type for functions that return an ID
export type ActionResultWithId =
  | { success: true; id: string }
  | { success: false; error: string };

export async function getProductGroups(): Promise<
  ActionResultWithData<ProductGroups[]>
> {
  const supabase = createClient(cookies());

  try {
    const { data, error } = await supabase
      .from("product_groups")
      .select("id, name, description");
    if (error) throw new Error(error.message);
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error fetching product_group", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      data: [],
    };
  }
}

export async function createProductGroup(
  data: CreateProductGroups
): Promise<ActionResultWithId> {
  const supabase = createClient(cookies());

  try {
    const { data: result, error } = await supabase
      .from("product_groups")
      .insert(data)
      .select("id");
    if (error) throw new Error(error.message);

    revalidatePath("/admin/products");
    return {
      success: true,
      id: result?.[0]?.id,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateProductGroup(
  data: ProductGroups
): Promise<ActionResultWithData<ProductGroups[]>> {
  const { id, ...updateData } = data;
  const supabase = createClient(cookies());
  try {
    const { data, error } = await supabase
      .from("product_groups")
      .update(updateData)
      .eq("id", id)
      .select();
    if (error) throw new Error(error.message);

    revalidatePath("/admin/products");
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteProductGroup(id: string): Promise<ActionResult> {
  const supabase = createClient(cookies());

  try {
    const { error } = await supabase
      .from("product_groups")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getProduct(): Promise<ActionResultWithData<Product[]>> {
  const supabase = createClient(cookies());
  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        "id, price, stock, image_url, color_id, product_groups:product_groups_id(id, name, description), colors:color_id(id, name)"
      );
    if (error) throw new Error(error.message);
    const parsed = z.array(productVariantSchema).parse(data);

    return {
      success: true,
      data: parsed,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function createProduct(data: CreateProduct) {
  const supabase = createClient(cookies());

  try {
    const { data: result, error } = await supabase
      .from("products")
      .insert(data)
      .select("id");
    if (error) throw new Error(error.message);
    revalidatePath("/admin/products");
    return {
      success: true,
      id: result?.[0]?.id,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
export async function updateProduct(data: UpdateProduct, id: string) {
  const supabase = createClient(cookies());

  try {
    const { error } = await supabase.from("products").update(data).eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteProduct(id: string) {
  const supabase = createClient(cookies());

  try {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getProductGroupWithProducts(productId: string) {
  const supabase = createClient(cookies());

  try {
    // First get the selected variant
    const { data: selectedProduct, error: productError } = await supabase
      .from("products")
      .select(
        `
        id,
        price,
        stock,
        image_url,
        product_id,
        color_id,
        colors:color_id(id, name, hex_code),
        product_groups:product_group_id(id, name, description)
      `
      )
      .eq("id", productId)
      .single();

    if (productError) throw new Error(productError.message);
    if (!selectedProduct) throw new Error("Variant not found");

    // Then get all variants for the same product
    const { data: allVariants, error: allVariantsError } = await supabase
      .from("products")
      .select(
        `
        id,
        price,
        stock,
        image_url,
        color_id,
        colors:color_id(id, name, hex_code)
      `
      )
      .eq("product_id", selectedProduct.product_id)
      .neq("id", productId); // Exclude the current variant

    if (allVariantsError) throw new Error(allVariantsError.message);

    return {
      success: true,
      data: {
        selectedProduct,
        otherVariants: allVariants || [],
        product: selectedProduct.product_groups,
      },
    };
  } catch (error) {
    console.error("Error fetching product with variants:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
}
