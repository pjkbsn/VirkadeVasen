import { create } from "zustand";

type ProductFormState = {
  // Form data
  productData: {
    name: string;
    description?: string;
    categoryId: string;
  };
  // Product ID if created/saved
  productId: string | undefined;
  // UI state
  isCreatingVariant: boolean;

  // Actions
  setProductData: (data: Partial<ProductFormState["productData"]>) => void;
  setProductId: (id: string) => void;
  setIsCreatingVariant: (value: boolean) => void;
  reset: () => void;
};

export const useProductFormStore = create<ProductFormState>((set) => ({
  productData: {
    name: "",
    description: "",
    categoryId: "",
  },
  productId: undefined,
  isCreatingVariant: false,

  setProductData: (data) =>
    set((state) => ({
      productData: { ...state.productData, ...data },
    })),
  setProductId: (id) => set({ productId: id }),
  setIsCreatingVariant: (value) => set({ isCreatingVariant: value }),
  reset: () =>
    set({
      productData: {
        name: "",
        description: "",
        categoryId: "",
      },
      productId: undefined,
      isCreatingVariant: false,
    }),
}));
