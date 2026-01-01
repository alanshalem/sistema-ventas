import { create } from 'zustand'

import {
  BuscarProductos,
  EditarProductos,
  EliminarProductos,
  Generarcodigo,
  InsertarProductos,
  MostrarProductos,
  supabase,
} from '../index'
import type {
  BuscarProductoParams,
  EditarProductoParams,
  IdParam,
  InsertarProductoParams,
  MostrarProductosParams,
} from '../types/crud'
import type { Producto } from '../types/database'

interface ProductoExtendido extends Producto {
  categorias?: {
    id: number
    nombre: string
    icono?: string
  } | null
  stock_info?: unknown
  maneja_inventarios?: boolean
}

interface ProductosState {
  refetchs: unknown
  buscador: string
  dataProductos: ProductoExtendido[]
  productosItemSelect: ProductoExtendido | null
  parametros: MostrarProductosParams & { refetchs?: unknown }
  codigogenerado: string
}

interface ProductosActions {
  setBuscador: (value: string) => void
  mostrarProductos: (
    params: MostrarProductosParams & { refetchs?: unknown }
  ) => Promise<ProductoExtendido[]>
  selectProductos: (producto: ProductoExtendido) => void
  resetProductosItemSelect: () => void
  insertarProductos: (params: InsertarProductoParams) => Promise<number>
  eliminarProductos: (params: IdParam) => Promise<void>
  editarProductos: (params: EditarProductoParams) => Promise<void>
  buscarProductos: (params: BuscarProductoParams) => Promise<ProductoExtendido[]>
  editarPreciosProductos: (params: Partial<Producto> & { id: number }) => Promise<void>
}

type ProductosStore = ProductosState & ProductosActions

const tabla = 'productos'

export const useProductosStore = create<ProductosStore>((set, get) => ({
  refetchs: null,
  buscador: '',
  setBuscador: (p: string): void => {
    set({ buscador: p })
  },
  dataProductos: [],
  productosItemSelect: null,
  parametros: {} as MostrarProductosParams,
  mostrarProductos: async (p): Promise<ProductoExtendido[]> => {
    const response = await MostrarProductos(p)
    set({ parametros: p })
    set({ dataProductos: response ?? [] })
    set({ productosItemSelect: response?.[0] ?? null })
    set({ refetchs: p.refetchs })
    return response ?? []
  },
  selectProductos: (p: ProductoExtendido): void => {
    set({ productosItemSelect: p })
  },
  resetProductosItemSelect: (): void => {
    set({ productosItemSelect: null })
  },
  insertarProductos: async (p: InsertarProductoParams): Promise<number> => {
    const response = await InsertarProductos(p)
    const { mostrarProductos } = get()
    const { parametros } = get()
    await mostrarProductos(parametros)
    return response
  },
  eliminarProductos: async (p: IdParam): Promise<void> => {
    await EliminarProductos(p)
    const { mostrarProductos } = get()
    const { parametros } = get()
    await mostrarProductos(parametros)
  },
  editarProductos: async (p: EditarProductoParams): Promise<void> => {
    await EditarProductos(p)
    const { mostrarProductos } = get()
    const { parametros } = get()
    await mostrarProductos(parametros)
  },
  buscarProductos: async (p: BuscarProductoParams): Promise<ProductoExtendido[]> => {
    const response = await BuscarProductos(p)
    set({ dataProductos: response ?? [] })
    return response ?? []
  },
  codigogenerado: '',
  generarCodigo: (): void => {
    const response = Generarcodigo({ id: 2 })
    set({ codigogenerado: response })
  },
  editarPreciosProductos: async (
    p: Partial<Producto> & { id: number }
  ): Promise<void> => {
    const { error } = await supabase.from(tabla).update(p).eq('id', p.id)
    if (error) {
      throw new Error(error.message)
    }
  },
}))
