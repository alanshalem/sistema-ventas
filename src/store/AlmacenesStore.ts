import { create } from 'zustand'

import {
  EditarAlmacen,
  EliminarAlmacen,
  InsertarAlmacen,
  MostrarAlmacenesXEmpresa,
  MostrarAlmacenesXSucursal,
  MostrarAlmacenXSucursal,
} from '../index'
import type {
  EditarAlmacenParams,
  EliminarAlmacenParams,
  InsertarAlmacenParams,
  MostrarAlmacenesXEmpresaParams,
  MostrarAlmacenesXSucursalParams,
  MostrarAlmacenXSucursalParams,
} from '../types/crud'
import type { Almacen, Sucursal } from '../types/database'

interface AlmacenesState {
  stateAlmacen: boolean
  accion: string
  almacenSelectItem: Almacen | null
  dataalmacen: Almacen[]
  dataalmacenxsucursalxproducto: (Sucursal & { almacen: Almacen[] })[] | null
  dataAlmacenesXempresa: (Sucursal & { almacen: Almacen[] })[] | null
  dataAlmacenesXsucursal: Almacen[] | null
}

interface AlmacenesActions {
  setStateAlmacen: (state: boolean) => void
  setAccion: (accion: string) => void
  setAlmacenSelectItem: (item: Almacen | null) => void
  mostrarAlmacenXsucursal: (
    params: MostrarAlmacenXSucursalParams
  ) => Promise<Almacen | null>
  mostrarAlmacenesXEmpresa: (
    params: MostrarAlmacenesXEmpresaParams
  ) => Promise<(Sucursal & { almacen: Almacen[] })[] | null>
  mostrarAlmacenesXSucursal: (
    params: MostrarAlmacenesXSucursalParams
  ) => Promise<Almacen[] | null>
  insertarAlmacen: (params: InsertarAlmacenParams) => Promise<void>
  eliminarAlmacen: (params: EliminarAlmacenParams) => Promise<void>
  editarAlmacen: (params: EditarAlmacenParams) => Promise<void>
}

type AlmacenesStore = AlmacenesState & AlmacenesActions

export const useAlmacenesStore = create<AlmacenesStore>((set) => ({
  stateAlmacen: false,
  setStateAlmacen: (state: boolean): void => set({ stateAlmacen: state }),
  accion: '',
  setAccion: (accion: string): void => set({ accion: accion }),
  almacenSelectItem: null,
  setAlmacenSelectItem: (item: Almacen | null): void => {
    set({ almacenSelectItem: item })
  },

  dataalmacen: [],
  dataalmacenxsucursalxproducto: null,

  mostrarAlmacenXsucursal: async (
    params: MostrarAlmacenXSucursalParams
  ): Promise<Almacen | null> => {
    const response = await MostrarAlmacenXSucursal(params)
    set({ almacenSelectItem: response })
    return response
  },
  dataAlmacenesXempresa: null,
  mostrarAlmacenesXEmpresa: async (
    params: MostrarAlmacenesXEmpresaParams
  ): Promise<(Sucursal & { almacen: Almacen[] })[] | null> => {
    const response = await MostrarAlmacenesXEmpresa(params)
    set({ dataAlmacenesXempresa: response })
    return response
  },
  dataAlmacenesXsucursal: null,
  mostrarAlmacenesXSucursal: async (
    params: MostrarAlmacenesXSucursalParams
  ): Promise<Almacen[] | null> => {
    const response = await MostrarAlmacenesXSucursal(params)
    set({ dataAlmacenesXsucursal: response })
    set({ almacenSelectItem: response?.[0] ?? null })
    return response
  },

  insertarAlmacen: async (params: InsertarAlmacenParams): Promise<void> => {
    await InsertarAlmacen(params)
  },
  eliminarAlmacen: async (params: EliminarAlmacenParams): Promise<void> => {
    await EliminarAlmacen(params)
  },
  editarAlmacen: async (params: EditarAlmacenParams): Promise<void> => {
    await EditarAlmacen(params)
  },
}))
