import { create } from "zustand";
import { Dark, Light } from "../styles/themes";

interface ThemeState {
  theme: "light" | "dark";
  themeStyle: typeof Light | typeof Dark;
  setTheme: (p: { tema: "light" | "dark"; style: typeof Light | typeof Dark }) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "light",
  themeStyle: Light,
  setTheme: (p) => {
    set({ theme: p.tema });
    set({ themeStyle: p.style });
  },
}));
