import { supabase } from '../index'
import type { Rol } from '../types'

const tabla = 'roles'

interface MostrarRolesXnombreParams {
  nombre: string
}

export async function MostrarRolesXnombre(
  p: MostrarRolesXnombreParams
): Promise<Rol | null> {
  const { data } = await supabase
    .from(tabla)
    .select()
    .eq('nombre', p.nombre)
    .maybeSingle()
  return data as Rol | null
}

export async function MostrarRoles(): Promise<Rol[] | null> {
  const { data } = await supabase.from(tabla).select().neq('nombre', 'superadmin')
  return data as Rol[] | null
}
