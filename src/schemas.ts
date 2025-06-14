import { z } from "zod";

export const productGroupsSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
});
export const productGroupsCardSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const colorSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  hex_code: z.string().optional(),
});

export const productSchema = z.object({
  id: z.string(),
  price: z.number(),
  stock: z.number().optional(),
  image_url: z.array(z.string()),
  product_groups: productGroupsSchema,
  colors: colorSchema,
});

export const productCardSchema = z.object({
  id: z.string(),
  price: z.number(),
  image_url: z.array(z.string()),
  colors: colorSchema,
  product_groups: productGroupsCardSchema,
});

export const cartItemSchema = z.object({
  quantity: z.number(),
  products: productSchema,
});
