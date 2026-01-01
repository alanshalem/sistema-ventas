import { supabase } from '../index'
import type { Modulo } from '../types'

const tabla = 'modulos'

export async function MostrarModulos(): Promise<Modulo[] | null> {
  const { data, error } = await supabase.from(tabla).select().neq('etiquetas', '#default')
  if (error) {
    throw new Error(error.message)
  }
  return data as Modulo[] | null
}
