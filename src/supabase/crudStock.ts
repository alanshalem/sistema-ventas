import type { Almacen, InsertarStockParams, Stock } from '../types'
import { supabase } from './supabase.config'

const tabla = 'stock'

export async function InsertarStock(p: InsertarStockParams): Promise<void> {
  const { error } = await supabase.from(tabla).insert(p)
  if (error) {
    throw new Error(error.message)
  }
}

interface EditarStockParams {
  _id_producto: number
  _id_almacen: number
  _cantidad: number
}

export async function EditarStock(
  p: EditarStockParams,
  tipo: 'ingreso' | 'egreso'
): Promise<void> {
  const { error } = await supabase.rpc(
    tipo === 'ingreso' ? 'incrementarstock' : 'reducirstock',
    p
  )
  if (error) {
    throw new Error(error.message)
  }
}

interface MostrarStockXAlmacenYProductoParams {
  id_almacen: number
  id_producto: number
}

export async function MostrarStockXAlmacenYProducto(
  p: MostrarStockXAlmacenYProductoParams
): Promise<Stock | null> {
  const { data } = await supabase
    .from(tabla)
    .select()
    .eq('id_almacen', p.id_almacen)
    .eq('id_producto', p.id_producto)
    .maybeSingle()
  return data as Stock | null
}

export async function MostrarStockXAlmacenesYProducto(
  p: MostrarStockXAlmacenYProductoParams
): Promise<(Stock & { almacen: Almacen | null })[] | null> {
  const { data } = await supabase
    .from(tabla)
    .select(`*, almacen(*)`)
    .eq('id_almacen', p.id_almacen)
    .eq('id_producto', p.id_producto)
    .gt('stock', 0)
  return data as (Stock & { almacen: Almacen | null })[] | null
}
