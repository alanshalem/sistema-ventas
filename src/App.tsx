import './i18n'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { ReactElement } from 'react'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import { AuthContextProvider } from './context/AuthContent'
import { MyRoutes } from './routers/routes'
import { useThemeStore } from './store/ThemeStore'
import { useUsuariosStore } from './store/UsuariosStore'
import { GlobalStyles } from './styles/GlobalStyles'
import { Dark, Light } from './styles/themes'

function App(): ReactElement {
  const { setTheme } = useThemeStore()
  const { datausuarios } = useUsuariosStore()
  const location = useLocation()
  const themeStyle = datausuarios?.tema === 'light' ? Light : Dark

  useEffect(() => {
    if (location.pathname === '/login') {
      setTheme({
        tema: 'light',
        style: Light,
      })
    } else {
      if (datausuarios) {
        const themeStyle = datausuarios?.tema === 'light' ? Light : Dark
        const tema: 'light' | 'dark' = (datausuarios.tema as 'light' | 'dark') ?? 'light'
        setTheme({
          tema: tema,
          style: themeStyle,
        })
      }
    }
  }, [datausuarios, setTheme, location.pathname])

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
