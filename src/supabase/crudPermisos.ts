import { supabase } from '../supabase/supabase.config'
import type { EliminarPermisosParams, InsertarPermisoParams, Modulo, Permiso } from '../types'

const tabla = 'permisos'

interface MostrarPermisosParams {
  id_usuario: number
}

export async function MostrarPermisos(
  p: MostrarPermisosParams
): Promise<(Permiso & { modulos: Modulo | null })[] | null> {
  const { data } = await supabase
    .from(tabla)
    .select(`*, modulos(*)`)
    .eq('id_usuario', p.id_usuario)
  return data as (Permiso & { modulos: Modulo | null })[] | null
}

export async function MostrarPermisosConfiguracion(
  p: MostrarPermisosParams
): Promise<(Permiso & { modulos: Modulo | null })[] | null> {
  const { data } = await supabase
    .from(tabla)
    .select(`*, modulos!inner(*)`)
    .eq('modulos.etiquetas', '#configuracion')
    .eq('id_usuario', p.id_usuario)
  return data as (Permiso & { modulos: Modulo | null })[] | null
}

export async function MostrarPermisosDefault(): Promise<unknown[] | null> {
  const { data } = await supabase.from('permisos_dafault').select()
  return data as unknown[] | null
}

export async function InsertarPermisos(p: InsertarPermisoParams): Promise<void> {
  const { error } = await supabase.from(tabla).insert(p).select()
  if (error) {
    throw new Error(error.message)
  }
}

export async function EliminarPermisos(p: EliminarPermisosParams): Promise<void> {
  const { error } = await supabase.from(tabla).delete().eq('id_usuario', p.id_usuario)
  if (error) {
    throw new Error(error.message)
  }
}

export async function MostrarPermisosGlobales(
  p: MostrarPermisosParams
): Promise<(Permiso & { modulos: Modulo | null })[] | null> {
  const { data } = await supabase
    .from(tabla)
    .select(`*, modulos(*)`)
    .eq('id_usuario', p.id_usuario)
  return data as (Permiso & { modulos: Modulo | null })[] | null
}
