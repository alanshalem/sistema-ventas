import { supabase } from '../index'
import type {
  BuscarProductoParams,
  EditarProductoParams,
  IdEmpresaParam,
  IdParam,
  InsertarProductoParams,
  MostrarProductosParams,
  Producto,
} from '../types'

const tabla = 'productos'

export async function InsertarProductos(p: InsertarProductoParams): Promise<any> {
  const { error, data } = await supabase.rpc('insertarproductos', p)
  if (error) {
    throw new Error(error.message)
  }
  console.log(data)
  return data
}

export async function MostrarProductos(p: MostrarProductosParams): Promise<any> {
  const { data } = await supabase.rpc('mostrarproductos', {
    _id_empresa: p.id_empresa,
  })
  return data
}

export async function BuscarProductos(p: BuscarProductoParams): Promise<any> {
  const { data, error } = await supabase.rpc('buscarproductos', {
    _id_empresa: p.id_empresa,
    buscador: p.busqueda,
  })

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export async function EliminarProductos(p: IdParam): Promise<void> {
  const { error } = await supabase.from(tabla).delete().eq('id', p.id)
  if (error) {
    throw new Error(error.message)
  }
}

export async function EditarProductos(p: EditarProductoParams): Promise<void> {
  const { error } = await supabase.rpc('editarproductos', p)
  if (error) {
    throw new Error(error.message)
  }
}

export async function MostrarUltimoProducto(p: IdEmpresaParam): Promise<Producto | null> {
  const { data } = await supabase
    .from(tabla)
    .select()
    .eq('id_empresa', p.id_empresa)
    .order('id', { ascending: false })
    .maybeSingle()

  return data as Producto | null
}
