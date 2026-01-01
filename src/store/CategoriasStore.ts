import { create } from 'zustand'

import {
  BuscarCategorias,
  EditarCategorias,
  EliminarCategorias,
  InsertarCategorias,
  MostrarCategorias,
} from '../index'
import type {
  EditarCategoriaParams,
  IdParam,
  InsertarCategoriaParams,
  MostrarCategoriasParams,
} from '../types/crud'
import type { Categoria } from '../types/database'

interface CategoriasState {
  buscador: string
  datacategorias: Categoria[]
  categoriaItemSelect: Categoria | null
  parametros: MostrarCategoriasParams
}

interface CategoriasActions {
  setBuscador: (value: string) => void
  mostrarCategorias: (params: MostrarCategoriasParams) => Promise<Categoria[]>
  selectCategoria: (categoria: Categoria) => void
  insertarCategorias: (params: InsertarCategoriaParams, file?: File) => Promise<void>
  eliminarCategoria: (params: IdParam) => Promise<void>
  editarCategoria: (
    params: EditarCategoriaParams,
    fileOld?: string | File,
    fileNew?: string | File
  ) => Promise<void>
  buscarCategorias: (params: {
    id_empresa: number
    descripcion: string
  }) => Promise<Categoria[]>
}

type CategoriasStore = CategoriasState & CategoriasActions

export const useCategoriasStore = create<CategoriasStore>((set, get) => ({
  buscador: '',
  setBuscador: (p: string): void => {
    set({ buscador: p })
  },
  datacategorias: [],
  categoriaItemSelect: null,
  parametros: {} as MostrarCategoriasParams,
  mostrarCategorias: async (p: MostrarCategoriasParams): Promise<Categoria[]> => {
    const response = await MostrarCategorias(p)
    set({ parametros: p })
    set({ datacategorias: response ?? [] })
    set({ categoriaItemSelect: response?.[0] ?? null })
    return response ?? []
  },
  selectCategoria: (p: Categoria): void => {
    set({ categoriaItemSelect: p })
  },
  insertarCategorias: async (p: InsertarCategoriaParams, file?: File): Promise<void> => {
    await InsertarCategorias(p, file)
    const { mostrarCategorias } = get()
    const { parametros } = get()
    await mostrarCategorias(parametros)
  },
  eliminarCategoria: async (p: IdParam): Promise<void> => {
    await EliminarCategorias(p)
    const { mostrarCategorias } = get()
    const { parametros } = get()
    await mostrarCategorias(parametros)
  },
  editarCategoria: async (
    p: EditarCategoriaParams,
    fileOld?: string | File,
    fileNew?: string | File
  ): Promise<void> => {
    const rpcParams = {
      _id: p.id,
      _nombre: p.nombre,
      _descripcion: p.descripcion,
      _id_empresa: p.id_empresa,
    }
    await EditarCategorias(rpcParams, fileOld ?? '-', fileNew ?? '-')
    const { mostrarCategorias } = get()
    const { parametros } = get()
    await mostrarCategorias(parametros)
  },
  buscarCategorias: async (p: {
    id_empresa: number
    descripcion: string
  }): Promise<Categoria[]> => {
    const response = await BuscarCategorias(p)
    set({ datacategorias: response ?? [] })
    return response ?? []
  },
}))
