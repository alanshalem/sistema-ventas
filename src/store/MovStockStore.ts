import { create } from 'zustand'

import { InsertarMovStock, MostrarMovStock } from '../supabase/crudMovStock'
import type {
  Almacen,
  InsertarMovimientoStockParams,
  MostrarMovimientosStockParams,
  MovimientoStock,
  Sucursal,
} from '../types'

type MovimientoStockConJoins = MovimientoStock & {
  almacen: Almacen & { sucursales: Sucursal }
}

interface MovStockState {
  tipo: 'entrada' | 'salida' | 'ajuste'
}

interface MovStockActions {
  setTipo: (tipo: 'entrada' | 'salida' | 'ajuste') => void
  insertarMovStock: (params: InsertarMovimientoStockParams) => Promise<void>
  mostrarMovStock: (
    params: MostrarMovimientosStockParams
  ) => Promise<MovimientoStockConJoins[]>
}

type MovStockStore = MovStockState & MovStockActions

export const useMovStockStore = create<MovStockStore>((set) => ({
  // State
  tipo: 'entrada',

  // Actions
  setTipo: (p) => {
    set({ tipo: p })
  },

  insertarMovStock: async (p) => {
    await InsertarMovStock(p)
  },

  mostrarMovStock: async (p) => {
    const result = await MostrarMovStock({
      id_empresa: p.id_empresa,
      id_producto: p.id_producto ?? 0,
    })
    return result as MovimientoStockConJoins[]
  },
}))
