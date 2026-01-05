import { create } from 'zustand'

import { InsertarAsignacionCajaSucursal } from '../supabase/crudAsignacionCajaSucursal'
import { InsertarPermisos } from '../supabase/crudPermisos'
import {
  EditarUsuarios,
  EliminarUsuarioAsignado,
  InsertarCredencialesUser,
  InsertarUsuarios,
} from '../supabase/crudUsuarios'
import { supabase } from '../supabase/supabase.config'
import type {
  EliminarUsuarioAsignadoParams,
  InsertarPermisoParams,
  MostrarUsuariosParams,
  Rol,
  Usuario,
} from '../types'
import { usePermisosStore } from './PermisosStore'

const tabla = 'usuarios'

type UsuarioConRol = Usuario & { roles: Rol | null; theme?: string | null }

interface UsuariosState {
  refetchs: unknown | null
  datausuarios: UsuarioConRol | null
  itemSelect: Usuario | null
}

interface UsuariosActions {
  setItemSelect: (item: Usuario | null) => void
  mostrarusuarios: (params: MostrarUsuariosParams) => Promise<UsuarioConRol | null>
  eliminarUsuarioAsignado: (params: EliminarUsuarioAsignadoParams) => Promise<void>
  insertarUsuario: (params: {
    email: string
    pass: string
    nombres: string
    nro_doc?: string
    telefono?: string
    id_rol: number
    id_sucursal: number
    id_caja: number
  }) => Promise<void>
  editarUsuarios: (params: Partial<Usuario> & { id: number }) => Promise<void>
  editarThemeUser: (params: Partial<Usuario> & { id: number }) => Promise<void>
}

type UsuariosStore = UsuariosState & UsuariosActions

export const useUsuariosStore = create<UsuariosStore>((set) => ({
  // State
  refetchs: null,
  datausuarios: null,
  itemSelect: null,

  // Actions
  setItemSelect: (p) => set({ itemSelect: p }),

  mostrarusuarios: async (p) => {
    console.log('🏁 Ejecutando mostrarusuarios con:', p.id_auth)
    try {
      const { data, error } = await supabase
        .from(tabla)
        .select(`*, roles(*)`)
        .eq('id_auth', p.id_auth)
        .maybeSingle()

      console.log('📥 Resultado Supabase:', data)

      if (error) {
        console.error('💥 Supabase error en MostrarUsuarios:', error)
        throw new Error(error.message)
      }

      set({ datausuarios: data as UsuarioConRol })
      return data as UsuarioConRol
    } catch (err) {
      console.error('🔥 ERROR inesperado:', err)
      throw err
    }
  },

  eliminarUsuarioAsignado: async (p) => {
    await EliminarUsuarioAsignado(p)
  },

  insertarUsuario: async (p) => {
    const selectModules = usePermisosStore.getState().selectedModules || []
    console.log('Módulos seleccionados:', selectModules)
    const data = await InsertarCredencialesUser({
      email: p.email,
      password: p.pass,
      nombres: 'temp', // This might need adjustment based on actual implementation
    })

    if (!data?.id_auth) {
      throw new Error('Failed to create user credentials')
    }

    const dataUserNew = await InsertarUsuarios({
      nombres: p.nombres,
      telefono: p.telefono,
      id_rol: p.id_rol,
      correo: p.email,
      id_empresa: 1, // This should be dynamic - get from auth or context
      usuario_supabase: data.id_auth,
    })

    if (!dataUserNew?.id) {
      throw new Error('Failed to create user')
    }

    await InsertarAsignacionCajaSucursal({
      id_sucursal: p.id_sucursal,
      id_usuario: dataUserNew.id,
      id_caja: p.id_caja,
    })

    if (Array.isArray(selectModules) && selectModules.length > 0) {
      selectModules.forEach(async (idModule) => {
        const permParams: InsertarPermisoParams = {
          id_usuario: dataUserNew.id,
          idmodulo: idModule,
        }
        await InsertarPermisos(permParams)
      })
    } else {
      throw new Error('No hay módulos seleccionados')
    }
  },

  editarUsuarios: async (p) => {
    await EditarUsuarios(p)
  },

  editarThemeUser: async (p) => {
    const { error } = await supabase.from(tabla).update(p).eq('id', p.id)
    if (error) {
      throw new Error(error.message)
    }
  },
}))
