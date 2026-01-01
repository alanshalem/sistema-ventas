import { create } from 'zustand'

import {
  EditarCantidadDetalleVenta,
  EliminarDetalleVentas,
  InsertarDetalleVentas,
  MostrarDetalleVenta,
  Mostrartop5productosmasvendidosxcantidad,
  Mostrartop10productosmasvendidosxmonto,
} from '../supabase/crudDetalleVenta'
import type {
  DetalleVenta,
  EditarDetalleVentaParams,
  EliminarDetalleVentaParams,
  IdEmpresaParam,
  InsertarDetalleVentaParams,
  MostrarDetalleVentaParams,
  Producto,
  ProductoTopVentas,
  Venta,
} from '../types'

type DetalleVentaConJoins = DetalleVenta & {
  ventas: Venta | null
  productos: Producto | null
}

function calcularTotal(items: DetalleVentaConJoins[]): number {
  return items.reduce((total, item) => total + item.precio_unitario * item.cantidad, 0)
}

interface DetalleVentasState {
  datadetalleventa: DetalleVentaConJoins[]
  parametros: Record<string, unknown>
  total: number
}

interface DetalleVentasActions {
  mostrardetalleventa: (
    params: MostrarDetalleVentaParams
  ) => Promise<DetalleVentaConJoins[] | null>
  insertarDetalleVentas: (params: InsertarDetalleVentaParams) => Promise<void>
  eliminardetalleventa: (params: EliminarDetalleVentaParams) => Promise<void>
  mostrartop5productosmasvendidosxcantidad: (
    params: IdEmpresaParam
  ) => Promise<ProductoTopVentas[] | null>
  mostrartop10productosmasvendidosxmonto: (
    params: IdEmpresaParam
  ) => Promise<ProductoTopVentas[] | null>
  editarCantidadDetalleVenta: (params: EditarDetalleVentaParams) => Promise<void>
}

type DetalleVentasStore = DetalleVentasState & DetalleVentasActions

export const useDetalleVentasStore = create<DetalleVentasStore>((set) => ({
  // State
  datadetalleventa: [],
  parametros: {},
  total: 0,

  // Actions
  mostrardetalleventa: async (p) => {
    const response = await MostrarDetalleVenta(p)
    set({
      datadetalleventa: response ?? [],
      total: calcularTotal(response ?? []),
    })
    return response
  },

  insertarDetalleVentas: async (p) => {
    await InsertarDetalleVentas(p)
  },

  eliminardetalleventa: async (p) => {
    await EliminarDetalleVentas(p)
  },

  mostrartop5productosmasvendidosxcantidad: async (p) => {
    const response = await Mostrartop5productosmasvendidosxcantidad(p)
    return response
  },

  mostrartop10productosmasvendidosxmonto: async (p) => {
    const response = await Mostrartop10productosmasvendidosxmonto(p)
    return response
  },

  editarCantidadDetalleVenta: async (p) => {
    await EditarCantidadDetalleVenta(p)
  },
}))
