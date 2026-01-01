import { create } from 'zustand'

import { supabase } from '../supabase/supabase.config'
import type { IdEmpresaParam } from '../types'

interface ReportesState {
  totalventas: number
  totalventasAnterior: number
  porcentajeCambio: number
  totalCantidadDetalleVentas: number
  totalGanancias: number
}

interface ReportesActions {
  resetearventas: () => void
  mostrarVentasDashboard: (
    params: IdEmpresaParam & { fecha_inicio?: string; fecha_fin?: string }
  ) => Promise<unknown[]>
  mostrarCantidadDetalleVentasDashboard: (
    params: IdEmpresaParam & { fecha_inicio?: string; fecha_fin?: string }
  ) => Promise<unknown>
  mostrarVentasDashboardPeriodoAnterior: (
    params: IdEmpresaParam & { fecha_inicio?: string; fecha_fin?: string }
  ) => Promise<unknown>
  mostrarGananciasDetalleVenta: (
    params: IdEmpresaParam & { fecha_inicio?: string; fecha_fin?: string }
  ) => Promise<unknown>
  setCalcularPorcentajeCambio: () => void
}

type ReportesStore = ReportesState & ReportesActions

export const useReportesStore = create<ReportesStore>((set, get) => ({
  // State
  totalventas: 0,
  totalventasAnterior: 0,
  porcentajeCambio: 0,
  totalCantidadDetalleVentas: 0,
  totalGanancias: 0,

  // Actions
  resetearventas: () => {
    // This function seems incomplete - kept for compatibility
  },

  mostrarVentasDashboard: async (p) => {
    const { data } = await supabase.rpc('dashboartotalventasconfechas', p)
    // Calcular el total general en el frontend
    const totalGeneral = (data as { total_ventas: number }[]).reduce(
      (sum, venta) => sum + Number(venta.total_ventas),
      0
    )
    set({ totalventas: totalGeneral })
    get().setCalcularPorcentajeCambio()
    return data ?? []
  },

  mostrarCantidadDetalleVentasDashboard: async (p) => {
    const { data } = await supabase.rpc('dashboardsumarcantidaddetalleventa', p)
    set({ totalCantidadDetalleVentas: data as number })
    return data
  },

  mostrarVentasDashboardPeriodoAnterior: async (p) => {
    const { data, error } = await supabase.rpc(
      'dashboardsumarventasporempresaperiodoanterior',
      p
    )
    set({ totalventasAnterior: data as number })
    get().setCalcularPorcentajeCambio()
    if (error) {
      throw new Error(error.message)
    }
    return data
  },

  mostrarGananciasDetalleVenta: async (p) => {
    const { data, error } = await supabase.rpc('dashboardsumargananciadetalleventa', p)
    if (error) {
      throw new Error(error.message)
    }
    set({ totalGanancias: data as number })
    return data
  },

  setCalcularPorcentajeCambio: () => {
    const { totalventas, totalventasAnterior } = get()

    const result =
      totalventasAnterior > 0
        ? ((totalventas - totalventasAnterior) / totalventasAnterior) * 100
        : 0
    set({ porcentajeCambio: parseFloat(result.toFixed(2)) }) // Limita a 2 decimales y convierte a número
  },
}))
