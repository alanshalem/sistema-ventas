import './i18n'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { ReactElement } from 'react'
import { useEffect } from 'react'
import { ThemeProvider } from 'styled-components'

import { AuthContextProvider } from './context/AuthContent'
import { MyRoutes } from './routers/routes'
import { useUsuariosStore } from './store/UsuariosStore'
import { GlobalStyles } from './styles/GlobalStyles'
import { Dark, Light } from './styles/themes'
import { useThemeStore } from '@/store/ThemeStore'

function App(): ReactElement {
  const { datausuarios } = useUsuariosStore()
  const { themeStyle, setTheme, theme: localTheme, setLocalTheme } = useThemeStore()
  console.log('STORE REF', useThemeStore)

  // Check if we have backend user data
  const hasBackendTheme = datausuarios?.theme
  const currentTheme = hasBackendTheme ? datausuarios.theme : localTheme

  useEffect(() => {
    const themeToUse = currentTheme as 'light' | 'dark'

    setTheme({
      theme: themeToUse,
      style: themeToUse === 'dark' ? Dark : Light,
    })
  }, [currentTheme, setTheme])

  // Initialize local theme from localStorage if no backend theme
  useEffect(() => {
    if (!hasBackendTheme && localTheme === 'light') {
      // If no backend theme and still default light, check localStorage
      const storedTheme = localStorage.getItem('theme-storage')
      if (storedTheme) {
        try {
          const parsed = JSON.parse(storedTheme)
          if (parsed.state?.theme) {
            setLocalTheme(parsed.state.theme)
          }
        } catch (e) {
          console.error('Failed to parse stored theme:', e)
        }
      }
    }
  }, [hasBackendTheme, localTheme, setLocalTheme])

  return (
    <ThemeProvider theme={themeStyle}>
      <AuthContextProvider>
        <GlobalStyles />
        <MyRoutes />
        <ReactQueryDevtools initialIsOpen={true} />
      </AuthContextProvider>
    </ThemeProvider>
  )
}

export default App
