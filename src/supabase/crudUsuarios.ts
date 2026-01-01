import { supabase } from '../index'
import { usePermisosStore } from '../store/PermisosStore'
import type {
  EditarUsuarioParams,
  EliminarUsuarioAsignadoParams,
  InsertarAdminParams,
  InsertarCredencialesUserParams,
  InsertarUsuarioParams,
  MostrarUsuariosParams,
  Rol,
  Usuario,
} from '../types'
import { EliminarPermisos, InsertarPermisos } from './crudPermisos'

const tabla = 'usuarios'

export async function MostrarUsuarios(
  p: MostrarUsuariosParams
): Promise<(Usuario & { roles: Rol | null }) | null | undefined> {
  const { data, error } = await supabase
    .from(tabla)
    .select(`*, roles(*)`)
    .eq('id_auth', p.id_auth)
    .maybeSingle()
  if (error) {
    return
  }
  return data as (Usuario & { roles: Rol | null }) | null
}

export async function InsertarAdmin(p: InsertarAdminParams): Promise<void> {
  const { error } = await supabase.from(tabla).insert(p)
  if (error) {
    throw new Error(error.message)
  }
}

export async function InsertarUsuarios(
  p: InsertarUsuarioParams
): Promise<Usuario | null> {
  const { error, data } = await supabase.from(tabla).insert(p).select().maybeSingle()
  if (error) {
    throw new Error(error.message)
  }
  return data as Usuario | null
}

interface CredencialesUserResponse {
  id_auth: string
  email: string
}

export async function InsertarCredencialesUser(
  p: InsertarCredencialesUserParams
): Promise<CredencialesUserResponse | null> {
  const { data, error } = await supabase.rpc('crearcredencialesuser', p)
  if (error) {
    throw new Error(error.message)
  }
  return data as CredencialesUserResponse | null
}

export async function ObtenerIdAuthSupabase(): Promise<string | undefined> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (session != null) {
    const { user } = session
    return user.id
  }
  return undefined
}

export async function EliminarUsuarioAsignado(
  p: EliminarUsuarioAsignadoParams
): Promise<void> {
  const { error } = await supabase.from(tabla).delete().eq('id', p.id)
  if (error) {
    throw new Error(error.message)
  }
}

export async function EditarUsuarios(p: EditarUsuarioParams): Promise<void> {
  const { error } = await supabase.from(tabla).update(p).eq('id', p.id)
  await EliminarPermisos({ id_usuario: p.id })
  const selectModules = usePermisosStore.getState().selectedModules || []
  const id_usuario = p.id
  if (Array.isArray(selectModules) && selectModules.length > 0) {
    selectModules.forEach(async (idModule: number) => {
      const pp = {
        id_usuario: id_usuario,
        idmodulo: idModule,
      }
      console.log('p modulos', pp)
      await InsertarPermisos(pp)
    })
  } else {
    throw new Error('No hay módulos seleccionados')
  }
  if (error) {
    throw new Error(error.message)
  }
}
