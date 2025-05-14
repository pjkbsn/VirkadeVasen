import { create } from "zustand";
import { createClient } from "@/utils/supabase/client";

type Color = {
  id: string;
  name: string;
  hex_code: string;
};

type ColorState = {
  colors: Color[];
  loading: boolean;
  error: string | null;
  getColors: () => Promise<Color[]>;
  addColor: (name: string, hexCode: string) => Promise<Color | null>;
};

export const useColorStore = create<ColorState>((set, get) => ({
  colors: [],
  loading: false,
  error: null,

  getColors: async () => {
    if (get().colors.length > 0) {
      return get().colors;
    }

    set({ loading: true });
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("colors")
        .select("id, name, hex_code")
        .order("name");
      if (error) throw new Error(error.message);
      set({ colors: data || [], loading: false });
      return data || [];
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      set({ error: errorMessage, loading: false });
      return [];
    }
  },

  addColor: async (name, hexCode) => {
    set({ loading: true });
    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from("colors")
        .insert({ name, hex_code: hexCode })
        .select();
      if (error) throw new Error(error.message);

      if (data && data[0]) {
        set((state) => ({
          colors: [...state.colors, data[0]].sort((a, b) =>
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
}));
