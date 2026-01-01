import type { User } from '@supabase/supabase-js'
import { create } from 'zustand'

import { supabase } from '../index'

interface LoginCredentials {
  email: string
  password: string
}

interface SignUpCredentials {
  email: string
  password: string
}

interface AuthState {
  // No state properties currently
}

interface AuthActions {
  loginGoogle: () => Promise<void>
  cerrarSesion: () => Promise<void>
  loginEmail: (credentials: LoginCredentials) => Promise<User | null>
  crearUserYLogin: (credentials: SignUpCredentials) => Promise<User | null>
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>(() => ({
  loginGoogle: async (): Promise<void> => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  },
  cerrarSesion: async (): Promise<void> => {
    await supabase.auth.signOut()
  },
  loginEmail: async (p: LoginCredentials): Promise<User | null> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: p.email,
      password: p.password,
    })
    if (error) {
      if (error.status === 400) {
        throw new Error('Correo o contraseña incorrectos')
      } else {
        throw new Error('Error al iniciar sesión: ' + error.message)
      }
    }
    return data.user
  },
  crearUserYLogin: async (p: SignUpCredentials): Promise<User | null> => {
    const { data } = await supabase.auth.signUp({
      email: p.email,
      password: p.password,
    })
    return data.user
  },
  // obtenerIdAuthSupabase: async (): Promise<string> => {
  //     const response = await ObtenerIdAuthSupabase()
  //     return response
  //   },
}))
