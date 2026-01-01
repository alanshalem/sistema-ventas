import { supabase } from '../index'
import type {
  Caja,
  EditarSucursalParams,
  EliminarSucursalParams,
  IdEmpresaParam,
  IdUsuarioParam,
  InsertarSucursalParams,
  MostrarSucursalesParams,
  Sucursal,
} from '../types'

const tabla = 'sucursales'

export async function MostrarSucursales(
  p: MostrarSucursalesParams
): Promise<Sucursal[] | null> {
  const { data, error } = await supabase
    .from(tabla)
    .select()
    .eq('id_empresa', p.id_empresa)
  if (error) {
    throw new Error(error.message)
  }
  return data as Sucursal[] | null
}

interface SucursalAsignada {
  id: number
  nombre: string
  direccion?: string
  telefono?: string
  id_empresa: number
  estado?: boolean
  id_caja?: number
  nombre_caja?: string
}

export async function MostrarSucursalesAsignadasXuser(
  p: IdUsuarioParam
): Promise<SucursalAsignada[] | null> {
  const { data } = await supabase.rpc('mostrarsucursalesasignadas', {
    _id_usuario: p.id_usuario,
  })
  return data as SucursalAsignada[] | null
}

export async function MostrarCajasXSucursal(
  p: IdEmpresaParam
): Promise<(Sucursal & { caja: Caja[] })[] | null> {
  const { data } = await supabase
    .from(tabla)
    .select(`*, caja(*)`)
    .eq('id_empresa', p.id_empresa)
  return data as (Sucursal & { caja: Caja[] })[] | null
}

export async function InsertarSucursal(p: InsertarSucursalParams): Promise<void> {
  const { error } = await supabase.from(tabla).insert(p)
  if (error) {
    throw new Error(error.message)
  }
}

export async function EditarSucursal(p: EditarSucursalParams): Promise<void> {
  const { error } = await supabase.from(tabla).update(p).eq('id', p.id)
  if (error) {
    throw new Error(error.message)
  }
}

export async function EliminarSucursal(p: EliminarSucursalParams): Promise<void> {
  const { error } = await supabase.from(tabla).delete().eq('id', p.id)
  if (error) {
    throw new Error(error.message)
  }
}
