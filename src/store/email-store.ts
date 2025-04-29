import { create } from "zustand";

type EmailStore = {
  email: string;
  setEmail: (email: string) => void;
};

export const useEmailStore = create<EmailStore>((set) => ({
  email: "",
  setEmail: (email) => set({ email }),
}));
