import { Dark, Light } from '@/styles/themes'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type ThemeName = 'light' | 'dark'

interface ThemeState {
  theme: ThemeName
  themeStyle: typeof Light | typeof Dark
  setTheme: (p: { theme: ThemeName; style: typeof Light | typeof Dark }) => void
  // Local fallback methods
  setLocalTheme: (theme: ThemeName) => void
  toggleLocalTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      themeStyle: Light,

      setTheme: (p) => {
        console.log('ZUSTAND setTheme:', p)
        set({ theme: p.theme, themeStyle: p.style })
      },

      setLocalTheme: (theme) => {
        const style = theme === 'dark' ? Dark : Light
        set({ theme, themeStyle: style })
      },

      toggleLocalTheme: () => {
        const { theme } = get()
        const newTheme = theme === 'light' ? 'dark' : 'light'
        const style = newTheme === 'dark' ? Dark : Light
        set({ theme: newTheme, themeStyle: style })
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        console.log('Theme rehydrated from localStorage:', state)
        if (state) {
          const style = state.theme === 'dark' ? Dark : Light
          state.themeStyle = style
        }
      },
    }
  )
)
