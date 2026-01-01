import type {
  AbrirCajaParams,
  CerrarCajaParams,
  CierreCaja,
  IdCajaParam,
} from '../types'
import { supabase } from './supabase.config'

const tabla = 'cierrecaja'

export async function MostrarCierreCajaAperturada(
  p: IdCajaParam
): Promise<CierreCaja | null> {
  const { data } = await supabase
    .from(tabla)
    .select()
    .eq('id_caja', p.id_caja)
    .eq('estado', 0)
    .maybeSingle()
  return data as CierreCaja | null
}

export async function AperturarCierreCaja(
  p: AbrirCajaParams
): Promise<CierreCaja | null> {
  const { error, data } = await supabase.from(tabla).insert(p).select().maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data as CierreCaja | null
}

export async function CerrarTurnoCaja(p: CerrarCajaParams): Promise<void> {
  const { error } = await supabase.from(tabla).update(p).eq('id', p.id)
  if (error) {
    throw new Error(error.message)
  }
}
