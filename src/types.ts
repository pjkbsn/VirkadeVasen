export type ProductGroups = {
  id: string;
  name: string;
  description?: string;
};

export type CreateProductGroups = {
  name: string;
  description?: string;
};

export type Colors = {
  id?: string;
  name: string;
  hex_code?: string;
};

export type Product = {
  id: string;
  price: number;
  stock?: number;
  image_url: string[];
  product_groups: ProductGroups;
  colors: Colors;
};

export type CreateProduct = {
  product_groups_id: string; // Note this matches your DB schema
  color_id: string;
  price: number;
  stock: number;
  image_url?: string[];
};

export type UpdateProduct = Partial<{
  color_id: string;
  price: number;
  stock: number;
  image_url: string[];
}>;

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent_id?: string;
};
export type Color = {
  id: string;
  name: string;
  hex_code: string;
};
