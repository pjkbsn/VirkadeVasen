"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ParamValue } from "next/dist/server/request/params";
import { ProductVariant } from "@/types";
import { productVariantSchema } from "@/schemas";
import { z } from "zod";

export function useProducts() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | string | null>(null);
  const supabase = createClient();

  // Fetch all products+variants
  const getProducts = async (): Promise<ProductVariant[] | null> => {
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
      const parsed = z.array(productVariantSchema).parse(data);
      console.log("parsed getProductsData: ", parsed);
      return parsed;
    } catch (err: any) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };
  // Fetch a single product+variant
  const getProduct = async (id: ParamValue): Promise<ProductVariant | null> => {
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
      const parsed = productVariantSchema.parse(data);
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
  const getAllProductVariants = async (
    productId: string
  ): Promise<ProductVariant[] | null> => {
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
      if (!data) return null;
      const parsed = z.array(productVariantSchema).parse(data);
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

  return { loading, error, getProducts, getProduct, getAllProductVariants };
}
