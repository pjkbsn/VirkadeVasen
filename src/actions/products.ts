"use server";

import { productSchema } from "@/schemas";
import {
  CreateProductGroups,
  CreateProduct,
  ProductGroups,
  UpdateProduct,
  Product,
} from "@/types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { ParamValue } from "next/dist/server/request/params";
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

export async function getProducts(): Promise<ActionResultWithData<Product[]>> {
  const supabase = createClient(cookies());
  try {
    const { data, error } = await supabase.from("products").select(
      `
        id,
         price,
          stock, 
          image_url, 
          color_id, 
          product_groups:product_groups_id(id, name, description), 
          colors:color_id(id, name)
        `
    );
    if (error) throw new Error(error.message);
    const parsed = z.array(productSchema).parse(data);

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

export async function getAllProductsByGroupId(
  productGroupId: string
): Promise<ActionResultWithData<Product[]>> {
  const supabase = createClient(cookies());
  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        id,
        price,
        stock,
        image_url,
        color_id,
        product_groups:product_groups_id(id, name, description),
        colors:color_id(name, hex_code)
        `
      )
      .eq("product_groups_id", productGroupId);

    if (error) throw new Error(error.message);
    const parsed = z.array(productSchema).parse(data);
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

export async function getSingleProduct(
  id: string
): Promise<ActionResultWithData<Product>> {
  const supabase = createClient(cookies());
  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        id,
         price,
          stock, 
          image_url, 
          color_id, 
          product_groups:product_groups_id(id, name, description), 
          colors:color_id(name, hex_code)
        `
      )
      .eq("id", id)
      .single();
    if (error) throw new Error(error.message);

    const parsed = productSchema.parse(data);
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

export async function createProduct(
  data: CreateProduct
): Promise<ActionResultWithId> {
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
export async function updateProduct(
  data: UpdateProduct,
  id: string
): Promise<ActionResult> {
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

export async function deleteProduct(id: string): Promise<ActionResult> {
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

// Add this function to src/actions/products.ts
export async function updateProductCategory(
  productId: string,
  categoryId: string
): Promise<ActionResult> {
  const supabase = createClient(cookies());

  try {
    // First check if there's an existing product_category relation
    const { data: existingRelation, error: checkError } = await supabase
      .from("product_categories")
      .select("*")
      .eq("product_id", productId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "no rows returned" which is fine
      throw new Error(checkError.message);
    }

    // If relation exists, update it; otherwise insert a new one
    let error;

    if (existingRelation) {
      // Update existing relation
      const { error: updateError } = await supabase
        .from("product_categories")
        .update({ category_id: categoryId })
        .eq("product_id", productId);

      error = updateError;
    } else {
      // Insert new relation
      const { error: insertError } = await supabase
        .from("product_categories")
        .insert({
          product_id: productId,
          category_id: categoryId,
        });

      error = insertError;
    }

    if (error) throw new Error(error.message);

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Error updating product category:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// type ProductGroupWithAllProducts = {
//     selectedProduct: Product;
//     otherProducts: Omit <Product, 'product_groups_id, product_groups'>;
//     product: ProductGroups;

// }

// export async function getProductGroupWithProducts(productId: string): Promise<ActionResultWithData<ProductGroupWithAllProducts>> {
//   const supabase = createClient(cookies());

//   try {
//     // First get the selected variant
//     const { data: selectedProduct, error: productError } = await supabase
//       .from("products")
//       .select(
//         `
//         id,
//         price,
//         stock,
//         image_url,
//         product_groups_id,
//         color_id,
//         colors:color_id(id, name, hex_code),
//         product_groups:product_groups_id(id, name, description)
//       `
//       )
//       .eq("id", productId)
//       .single();

//     if (productError) throw new Error(productError.message);
//     if (!selectedProduct) throw new Error("Variant not found");

//     console.log("SelectedProduct", selectedProduct);

//     // Then get all variants for the same product
//     const { data: allProducts, error: allProductsError } = await supabase
//       .from("products")
//       .select(
//         `
//         id,
//         price,
//         stock,
//         image_url,
//         color_id,
//         colors:color_id(id, name, hex_code)
//       `
//       )
//       .eq("product_groups_id", selectedProduct.product_groups_id)
//       .neq("id", productId); // Exclude the current variant

//     if (allProductsError) throw new Error(allProductsError.message);

//     console.log("Alla varianter", allProducts);
//     return {
//       success: true,
//       data: {
//         selectedProduct,
//         otherProducts: allProducts || [],
//         product: selectedProduct.product_groups,
//       },
//     };
//   } catch (error) {
//     console.error("Error fetching product with variants:", error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Unknown error",
//       data: null,
//     };
//   }
// }
