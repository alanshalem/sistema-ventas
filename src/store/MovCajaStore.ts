import { create } from 'zustand'

import {
  InsertarMovCaja,
  MostrarEfectivoSinVentasMovcierrecaja,
  Mostrarmovimientoscajalive,
  MostrarVentasMetodoPagoMovCaja,
} from '../supabase/crudMovimientosCaja'
import type { InsertarMovimientoCajaParams } from '../types'

// Local parameter types matching the CRUD file interfaces
interface SumarEfectivoSinVentasParams {
  _id_cierre_caja: number
}

interface SumarVentasMetodoPagoParams {
  _id_cierre_caja: number
  _id_metodo_pago: number
}

interface MostrarMovimientosCajaLiveParams {
  _id_cierre_caja: number
}

interface MovCajaState {
  totalVentasMetodoPago: number
  totalVentasEfectivo: number
  totalAperturaCaja: number
  totalGastosVariosCaja: number
  totalIngresosVariosCaja: number
  totalEfectivoCajaSinVentas: number
  totalEfectivoTotalCaja: number
}

interface MovCajaActions {
  updateTotalEfectivoTotalCaja: () => void
  setTotalEfectivoCajaSinVentas: (amount: number) => void
  setTotalVentasEfectivo: (amount: number) => void
  insertarMovCaja: (params: InsertarMovimientoCajaParams) => Promise<void>
  mostrarEfectivoSinVentasMovcierrecaja: (
    params: SumarEfectivoSinVentasParams
  ) => Promise<number>
  mostrarVentasMetodoPagoMovCaja: (params: SumarVentasMetodoPagoParams) => Promise<number>
  mostrarmovimientoscajalive: (
    params: MostrarMovimientosCajaLiveParams
  ) => Promise<unknown[]>
}

type MovCajaStore = MovCajaState & MovCajaActions

export const useMovCajaStore = create<MovCajaStore>((set, get) => ({
  // State
  totalVentasMetodoPago: 0,
  totalVentasEfectivo: 0,
  totalAperturaCaja: 0,
  totalGastosVariosCaja: 0,
  totalIngresosVariosCaja: 0,
  totalEfectivoCajaSinVentas: 0,
  totalEfectivoTotalCaja: 0,

  // Actions
  updateTotalEfectivoTotalCaja: () => {
    const { totalEfectivoCajaSinVentas, totalVentasEfectivo } = get()
    const total = totalEfectivoCajaSinVentas + totalVentasEfectivo
    set({ totalEfectivoTotalCaja: total })
  },

  setTotalEfectivoCajaSinVentas: (p) => {
    set({ totalEfectivoCajaSinVentas: p })
    get().updateTotalEfectivoTotalCaja() //recalcular el total
  },

  setTotalVentasEfectivo: (p) => {
    set({ totalVentasEfectivo: p })
    get().updateTotalEfectivoTotalCaja() //recalcular el total
  },

  insertarMovCaja: async (p) => {
    await InsertarMovCaja(p)
  },

  mostrarEfectivoSinVentasMovcierrecaja: async (p) => {
    const result = await MostrarEfectivoSinVentasMovcierrecaja(p)
    const total = result ?? 0
    set({ totalEfectivoCajaSinVentas: total })
    get().setTotalEfectivoCajaSinVentas(total)
    return total
  },

  mostrarVentasMetodoPagoMovCaja: async (p) => {
    const result = await MostrarVentasMetodoPagoMovCaja(p)
    const total = result ?? 0
    set({ totalVentasMetodoPago: total })
    // For simplicity, assuming all are cash sales, adjust as needed
    set({ totalVentasEfectivo: total })
    get().setTotalVentasEfectivo(total)
    return total
  },

  mostrarmovimientoscajalive: async (p) => {
    const response = await Mostrarmovimientoscajalive(p)
    return response ?? []
  },
}))
