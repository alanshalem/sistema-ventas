import { toast } from 'sonner'
import { create } from 'zustand'

import {
  EliminarVenta,
  EliminarVentasIncompletas,
  InsertarVentas,
  MostrarVentasXsucursal,
} from '../supabase/crudVenta'
import { supabase } from '../supabase/supabase.config'
import type {
  ConfirmarVentaParams,
  EliminarVentasIncompletasParams,
  IdParam,
  InsertarVentaParams,
  MostrarVentasXSucursalParams,
  Venta,
} from '../types'
import { useClientesProveedoresStore } from './ClientesProveedoresStore'

const initialState = {
  items: [] as unknown[],
  total: 0,
  statePantallaCobro: false,
  tipocobro: '',
  stateMetodosPago: false,
  idventa: 0,
}

interface VentasState {
  porcentajeCambio: number
  dataventas: Venta[]
  idventa: number
}

interface VentasActions {
  resetState: () => void
  setStatePantallaCobro: (params: { data: unknown[]; tipocobro: string }) => void
  setStateMetodosPago: () => void
  insertarVentas: (params: InsertarVentaParams) => Promise<Venta | null>
  eliminarventasIncompletas: (params: EliminarVentasIncompletasParams) => Promise<void>
  eliminarVenta: (params: IdParam) => Promise<void>
  mostrarventasxsucursal: (params: MostrarVentasXSucursalParams) => Promise<Venta | null>
  confirmarVenta: (params: ConfirmarVentaParams) => Promise<Venta | null>
}

type VentasStore = typeof initialState & VentasState & VentasActions

export const useVentasStore = create<VentasStore>((set, get) => ({
  ...initialState,
  porcentajeCambio: 0,
  dataventas: [],

  resetState: () => {
    const clientStore = useClientesProveedoresStore.getState() as unknown as {
      selectCliPro: (data: unknown[]) => void
    }
    clientStore.selectCliPro([])
    set(initialState)
  },

  setStatePantallaCobro: (p) =>
    set((state) => {
      if (p.data.length === 0) {
        toast.warning('Agrega productos, no seas puerco')
        return {
          state,
        }
      } else {
        return {
          statePantallaCobro: !state.statePantallaCobro,
          tipocobro: p.tipocobro,
        }
      }
    }),

  setStateMetodosPago: () =>
    set((state) => ({ stateMetodosPago: !state.stateMetodosPago })),

  insertarVentas: async (p) => {
    const result = await InsertarVentas(p)
    set({ idventa: result?.id ?? 0 })
    return result
  },

  eliminarventasIncompletas: async (p) => {
    await EliminarVentasIncompletas(p)
  },

  eliminarVenta: async (p) => {
    const { resetState } = get()
    await EliminarVenta(p)
    resetState()
  },

  mostrarventasxsucursal: async (p) => {
    const response = await MostrarVentasXsucursal(p)
    set({ dataventas: response ? [response] : [] })
    set({ idventa: response?.id ?? 0 })
    return response
  },

  confirmarVenta: async (p) => {
    const { error, data } = await supabase
      .rpc('confirmar_venta', p)
      .select()
      .maybeSingle()
    if (error) {
      throw new Error(error.message)
    }

    return data as Venta | null
  },
}))
