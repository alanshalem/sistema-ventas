import { create } from 'zustand'

import { EditarCaja, EliminarCaja, MostrarCajaXSucursal } from '../supabase/crudCaja'
import { supabase } from '../supabase/supabase.config'
import type {
  Caja,
  EditarCajaParams,
  EliminarCajaParams,
  InsertarCajaParams,
  MostrarCajaXSucursalParams,
} from '../types'

const tabla = 'caja'

interface CajasState {
  stateCaja: boolean
  accion: string
  cajaSelectItem: Caja | null
  dataCaja: Caja[] | null
}

interface CajasActions {
  setStateCaja: (state: boolean) => void
  setAccion: (action: string) => void
  setCajaSelectItem: (item: Caja | null) => void
  mostrarCajaXSucursal: (params: MostrarCajaXSucursalParams) => Promise<Caja[] | null>
  insertarCaja: (params: InsertarCajaParams) => Promise<Caja | null>
  editarCaja: (params: EditarCajaParams) => Promise<void>
  eliminarCaja: (params: EliminarCajaParams) => Promise<void>
}

type CajasStore = CajasState & CajasActions

export const useCajasStore = create<CajasStore>((set) => ({
  // State
  stateCaja: false,
  accion: '',
  cajaSelectItem: null,
  dataCaja: null,

  // Actions
  setStateCaja: (p) => set({ stateCaja: p }),
  setAccion: (p) => set({ accion: p }),
  setCajaSelectItem: (p) => set({ cajaSelectItem: p }),

  mostrarCajaXSucursal: async (p) => {
    const response = await MostrarCajaXSucursal(p)
    set({
      cajaSelectItem: (response && response[0]) ?? null,
      dataCaja: response,
    })
    return response
  },

  insertarCaja: async (p) => {
    const { error, data } = await supabase.from(tabla).insert(p).select().maybeSingle()

    if (error) {
      throw new Error(error.message)
    }
    return data
  },

  editarCaja: async (p) => {
    await EditarCaja(p)
  },

  eliminarCaja: async (p) => {
    await EliminarCaja(p)
  },
}))
