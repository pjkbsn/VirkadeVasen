export type Product = {
  id: string;
  name: string;
  description: string;
};

export type Colors = {
  id?: string;
  name: string;
  hex_code?: string;
};

export type ProductVariant = {
  id: string;
  price: number;
  stock: number;
  image_url: string[] | null;
  color_id: string;
  products: Product;
  colors: Colors;
};
