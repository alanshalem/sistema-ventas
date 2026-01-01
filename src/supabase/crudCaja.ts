import type {
  Caja,
  EditarCajaParams,
  EliminarCajaParams,
  InsertarCajaParams,
  MostrarCajaXSucursalParams,
} from '../types'
import { supabase } from './supabase.config'

const tabla = 'caja'

export async function MostrarCajaXSucursal(
  p: MostrarCajaXSucursalParams
): Promise<Caja[] | null> {
  const { data } = await supabase.from(tabla).select().eq('id_sucursal', p.id_sucursal)

  return data as Caja[] | null
}

export async function InsertarCaja(p: InsertarCajaParams): Promise<void> {
  const { error } = await supabase.from(tabla).insert(p)
  if (error) {
    throw new Error(error.message)
  }
}

export async function EditarCaja(p: EditarCajaParams): Promise<void> {
  const { error } = await supabase.from(tabla).update(p).eq('id', p.id)
  if (error) {
    throw new Error(error.message)
  }
}

export async function EliminarCaja(p: EliminarCajaParams): Promise<void> {
  const { error } = await supabase.from(tabla).delete().eq('id', p.id)
  if (error) {
    throw new Error(error.message)
  }
}
