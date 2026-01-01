import type { Almacen, InsertarMovimientoStockParams, Sucursal } from '../types'
import { supabase } from './supabase.config'

const tabla = 'movimientos_stock'

interface MostrarMovStockParams {
  id_empresa: number
  id_producto: number
}

interface MovimientoStockExtendido {
  id: number
  tipo: 'entrada' | 'salida' | 'ajuste'
  cantidad: number
  id_producto: number
  id_almacen: number
  id_usuario: number
  id_empresa: number
  motivo?: string
  fecha: string
  referencia?: string
  created_at?: string
  updated_at?: string
  almacen: Almacen & {
    sucursales: Sucursal
  }
}

export async function MostrarMovStock(
  p: MostrarMovStockParams
): Promise<MovimientoStockExtendido[] | null> {
  const { data, error } = await supabase
    .from(tabla)
    .select(
      `
      *,
      almacen!inner(
        *,
        sucursales!inner(
          *
        )
      )
    `
    )
    .eq('almacen.sucursales.id_empresa', p.id_empresa)
    .eq('id_producto', p.id_producto)
  if (error) {
    throw new Error(error.message)
  }
  return data as MovimientoStockExtendido[] | null
}

export async function InsertarMovStock(p: InsertarMovimientoStockParams): Promise<void> {
  const { error } = await supabase.from(tabla).insert(p)
  if (error) {
    throw new Error(error.message)
  }
}
