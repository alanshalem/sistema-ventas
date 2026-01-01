import { create } from 'zustand'

import { supabase } from '../supabase/supabase.config'
import type { IdSucursalParam, Serializacion, TipoDocumento } from '../types'

const tabla = 'serializacion_comprobantes'

type SerializacionConTipoComprobante = Serializacion & {
  tipo_comprobantes: TipoDocumento | null
}

interface SerializacionState {
  dataComprobantes: SerializacionConTipoComprobante[] | null
  itemComprobanteSelect: SerializacionConTipoComprobante | null
}

interface SerializacionActions {
  setItemComprobanteSelect: (item: SerializacionConTipoComprobante | null) => void
  mostrarSerializaciones: (
    params: IdSucursalParam
  ) => Promise<SerializacionConTipoComprobante[]>
  mostrarSerializacionesVentas: (
    params: IdSucursalParam
  ) => Promise<SerializacionConTipoComprobante[]>
  editarSerializacionDefault: (params: IdSucursalParam) => Promise<void>
  editarSerializacion: (params: Serializacion) => Promise<void>
}

type SerializacionStore = SerializacionState & SerializacionActions

export const useSerializacionStore = create<SerializacionStore>((set) => ({
  // State
  dataComprobantes: null,
  itemComprobanteSelect: null,

  // Actions
  setItemComprobanteSelect: (p) => {
    set({ itemComprobanteSelect: p })
  },

  mostrarSerializaciones: async (p) => {
    const { data, error } = await supabase
      .from(tabla)
      .select(`*,tipo_comprobantes(*)`)
      .eq('sucursal_id', p.id_sucursal)
      .order('id', { ascending: true })
    if (error) {
      throw new Error(error.message)
    }
    return data as SerializacionConTipoComprobante[]
  },

  mostrarSerializacionesVentas: async (p) => {
    const { data, error } = await supabase
      .from(tabla)
      .select(`*,tipo_comprobantes!inner(*)`)
      .eq('sucursal_id', p.id_sucursal)
      .filter('tipo_comprobantes.destino', 'eq', 'ventas')
      .order('id', { ascending: true })

    if (error) {
      throw new Error(error.message)
    }
    set({
      dataComprobantes: data as SerializacionConTipoComprobante[],
      itemComprobanteSelect: (data && data[0]) ?? null,
    })

    return data as SerializacionConTipoComprobante[]
  },

  editarSerializacionDefault: async (p) => {
    const { error } = await supabase.rpc('setdefaultserializacion', p)
    if (error) {
      throw new Error(error.message)
    }
  },

  editarSerializacion: async (p) => {
    const { error } = await supabase.from(tabla).update(p).eq('id', p.id)
    if (error) {
      throw new Error(error.message)
    }
  },
}))
