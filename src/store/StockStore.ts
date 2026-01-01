import { create } from 'zustand'

import {
  EditarStock,
  InsertarStock,
  MostrarStockXAlmacenesYProducto,
  MostrarStockXAlmacenYProducto,
} from '../supabase/crudStock'
import { supabase } from '../supabase/supabase.config'
import type { Almacen, InsertarStockParams, MostrarStockParams, Stock } from '../types'

// Local parameter type matching the CRUD file interface
interface EditarStockParams {
  _id_producto: number
  _id_almacen: number
  _cantidad: number
}

type StockConAlmacen = Stock & { almacen: Almacen }

interface StockState {
  stateModal: boolean
  dataStockXAlmacenYProducto: Stock | null
  dataStockXAlmacenesYProducto: StockConAlmacen[]
}

interface StockActions {
  setStateModal: (state: boolean) => void
  insertarStock: (params: InsertarStockParams) => Promise<void>
  mostrarStockXAlmacenYProducto: (
    params: MostrarStockParams & { id_almacen: number; id_producto: number }
  ) => Promise<Stock | null>
  mostrarStockXAlmacenesYProducto: (
    params: MostrarStockParams & { id_almacen: number; id_producto: number }
  ) => Promise<StockConAlmacen[]>
  mostrarStockPorProducto: (params: { id_producto: number }) => Promise<Stock[]>
  editarStock: (params: EditarStockParams, tipo: 'ingreso' | 'egreso') => Promise<void>
}

type StockStore = StockState & StockActions

export const useStockStore = create<StockStore>((set) => ({
  // State
  stateModal: false,
  dataStockXAlmacenYProducto: null,
  dataStockXAlmacenesYProducto: [],

  // Actions
  setStateModal: (p) => {
    set({ stateModal: p })
  },

  insertarStock: async (p) => {
    await InsertarStock(p)
  },

  mostrarStockXAlmacenYProducto: async (p) => {
    const response = await MostrarStockXAlmacenYProducto(p)
    set({ dataStockXAlmacenYProducto: response })
    return response
  },

  mostrarStockXAlmacenesYProducto: async (p) => {
    const response = await MostrarStockXAlmacenesYProducto(p)
    set({ dataStockXAlmacenesYProducto: response as StockConAlmacen[] })
    return response as StockConAlmacen[]
  },

  editarStock: async (p, tipo) => {
    await EditarStock(p, tipo)
  },

  mostrarStockPorProducto: async (p) => {
    const { data } = await supabase
      .from('stock')
      .select('*')
      .eq('id_producto', p.id_producto)
    return data as Stock[]
  },
}))
