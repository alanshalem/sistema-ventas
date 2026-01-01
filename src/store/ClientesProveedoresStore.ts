import { create } from 'zustand'

import {
  BuscarClientesProveedores,
  EditarClientesProveedores,
  EliminarClientesProveedores,
  InsertarClientesProveedores,
  MostrarClientesProveedores,
} from '../supabase/crudClientesProveedores'
import type { Cliente, IdParam, Proveedor } from '../types'

// Local parameter types matching the CRUD file interfaces
interface MostrarClientesProveedoresParams {
  id_empresa: number
  tipo: 'cliente' | 'proveedor'
}

interface InsertarClientesProveedoresParams {
  nombres: string
  documento?: string
  tipo_documento?: string
  email?: string
  telefono?: string
  direccion?: string
  tipo: 'cliente' | 'proveedor'
  id_empresa: number
}

interface EditarClientesProveedoresParams {
  _id: number
  _nombres?: string
  _documento?: string
  _tipo_documento?: string
  _email?: string
  _telefono?: string
  _direccion?: string
}

interface BuscarClientesProveedoresParams {
  id_empresa: number
  tipo: 'cliente' | 'proveedor'
  buscador: string
}

type ClienteOProveedor = Cliente | Proveedor

interface ClientesProveedoresState {
  tipo: 'cliente' | 'proveedor'
  buscador: string
  dataclipro: ClienteOProveedor[]
  cliproItemSelect: ClienteOProveedor | null
  parametros: MostrarClientesProveedoresParams
}

interface ClientesProveedoresActions {
  setTipo: (tipo: 'cliente' | 'proveedor') => void
  setBuscador: (text: string) => void
  mostrarCliPro: (
    params: MostrarClientesProveedoresParams
  ) => Promise<ClienteOProveedor[]>
  selectCliPro: (item: ClienteOProveedor | null) => void
  insertarCliPro: (
    params: InsertarClientesProveedoresParams,
    file?: File
  ) => Promise<void>
  eliminarCliPro: (params: IdParam) => Promise<void>
  editarCliPro: (
    params: EditarClientesProveedoresParams,
    fileold?: File,
    filenew?: File
  ) => Promise<void>
  buscarCliPro: (params: BuscarClientesProveedoresParams) => Promise<ClienteOProveedor[]>
}

type ClientesProveedoresStore = ClientesProveedoresState & ClientesProveedoresActions

export const useClientesProveedoresStore = create<ClientesProveedoresStore>(
  (set, get) => ({
    // State
    tipo: 'cliente',
    buscador: '',
    dataclipro: [],
    cliproItemSelect: null,
    parametros: { id_empresa: 0, tipo: 'cliente' },

    // Actions
    setTipo: (p) => set({ tipo: p }),

    setBuscador: (p) => {
      set({ buscador: p })
    },

    mostrarCliPro: async (p) => {
      const response = await MostrarClientesProveedores(p)
      set({ parametros: p, dataclipro: response ?? [] })
      // set({ cliproItemSelect: response && response[0] ?? null });
      return response ?? []
    },

    selectCliPro: (p) => {
      set({ cliproItemSelect: p })
    },

    insertarCliPro: async (p, file) => {
      file // Avoid unused parameter warning
      await InsertarClientesProveedores(p)
      const { mostrarCliPro, parametros } = get()
      await mostrarCliPro(parametros)
    },

    eliminarCliPro: async (p) => {
      await EliminarClientesProveedores(p)
      const { mostrarCliPro, parametros } = get()
      await mostrarCliPro(parametros)
    },

    editarCliPro: async (p, fileold, filenew) => {
      fileold // Avoid unused parameter warning
      filenew // Avoid unused parameter warning
      await EditarClientesProveedores(p)
      const { mostrarCliPro, parametros } = get()
      await mostrarCliPro(parametros)
    },

    buscarCliPro: async (p) => {
      const response = await BuscarClientesProveedores(p)
      set({ dataclipro: response ?? [] })
      return response ?? []
    },
  })
)
