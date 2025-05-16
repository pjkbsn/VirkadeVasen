import { z } from "zod";

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

export const colorSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  hex_code: z.string().optional(),
});

export const productVariantSchema = z.object({
  id: z.string(),
  price: z.number(),
  stock: z.number(),
  image_url: z.array(z.string()).nullable(),
  color_id: z.string(),
  products: productSchema,
  colors: colorSchema,
});
