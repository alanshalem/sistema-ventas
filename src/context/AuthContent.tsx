import { createContext, useContext, useEffect, useState } from 'react'

import { InsertarEmpresa, MostrarUsuarios } from '../index'
import { supabase } from '../supabase/supabase.config'

interface AuthUser {
  id: string
  email?: string
}

const AuthContext = createContext<{ user: AuthUser | null } | undefined>(undefined)
export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session == null) {
        setUser(null)
      } else {
        setUser(session?.user ?? null)

        insertarDatos(session?.user?.id ?? '', session?.user?.email ?? '')
      }
    })
    return () => {
      data.subscription.unsubscribe()
    }
  }, [])
  const insertarDatos = async (id_auth: string, correo: string) => {
    const response = await MostrarUsuarios({ id_auth: id_auth })
    if (response) {
      return
    } else {
      await InsertarEmpresa({ email: correo, nombre: correo })
    }
  }

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
}
export const UserAuth = () => {
  return useContext(AuthContext)
}
