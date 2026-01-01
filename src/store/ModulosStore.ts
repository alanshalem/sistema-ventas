import { create } from 'zustand'

import { MostrarModulos } from '../supabase/crudModulos'
import type { Modulo } from '../types'

interface ModulosState {
  dataModulos: Modulo[]
}

interface ModulosActions {
  mostrarModulos: () => Promise<Modulo[]>
}

type ModulosStore = ModulosState & ModulosActions

export const useModulosStore = create<ModulosStore>((set) => ({
  // State
  dataModulos: [],

  // Actions
  mostrarModulos: async () => {
    const response = await MostrarModulos()
    set({ dataModulos: response ?? [] })
    return response ?? []
  },
}))
