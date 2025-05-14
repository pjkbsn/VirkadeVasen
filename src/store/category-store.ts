import { create } from "zustand";
import { createClient } from "@/utils/supabase/client";

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
};

type CategoryState = {
  categories: Category[];
  loading: boolean;
  error: string | null;
  setCategories: (categories: Category[]) => void;
  getCategories: () => Promise<Category[] | null>;
  addCategory: (
    name: string,
    description?: string,
    parentId?: string
  ) => Promise<Category | null>;
  getParentCategories: () => Category[];
  getChildCategories: (parentId: string) => Category[];
};

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  loading: false,
  error: null,
  setCategories: (categories) => set({ categories }),

  getCategories: async () => {
    if (get().categories.length > 0) {
      return get().categories;
    }

    set({ loading: true });
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug, description, parent_id")
        .order("name");

      console.log("Data from categories: ", data);
      if (error) throw new Error(error.message);

      set({ categories: data || [], loading: false });

      return data || [];
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      set({ error: errorMessage, loading: false });
      return [];
    }
  },

  addCategory: async (
    name: string,
    description?: string,
    parentId?: string
  ) => {
    set({ loading: true });
    const supabase = createClient();
    try {
      const slug = name
        .toLowerCase()
        .trim()
        .replace(/å/g, "a")
        .replace(/ä/g, "a")
        .replace(/ö/g, "o")
        .replace(/[^\w\s-]/g, "") // Remove special chars except spaces, hyphens
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen

      const { data, error } = await supabase
        .from("categories")
        .insert({
          name,
          slug,
          description: description || null,
          parent_id: parentId || null,
        })
        .select();
      if (error) throw new Error(error.message);

      // Add the new category to the store's state
      if (data && data[0]) {
        set((state) => ({
          categories: [...state.categories, data[0]].sort((a, b) =>
            a.name.localeCompare(b.name)
          ),
          loading: false,
        }));
        return data[0];
      }

      set({ loading: false });
      return null;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      set({ error: errorMessage, loading: false });
      return null;
    }
  },

  getParentCategories: () => {
    return get().categories.filter((category) => !category.parent_id);
  },

  getChildCategories: (parentId: string) => {
    return get().categories.filter(
      (category) => category.parent_id === parentId
    );
  },
}));
