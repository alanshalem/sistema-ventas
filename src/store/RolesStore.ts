import { create } from 'zustand'

import { MostrarRoles } from '../supabase/crudRol'
import type { Rol } from '../types'

interface RolesState {
  rolesItemSelect: Rol | null
  dataroles: Rol[] | null
}

interface RolesActions {
  setRolesItemSelect: (role: Rol | null) => void
  mostrarRoles: () => Promise<Rol[]>
}

type RolesStore = RolesState & RolesActions

export const useRolesStore = create<RolesStore>((set) => ({
  // State
  rolesItemSelect: null,
  dataroles: null,

  // Actions
  setRolesItemSelect: (p) => {
    set({ rolesItemSelect: p })
  },

  mostrarRoles: async () => {
    const response = await MostrarRoles()

    set({
      rolesItemSelect: (response && response[0]) ?? null,
      dataroles: response,
    })
    return response ?? []
  },
}))
