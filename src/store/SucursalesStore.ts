import { create } from 'zustand'

import {
  EditarSucursal,
  EliminarSucursal,
  InsertarSucursal,
  MostrarCajasXSucursal,
  MostrarSucursales,
} from '../supabase/crudSucursales'
import type {
  Caja,
  EditarSucursalParams,
  EliminarSucursalParams,
  IdEmpresaParam,
  InsertarSucursalParams,
  MostrarSucursalesParams,
  Sucursal,
} from '../types'

interface SucursalesState {
  stateSucursal: boolean
  accion: string
  sucursalesItemSelect: Sucursal | null
  dataSucursales: Sucursal[] | null
}

interface SucursalesActions {
  setStateSucursal: (state: boolean) => void
  setAccion: (action: string) => void
  selectSucursal: (sucursal: Sucursal | null) => void
  mostrarSucursales: (params: MostrarSucursalesParams) => Promise<Sucursal[]>
  mostrarCajasXSucursal: (
    params: IdEmpresaParam
  ) => Promise<(Sucursal & { caja: Caja[] })[]>
  insertarSucursal: (params: InsertarSucursalParams) => Promise<void>
  editarSucursal: (params: EditarSucursalParams) => Promise<void>
  eliminarSucursal: (params: EliminarSucursalParams) => Promise<void>
}

type SucursalesStore = SucursalesState & SucursalesActions

export const useSucursalesStore = create<SucursalesStore>((set) => ({
  // State
  stateSucursal: false,
  accion: '',
  sucursalesItemSelect: null,
  dataSucursales: null,

  // Actions
  setStateSucursal: (p) => set({ stateSucursal: p }),
  setAccion: (p) => set({ accion: p }),

  selectSucursal: (p) => {
    set({ sucursalesItemSelect: p })
  },

  mostrarSucursales: async (p) => {
    const response = await MostrarSucursales(p)
    set({
      dataSucursales: response,
      sucursalesItemSelect: (response && response[0]) ?? null,
    })
    return response ?? []
  },

  mostrarCajasXSucursal: async (p) => {
    const response = await MostrarCajasXSucursal(p)
    return response ?? []
  },

  insertarSucursal: async (p) => {
    await InsertarSucursal(p)
  },

  editarSucursal: async (p) => {
    await EditarSucursal(p)
  },

  eliminarSucursal: async (p) => {
    await EliminarSucursal(p)
  },
}))
