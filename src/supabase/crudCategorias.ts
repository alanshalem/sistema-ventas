import { supabase } from '../index'
import type { Categoria } from '../types'

const tabla = 'categorias'

interface InsertarCategoriasParams {
  nombre: string
  descripcion?: string
  id_empresa: number
}

interface BuscarCategoriasParams {
  id_empresa: number
  descripcion: string
}

interface MostrarCategoriasParams {
  id_empresa: number
}

interface EditarIconoCategoriaParams {
  icono: string
  id: number
}

interface EliminarCategoriaParams {
  id: number
  icono?: string
}

export async function InsertarCategorias(
  p: InsertarCategoriasParams,
  file?: File
): Promise<number> {
  const { error, data } = await supabase.rpc('insertarcategorias', p)
  if (error) {
    throw new Error(error.message)
  }

  if (file?.size) {
    const nuevo_id = data as number
    const urlImagen = await subirImagen(nuevo_id, file)
    const piconoeditar: EditarIconoCategoriaParams = {
      icono: urlImagen.publicUrl,
      id: nuevo_id,
    }
    await EditarcategoriesIcon(piconoeditar)
  }

  return data as number
}

async function subirImagen(
  idcategoria: number,
  file: File
): Promise<{ publicUrl: string }> {
  const ruta = 'categorias/' + idcategoria
  const { data, error } = await supabase.storage.from('imagenes').upload(ruta, file, {
    cacheControl: '0',
    upsert: true,
  })
  if (error) {
    throw new Error(error.message)
  }
  if (!data) {
    throw new Error('Upload failed')
  }

  const { data: urlimagen } = supabase.storage.from('imagenes').getPublicUrl(ruta)
  return urlimagen
}

async function EditarcategoriesIcon(p: EditarIconoCategoriaParams): Promise<void> {
  const { error } = await supabase.from('categorias').update(p).eq('id', p.id)
  if (error) {
    throw new Error(error.message)
  }
}

export async function MostrarCategorias(
  p: MostrarCategoriasParams
): Promise<Categoria[] | null> {
  const { data } = await supabase
    .from(tabla)
    .select()
    .eq('id_empresa', p.id_empresa)
    .order('id', { ascending: false })
  return data as Categoria[] | null
}

export async function BuscarCategorias(
  p: BuscarCategoriasParams
): Promise<Categoria[] | null> {
  const { data } = await supabase
    .from(tabla)
    .select()
    .eq('id_empresa', p.id_empresa)
    .ilike('nombre', '%' + p.descripcion + '%')

  return data as Categoria[] | null
}

export async function EliminarCategorias(p: EliminarCategoriaParams): Promise<void> {
  const { error } = await supabase.from(tabla).delete().eq('id', p.id)
  if (error) {
    throw new Error(error.message)
  }
  if (p.icono && p.icono !== '-') {
    const ruta = 'categorias/' + p.id
    await supabase.storage.from('imagenes').remove([ruta])
  }
}

interface EditarCategoriasRpcParams {
  _id: number
  _nombre?: string
  _descripcion?: string
  _id_empresa?: number
}

export async function EditarCategorias(
  p: EditarCategoriasRpcParams,
  fileold: string | File,
  filenew: string | File
): Promise<void> {
  const { error } = await supabase.rpc('editarcategorias', p)
  if (error) {
    throw new Error(error.message)
  }
  if (
    typeof filenew !== 'string' &&
    filenew instanceof File &&
    filenew.size !== undefined
  ) {
    if (typeof fileold !== 'string' && fileold instanceof File) {
      await EditarIconoStorage(p._id, filenew)
    } else {
      const dataImagen = await subirImagen(p._id, filenew)
      const piconoeditar: EditarIconoCategoriaParams = {
        icono: dataImagen.publicUrl,
        id: p._id,
      }
      await EditarcategoriesIcon(piconoeditar)
    }
  }
}

async function EditarIconoStorage(id: number, file: File): Promise<void> {
  const ruta = 'categorias/' + id
  await supabase.storage.from('imagenes').update(ruta, file, {
    cacheControl: '0',
    upsert: true,
  })
}
