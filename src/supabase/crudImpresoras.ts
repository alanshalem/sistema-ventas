import type { EditarImpresoraParams, Impresora } from '../types'
import { supabase } from './supabase.config'

const tabla = 'impresoras'

export async function EditarImpresoras(p: EditarImpresoraParams): Promise<void> {
  const { error } = await supabase.from(tabla).update(p).eq('id', p.id)
  if (error) {
    throw new Error(error.message)
  }
}

interface MostrarImpresoraXCajaParams {
  id_caja: number
}

export async function MostrarImpresoraXCaja(
  p: MostrarImpresoraXCajaParams
): Promise<Impresora | null> {
  const { data } = await supabase
    .from(tabla)
    .select()
    .eq('id_caja', p.id_caja)
    .maybeSingle()
  return data as Impresora | null
}
