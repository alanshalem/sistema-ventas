import { ThemeProvider } from "styled-components"
import { AuthContextProvider } from "./context/AuthContent"
import { GlobalStyles } from "./styles/GlobalStyles"
import { Dark, Light } from "./styles/themes"
import { MyRoutes } from "./routers/routes"
import { useThemeStore } from "./store/ThemeStore"
import { useUsuariosStore } from "./store/UsuariosStore"
import { useEffect } from "react"
import type { ReactElement } from "react"
import { useLocation } from "react-router-dom"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import "./i18n"

function App(): ReactElement {
  const { setTheme } = useThemeStore()
  const { datausuarios } = useUsuariosStore()
  const location = useLocation()
  const themeStyle = datausuarios?.tema === "light" ? Light : Dark

  useEffect(() => {
    if (location.pathname === "/login") {
      setTheme({
        tema: "light",
        style: Light,
      })
    } else {
      if (datausuarios) {
        const themeStyle = datausuarios?.tema === "light" ? Light : Dark
        const tema = datausuarios.tema ?? "light"
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
