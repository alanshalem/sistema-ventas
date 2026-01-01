import { create } from 'zustand'

import {
  EditarMetodosPago,
  EliminarMetodosPago,
  InsertarMetodosPago,
  MostrarMetodosPago,
} from '../supabase/crudMetodosPago'
import type {
  EditarMetodoPagoParams,
  EliminarMetodoPagoParams,
  InsertarMetodoPagoParams,
  MetodoPago,
  MostrarMetodosPagoParams,
} from '../types'

interface MetodosPagoState {
  dataMetodosPago: MetodoPago[] | null
  metodosPagoItemSelect: MetodoPago[]
}

interface MetodosPagoActions {
  mostrarMetodosPago: (params: MostrarMetodosPagoParams) => Promise<MetodoPago[]>
  selectMetodosPago: (methods: MetodoPago[]) => void
  insertarMetodosPago: (params: InsertarMetodoPagoParams, file?: File) => Promise<void>
  eliminarMetodosPago: (params: EliminarMetodoPagoParams) => Promise<void>
  editarMetodosPago: (
    params: EditarMetodoPagoParams,
    fileold?: string | File,
    filenew?: File
  ) => Promise<void>
}

type MetodosPagoStore = MetodosPagoState & MetodosPagoActions

export const useMetodosPagoStore = create<MetodosPagoStore>((set) => ({
  // State
  dataMetodosPago: null,
  metodosPagoItemSelect: [],

  // Actions
  mostrarMetodosPago: async (p) => {
    const response = await MostrarMetodosPago(p)
    set({ dataMetodosPago: response })
    return response ?? []
  },

  selectMetodosPago: (p) => {
    set({ metodosPagoItemSelect: p })
  },

  insertarMetodosPago: async (p, file) => {
    file // Avoid unused parameter warning
    await InsertarMetodosPago(p, file)
  },

  eliminarMetodosPago: async (p) => {
    await EliminarMetodosPago(p)
  },

  editarMetodosPago: async (p, fileold, filenew) => {
    await EditarMetodosPago(p, fileold ?? '-', filenew ?? '-')
  },
}))
