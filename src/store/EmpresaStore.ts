import { create } from 'zustand'

import {
  EditarEmpresa,
  EditarMonedaEmpresa,
  InsertarEmpresa,
  MostrarEmpresaXidsuario,
} from '../index'
import type {
  EditarEmpresaParams,
  InsertarEmpresaParams,
  MostrarEmpresaXIdUsuarioParams,
} from '../types/crud'
import type { Empresa } from '../types/database'

interface EmpresaState {
  dataempresa: Empresa | null
}

interface EmpresaActions {
  mostrarempresa: (params: MostrarEmpresaXIdUsuarioParams) => Promise<Empresa | null>
  insertarempresa: (params: InsertarEmpresaParams) => Promise<void>
  editarEmpresa: (
    params: EditarEmpresaParams,
    fileOld: string | File,
    fileNew: string | File
  ) => Promise<void>
  editarMonedaEmpresa: (params: EditarEmpresaParams) => Promise<void>
}

type EmpresaStore = EmpresaState & EmpresaActions

export const useEmpresaStore = create<EmpresaStore>((set) => ({
  dataempresa: null,
  mostrarempresa: async (p: MostrarEmpresaXIdUsuarioParams): Promise<Empresa | null> => {
    const response = await MostrarEmpresaXidsuario(p)
    set({ dataempresa: response })
    return response
  },
  insertarempresa: async (p: InsertarEmpresaParams): Promise<void> => {
    const response = await InsertarEmpresa(p)
    console.log('respuesta empresa', response)
  },
  editarEmpresa: async (
    p: EditarEmpresaParams,
    fileOld: string | File,
    fileNew: string | File
  ): Promise<void> => {
    await EditarEmpresa(p, fileOld, fileNew)
  },
  editarMonedaEmpresa: async (p: EditarEmpresaParams): Promise<void> => {
    await EditarMonedaEmpresa(p)
  },
}))
