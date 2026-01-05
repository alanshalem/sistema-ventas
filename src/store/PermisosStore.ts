import { create } from 'zustand'

import {
  EliminarPermisos,
  MostrarPermisos,
  MostrarPermisosConfiguracion,
  MostrarPermisosDefault,
  MostrarPermisosGlobales,
} from '../supabase/crudPermisos'
import type {
  EliminarPermisosParams,
  InsertarPermisoParams,
  Modulo,
  MostrarPermisosParams,
  Permiso,
} from '../types'

interface PermisosState {
  datapermisos: (Permiso & { idmodulo?: number })[]
  selectedModules: number[]
  dataPermisosGlobales: (Permiso & { modulos: Modulo | null })[] | null
  dataPermisosConfiguracion: (Permiso & { modulos: Modulo | null })[]
}

interface PermisosActions {
  setSelectedModules: (modules: number[]) => void
  toggleModule: (moduleId: number) => void
  mostrarPermisos: (
    params: MostrarPermisosParams
  ) => Promise<(Permiso & { modulos: Modulo | null })[]>
  mostrarPermisosDefault: () => Promise<unknown[]>
  eliminarPermisos: (params: EliminarPermisosParams) => Promise<void>
  actualizarPermisos: (params: InsertarPermisoParams) => Promise<void>
  mostrarPermisosGlobales: (
    params: MostrarPermisosParams
  ) => Promise<(Permiso & { modulos: Modulo | null })[] | null>
  mostrarPermisosConfiguracion: (
    params: MostrarPermisosParams
  ) => Promise<(Permiso & { modulos: Modulo | null })[]>
}

type PermisosStore = PermisosState & PermisosActions

export const usePermisosStore = create<PermisosStore>((set, get) => ({
  // State
  datapermisos: [],
  selectedModules: [],
  dataPermisosGlobales: null,
  dataPermisosConfiguracion: [],

  // Actions
  setSelectedModules: (p) => set({ selectedModules: p }),

  toggleModule: (moduleId) => {
    const { selectedModules, datapermisos } = get()
    let updatedModules
    let updatedPermisos

    if (selectedModules.includes(moduleId)) {
      // Desmarcar: remover de ambos
      updatedModules = selectedModules.filter((id) => id !== moduleId)
      updatedPermisos = datapermisos.filter((p) => p.idmodulo !== moduleId)
    } else {
      // Marcar: add a ambos
      updatedModules = [...selectedModules, moduleId]
      updatedPermisos = [...datapermisos, { idmodulo: moduleId } as any]
    }

    set({
      selectedModules: updatedModules,
      datapermisos: updatedPermisos,
    })
  },

  mostrarPermisos: async (p) => {
    const response = await MostrarPermisos(p)
    const mappedData =
      response?.map((item) => ({
        ...item,
        idmodulo: item.modulos?.id,
      })) ?? []
    set({ datapermisos: mappedData })
    return response ?? []
  },

  mostrarPermisosDefault: async () => {
    const response = await MostrarPermisosDefault()
    return response ?? []
  },

  eliminarPermisos: async (p) => {
    await EliminarPermisos(p)
  },

  actualizarPermisos: async (p) => {
    p // Avoid unused parameter warning
    // await EliminarPermisos(p)
    // await InsertarPermisos(p)
  },

  mostrarPermisosGlobales: async (p) => {
    const response = await MostrarPermisosGlobales(p)
    const filteredResponse = response?.filter((item) => item.modulos !== null) ?? []
    set({ dataPermisosGlobales: filteredResponse })
    return filteredResponse
  },

  mostrarPermisosConfiguracion: async (p) => {
    const response = await MostrarPermisosConfiguracion(p)
    const filteredResponse = response?.filter((item) => item.modulos !== null) ?? []
    set({ dataPermisosConfiguracion: filteredResponse })
    return filteredResponse
  },
}))
