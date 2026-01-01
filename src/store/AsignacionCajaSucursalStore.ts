import { create } from 'zustand'

import {
  BuscarUsuariosAsignados,
  InsertarAsignacionCajaSucursal,
  MostrarUsuariosAsignados,
} from '../supabase/crudAsignacionCajaSucursal'
import { supabase } from '../supabase/supabase.config'
import type { AsignacionCajaSucursal, Caja, IdUsuarioParam, Sucursal } from '../types'

const tabla = 'asignacion_sucursal'

interface AsignacionCajaSucursalState {
  buscador: string
  accion: string
  selectItem: AsignacionCajaSucursal | null
  dataSucursalesAsignadas:
    | (AsignacionCajaSucursal & {
        sucursales: Sucursal
        caja: Caja
      })[]
    | null
  sucursalesItemSelectAsignadas:
    | (AsignacionCajaSucursal & {
        sucursales: Sucursal
        caja: Caja
      })
    | null
  datausuariosAsignados: unknown[]
}

interface AsignacionCajaSucursalActions {
  setBuscador: (text: string) => void
  setAccion: (action: string) => void
  setSelectItem: (item: AsignacionCajaSucursal | null) => void
  mostrarSucursalAsignadas: (params: IdUsuarioParam) => Promise<
    | (AsignacionCajaSucursal & {
        sucursales: Sucursal
        caja: Caja
      })[]
    | null
  >
  mostrarUsuariosAsignados: (params: { id_empresa: number }) => Promise<unknown[]>
  buscarUsuariosAsignados: (params: {
    id_empresa: number
    busqueda: string
  }) => Promise<unknown[]>
  insertarAsignacionSucursal: (params: Partial<AsignacionCajaSucursal>) => Promise<void>
}

type AsignacionCajaSucursalStore = AsignacionCajaSucursalState &
  AsignacionCajaSucursalActions

export const useAsignacionCajaSucursalStore = create<AsignacionCajaSucursalStore>(
  (set) => ({
    // State
    buscador: '',
    accion: '',
    selectItem: null,
    dataSucursalesAsignadas: null,
    sucursalesItemSelectAsignadas: null,
    datausuariosAsignados: [],

    // Actions
    setBuscador: (p) => set({ buscador: p }),
    setAccion: (p) => set({ accion: p }),
    setSelectItem: (p) => set({ selectItem: p }),

    mostrarSucursalAsignadas: async (p) => {
      const { data } = await supabase
        .from(tabla)
        .select(`*, sucursales(*), caja(*)`)
        .eq('id_usuario', p.id_usuario)

      set({
        dataSucursalesAsignadas: data,
        sucursalesItemSelectAsignadas: (data && data[0]) ?? null,
      })
      return data
    },

    mostrarUsuariosAsignados: async (p) => {
      const response = await MostrarUsuariosAsignados(p)
      set({ datausuariosAsignados: response ?? [] })
      return response ?? []
    },

    buscarUsuariosAsignados: async (p) => {
      const response = await BuscarUsuariosAsignados(p)
      set({ datausuariosAsignados: response ?? [] })
      return response ?? []
    },

    insertarAsignacionSucursal: async (p) => {
      if (p.id_sucursal && p.id_caja && p.id_usuario) {
        const params = {
          id_sucursal: p.id_sucursal,
          id_caja: p.id_caja,
          id_usuario: p.id_usuario,
        }
        await InsertarAsignacionCajaSucursal(params)
      }
    },
  })
)
