import { create } from 'zustand'

import { supabase } from '../supabase/supabase.config'
import type { InventarioItem, StockBajoMinimoItem } from '../types'

interface ReportStockParams {
  sucursal_id?: number
  almacen_id?: number
}

interface ReportState { }

interface ReportActions {
  reportStockPorAlmacenSucursal: (params: ReportStockParams) => Promise<InventarioItem[]>
  reportStockBajoMinimo: (params: ReportStockParams) => Promise<StockBajoMinimoItem[]>
  reportVentasPorSucursal: (
    params: { id_empresa?: number; fecha_inicio?: string; fecha_fin?: string }
  ) => Promise<unknown[]>
}

type ReportStore = ReportState & ReportActions

export const useReportStore = create<ReportStore>(() => ({
  // State - none needed for this store

  // Actions
  reportStockPorAlmacenSucursal: async (p) => {
    const { data } = await supabase.rpc('report_stock_por_almacen_sucursal', p)
    return data ?? []
  },

  reportStockBajoMinimo: async (p) => {
    const { data } = await supabase.rpc('report_stock_bajo_minimo', p)
    return data ?? []
  },

  reportVentasPorSucursal: async (p) => {
    const { data } = await supabase.rpc('report_ventas_por_sucursal', p)
    return data ?? []
  },
}))
