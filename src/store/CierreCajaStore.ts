import { create } from 'zustand'

import {
  AperturarCierreCaja,
  CerrarTurnoCaja,
  MostrarCierreCajaAperturada,
} from '../supabase/crudCierresCaja'
import { supabase } from '../supabase/supabase.config'
import type {
  AbrirCajaParams,
  Caja,
  CerrarCajaParams,
  CierreCaja,
  IdCajaParam,
  IdEmpresaParam,
  IdUsuarioParam,
  Sucursal,
} from '../types'

const tabla = 'cierrecaja'

interface CierreCajaState {
  stateConteoCaja: boolean
  stateIngresoSalida: boolean
  stateCierreCaja: boolean
  tipoRegistro: string
  dataCierreCaja:
  | (CierreCaja & {
    caja?: Caja & { sucursales?: Sucursal }
  })
  | null
  cierreCajaItemSelect: CierreCaja | null
}

interface CierreCajaActions {
  setStateConteoCaja: (state: boolean) => void
  setStateIngresoSalida: (state: boolean) => void
  setStateCierraCaja: (state: boolean) => void
  setTipoRegistro: (tipo: string) => void
  mostrarCierreCaja: (params: IdCajaParam) => Promise<CierreCaja | null>
  aperturarcaja: (params: AbrirCajaParams) => Promise<CierreCaja | null>
  cerrarTurnoCaja: (params: CerrarCajaParams) => Promise<void>
  mostrarCierreCajaPorEmpresa: (params: IdEmpresaParam) => Promise<unknown[]>
  mostrarCierreCajaPorUsuario: (params: IdUsuarioParam) => Promise<
    | (CierreCaja & {
      caja?: Caja & { sucursales?: Sucursal }
    })
    | null
  >
  setCierreCajaItemSelect: (item: CierreCaja | null) => void
}

type CierreCajaStore = CierreCajaState & CierreCajaActions

export const useCierreCajaStore = create<CierreCajaStore>((set) => ({
  // State
  stateConteoCaja: false,
  stateIngresoSalida: false,
  stateCierreCaja: false,
  tipoRegistro: '',
  dataCierreCaja: null,
  cierreCajaItemSelect: null,

  // Actions
  setStateConteoCaja: (p) => set({ stateConteoCaja: p }),
  setStateIngresoSalida: (p) => set({ stateIngresoSalida: p }),
  setStateCierraCaja: (p) => set({ stateCierreCaja: p }),
  setTipoRegistro: (p) => set({ tipoRegistro: p }),

  mostrarCierreCaja: async (p) => {
    const response = await MostrarCierreCajaAperturada(p)
    set({ dataCierreCaja: response })
    return response
  },

  aperturarcaja: async (p) => {
    const response = await AperturarCierreCaja(p)
    set({ dataCierreCaja: response })
    return response
  },

  cerrarTurnoCaja: async (p) => {
    await CerrarTurnoCaja(p)
  },

  mostrarCierreCajaPorEmpresa: async (p) => {
    const { data, error } = await supabase.rpc('mostrarcajasabiertasporempresa', p)

    if (error) {
      throw new Error(error.message)
    }
    return data ?? []
  },

  mostrarCierreCajaPorUsuario: async (p) => {
    const { data, error } = await supabase
      .from(tabla)
      .select(`*, caja(*,sucursales(*))`)
      .eq('id_usuario', p.id_usuario)
      .eq('estado', 0)
      .maybeSingle()
    if (error) {
      throw new Error(error.message)
    }
    set({ dataCierreCaja: data })
    return data
  },

  setCierreCajaItemSelect: (p) => {
    set({ cierreCajaItemSelect: p })
  },
}))
