CREATE TABLE public.cart (
  user_id uuid NOT NULL,
  product_id uuid NOT NULL,
  quantity integer NOT NULL,
  CONSTRAINT cart_pkey PRIMARY KEY (user_id, product_id),
  CONSTRAINT cart_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT cart_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT cart_quantity_check CHECK ((quantity > 0))
) TABLESPACE pg_default;

CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  description text NULL,
  parent_id uuid NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id),
  CONSTRAINT categories_slug_key UNIQUE (slug),
  CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES categories(id)
) TABLESPACE pg_default;

CREATE TABLE public.colors (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  hex_code text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT colors_pkey PRIMARY KEY (id),
  CONSTRAINT colors_name_key UNIQUE (name)
) TABLESPACE pg_default;

CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  product_id uuid NOT NULL,
  quantity integer NOT NULL,
  price numeric NOT NULL,
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT order_items_price_check CHECK ((price >= (0)::numeric)),
  CONSTRAINT order_items_quantity_check CHECK ((quantity > 0))
) TABLESPACE pg_default;

CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  status public.order_status NOT NULL DEFAULT 'pending'::order_status,
  user_id uuid NULL,
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
) TABLESPACE pg_default;

CREATE TABLE public.product_categories (
  product_groups_id uuid NOT NULL,
  category_id uuid NOT NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT product_categories_pkey PRIMARY KEY (product_groups_id, category_id),
  CONSTRAINT product_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  CONSTRAINT product_categories_product_groups_id_fkey FOREIGN KEY (product_groups_id) REFERENCES product_groups(id) ON DELETE CASCADE
) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_product_categories_product_id ON public.product_categories USING btree (product_groups_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_product_categories_category_id ON public.product_categories USING btree (category_id) TABLESPACE pg_default;

CREATE TABLE public.product_groups (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text NOT NULL,
  description text NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_product_id_key UNIQUE (id)
) TABLESPACE pg_default;

CREATE TABLE public.products (
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_groups_id uuid NOT NULL,
  price numeric NOT NULL,
  stock integer NOT NULL,
  updated_at timestamp with time zone NULL DEFAULT now(),
  image_url text[] NULL,
  color_id uuid NULL,
  CONSTRAINT product_variants_pkey PRIMARY KEY (id),
  CONSTRAINT product_variants_id_key UNIQUE (id),
  CONSTRAINT product_variants_color_id_fkey FOREIGN KEY (color_id) REFERENCES colors(id),
  CONSTRAINT products_product_groups_id_fkey FOREIGN KEY (product_groups_id) REFERENCES product_groups(id) ON DELETE CASCADE,
  CONSTRAINT product_variants_price_check CHECK ((price >= (0)::numeric)),
  CONSTRAINT product_variants_stock_check CHECK ((stock >= 0))
) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_product_variants_color_id ON public.products USING btree (color_id) TABLESPACE pg_default;

CREATE TABLE public.profiles (
  id uuid NOT NULL,
  display_name text NULL,
  address text NULL,
  city text NULL,
  postal_code text NULL,
  country text NULL,
  birth_date date NULL,
  preferences jsonb NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
) TABLESPACE pg_default;