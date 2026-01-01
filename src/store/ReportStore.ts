import { create } from 'zustand'

import { supabase } from '../supabase/supabase.config'
import type { IdEmpresaParam } from '../types'

interface ReportState { }

interface ReportActions {
  reportStockPorAlmacenSucursal: (params: IdEmpresaParam) => Promise<unknown[]>
  reportStockBajoMinimo: (params: IdEmpresaParam) => Promise<unknown[]>
  reportVentasPorSucursal: (
    params: IdEmpresaParam & { fecha_inicio?: string; fecha_fin?: string }
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
