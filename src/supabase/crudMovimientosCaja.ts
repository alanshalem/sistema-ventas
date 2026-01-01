import type { InsertarMovimientoCajaParams } from '../types'
import { supabase } from './supabase.config'

const tabla = 'movimientos_caja'

export async function InsertarMovCaja(p: InsertarMovimientoCajaParams): Promise<void> {
  const { error } = await supabase.from(tabla).insert(p)
  if (error) {
    throw new Error(error.message)
  }
}

interface SumarEfectivoSinVentasParams {
  _id_cierre_caja: number
}

export async function MostrarEfectivoSinVentasMovcierrecaja(
  p: SumarEfectivoSinVentasParams
): Promise<number | null> {
  const { data } = await supabase.rpc('sumarefectivosinventasmovcierrecaja', p)
  return data as number | null
}

interface SumarVentasMetodoPagoParams {
  _id_cierre_caja: number
  _id_metodo_pago: number
}

export async function MostrarVentasMetodoPagoMovCaja(
  p: SumarVentasMetodoPagoParams
): Promise<number | null> {
  const { data } = await supabase.rpc('sumarventasmetodopagomovcierrecaja', p)
  return data as number | null
}

interface MostrarMovimientosCajaLiveParams {
  _id_cierre_caja: number
}

export async function Mostrarmovimientoscajalive(
  p: MostrarMovimientosCajaLiveParams
): Promise<unknown[] | null> {
  const { data } = await supabase.rpc('mostrarmovimientoscajalive', p)
  return data as unknown[] | null
}
