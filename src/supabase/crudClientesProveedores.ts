import { supabase } from '../index'
import type { Cliente, Proveedor } from '../types'

const tabla = 'clientes_proveedores'

interface InsertarClientesProveedoresParams {
  nombres: string
  documento?: string
  tipo_documento?: string
  email?: string
  telefono?: string
  direccion?: string
  tipo: 'cliente' | 'proveedor'
  id_empresa: number
}

interface MostrarClientesProveedoresParams {
  id_empresa: number
  tipo: 'cliente' | 'proveedor'
}

interface BuscarClientesProveedoresParams {
  id_empresa: number
  tipo: 'cliente' | 'proveedor'
  buscador: string
}

interface EliminarClientesProveedoresParams {
  id: number
}

interface EditarClientesProveedoresParams {
  _id: number
  _nombres?: string
  _documento?: string
  _tipo_documento?: string
  _email?: string
  _telefono?: string
  _direccion?: string
}

export async function InsertarClientesProveedores(
  p: InsertarClientesProveedoresParams
): Promise<number | null> {
  const { error, data } = await supabase.rpc('insertarclientesproveedores', p)
  if (error) {
    throw new Error(error.message)
  }
  return data as number | null
}

export async function MostrarClientesProveedores(
  p: MostrarClientesProveedoresParams
): Promise<(Cliente | Proveedor)[] | null> {
  const { data, error } = await supabase
    .from(tabla)
    .select()
    .eq('id_empresa', p.id_empresa)
    .eq('tipo', p.tipo)
  if (error) {
    throw new Error(error.message)
  }
  return data as (Cliente | Proveedor)[] | null
}

export async function BuscarClientesProveedores(
  p: BuscarClientesProveedoresParams
): Promise<(Cliente | Proveedor)[] | null> {
  const { data, error } = await supabase
    .from(tabla)
    .select()
    .eq('id_empresa', p.id_empresa)
    .eq('tipo', p.tipo)
    .ilike('nombres', '%' + p.buscador + '%')
  if (error) {
    throw new Error(error.message)
  }
  return data as (Cliente | Proveedor)[] | null
}

export async function EliminarClientesProveedores(
  p: EliminarClientesProveedoresParams
): Promise<void> {
  const { error } = await supabase.from(tabla).delete().eq('id', p.id)
  if (error) {
    throw new Error(error.message)
  }
}

export async function EditarClientesProveedores(
  p: EditarClientesProveedoresParams
): Promise<void> {
  const { error } = await supabase.rpc('editarclientesproveedores', p)
  if (error) {
    throw new Error(error.message)
  }
}
