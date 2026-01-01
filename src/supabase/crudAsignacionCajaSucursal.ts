import type {
  AsignacionCajaSucursal,
  AsignarCajaSucursalParams,
  Caja,
  IdUsuarioParam,
  Sucursal,
} from '../types'
import { supabase } from './supabase.config'

const tabla = 'asignacion_sucursal'

export async function MostrarSucursalCajaAsignada(
  p: IdUsuarioParam
): Promise<
  | (AsignacionCajaSucursal & {
      sucursales: Sucursal | null
      caja: Caja | null
    })
  | null
> {
  const { data } = await supabase
    .from(tabla)
    .select(`*, sucursales(*), caja(*)`)
    .eq('id_usuario', p.id_usuario)
    .maybeSingle()
  return data as
    | (AsignacionCajaSucursal & {
        sucursales: Sucursal | null
        caja: Caja | null
      })
    | null
}

export async function InsertarAsignacionCajaSucursal(
  p: AsignarCajaSucursalParams
): Promise<void> {
  const { error } = await supabase.from(tabla).insert(p)
  if (error) {
    throw new Error(error.message)
  }
}

interface MostrarUsuariosAsignadosParams {
  id_empresa: number
}

export async function MostrarUsuariosAsignados(
  p: MostrarUsuariosAsignadosParams
): Promise<unknown[] | null> {
  const { data } = await supabase.rpc('mostrarusuariosasignados', p)
  return data as unknown[] | null
}

interface BuscarUsuariosAsignadosParams {
  id_empresa: number
  busqueda: string
}

export async function BuscarUsuariosAsignados(
  p: BuscarUsuariosAsignadosParams
): Promise<unknown[] | null> {
  const { data } = await supabase.rpc('buscarusuariosasignados', p)
  return data as unknown[] | null
}
