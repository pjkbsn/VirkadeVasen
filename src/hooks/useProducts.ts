"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ParamValue } from "next/dist/server/request/params";
import {
  CreateProduct,
  Product,
  UpdateProduct,
  CreateProductGroups,
  ProductGroups,
} from "@/types";
import { productSchema, productGroupsSchema } from "@/schemas";
import { z } from "zod";

export function useProducts() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | string | null>(null);
  const supabase = createClient();

  // Fetch all products+variants
  const getProducts = async (): Promise<Product[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("product_variants").select(`
        id,
        price,
        stock,
        image_url,
        color_id,
        products:product_id(id, name, description),
        colors:color_id(id, name)
        `);

      console.log("getProductsData: ", data);

      if (error) throw new Error(error.message);
      const parsed = z.array(productSchema).parse(data);
      console.log("parsed getProductsData: ", parsed);
      return parsed;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError("Unknown error");
      }
      return [];
    } finally {
      setLoading(false);
    }
  };
  // Fetch a single product+variant
  const getProduct = async (id: ParamValue): Promise<Product | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("product_variants")
        .select(
          `
        id,
        price,
        stock,
        image_url,
        color_id,
        products:product_id(id, name, description),
        colors:color_id(name, hex_code)
        `
        )
        .eq("id", id)
        .single();
      if (error) throw new Error(error.message);
      if (!data) return null;
      const parsed = productSchema.parse(data);
      return parsed;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError("Unknown error");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  //Fetch all variants to a product
  const getProductByProductGroupId = async (
    productId: string
  ): Promise<Product[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("product_variants")
        .select(
          `
        id,
        price,
        stock,
        image_url,
        color_id,
        products:product_id(id, name, description),
        colors:color_id(name, hex_code)
        `
        )
        .eq("product_id", productId);

      if (error) throw new Error(error.message);
      if (!data) return [];
      const parsed = z.array(productSchema).parse(data);
      return parsed;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError("Unknown error");
      }
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (
    variantData: CreateProduct
  ): Promise<{ success: boolean; id?: string; error?: string }> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("product_variants")
        .insert(variantData)
        .select("id");
      if (error) throw new Error(error.message);

      return {
        success: true,
        id: data?.[0]?.id,
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
        return {
          success: false,
          error: err.message,
        };
      } else {
        setError("Unknown error");
        return {
          success: false,
          error: "Unknown error occurred",
        };
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (
    variantData: UpdateProduct,
    id: string
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("product_variants")
        .update(variantData)
        .eq("id", id);
      if (error) throw new Error(error.message);

      return { success: true };
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
        return {
          success: false,
          error: err.message,
        };
      } else {
        setError("Unknown error");
        return {
          success: false,
          error: "Unknown error occurred",
        };
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (
    id: string
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("product_variants")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { success: true };
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
        return {
          success: false,
          error: err.message,
        };
      } else {
        setError("Unknown error");
        return {
          success: false,
          error: "Unknown error occurred",
        };
      }
    } finally {
      setLoading(false);
    }
  };

  const getProductGroups = async (): Promise<ProductGroups[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`id, name, description`);

      if (error) throw new Error(error.message);

      const parsed = z.array(productGroupsSchema).parse(data);
      return parsed;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError("Unknown error");
      }
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getProductGroup = async (id: string): Promise<ProductGroups | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id);
      if (error) throw new Error(error.message);

      const parsed = productGroupsSchema.parse(data);
      return parsed;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError("Unknown error");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createProductGroup = async (
    productData: CreateProductGroups
  ): Promise<{ success: boolean; id?: string; error?: string }> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .insert(productData)
        .select("id");
      if (error) throw new Error(error.message);

      return {
        success: true,
        id: data?.[0]?.id,
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
        return {
          success: false,
          error: err.message,
        };
      } else {
        setError("Unknown error");
        return {
          success: false,
          error: "Unknown error occurred",
        };
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProductGroup = async (
    productData: ProductGroups
  ): Promise<{ success: boolean; error?: string }> => {
    const { id, ...updateData } = productData;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("products")
        .update(updateData)
        .eq("id", id);
      if (error) throw new Error(error.message);
      return { success: true };
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
        return {
          success: false,
          error: err.message,
        };
      } else {
        setError("Unknown error");
        return {
          success: false,
          error: "Unknown error occurred",
        };
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteProductGroup = async (
    id: string
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw new Error(error.message);
      return {
        success: true,
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
        return {
          success: false,
          error: err.message,
        };
      } else {
        setError("Unknown error");
        return {
          success: false,
          error: "Unknown error occurred",
        };
      }
    } finally {
      setLoading(false);
    }
  };
  const updateProductCategory = async (
    productId: string,
    categoryId: string
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      // First delete any existing associations
      const { error: deleteError } = await supabase
        .from("product_categories")
        .delete()
        .eq("product_id", productId);

      if (deleteError) throw new Error(deleteError.message);

      // Then create the new association
      const { error: insertError } = await supabase
        .from("product_categories")
        .insert({
          product_id: productId,
          category_id: categoryId,
        });

      if (insertError) throw new Error(insertError.message);

      return { success: true };
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
        return {
          success: false,
          error: err.message,
        };
      } else {
        setError("Unknown error");
        return {
          success: false,
          error: "Unknown error occurred",
        };
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getProducts,
    getProduct,
    getProductByProductGroupId,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductGroups,
    getProductGroup,
    createProductGroup,
    updateProductGroup,
    deleteProductGroup,
    updateProductCategory,
  };
}
