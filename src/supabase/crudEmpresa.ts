import { supabase } from '../index'
import type {
  EditarEmpresaParams,
  Empresa,
  InsertarEmpresaParams,
  MostrarEmpresaXIdUsuarioParams,
} from '../types'

const tabla = 'empresa'

export async function InsertarEmpresa(p: InsertarEmpresaParams): Promise<Empresa | null> {
  const { data, error } = await supabase.from(tabla).insert(p).select().maybeSingle()
  if (error) {
    throw new Error(error.message)
  }
  return data as Empresa | null
}

export async function MostrarEmpresaXidsuario(
  p: MostrarEmpresaXIdUsuarioParams
): Promise<any> {
  const { data } = await supabase.rpc('mostrarempresaxiduser', p).maybeSingle()
  return data
}

export async function EditarMonedaEmpresa(p: EditarEmpresaParams): Promise<void> {
  const { error } = await supabase.from(tabla).update(p).eq('id', p.id)
  if (error) {
    throw new Error(error.message)
  }
}

export async function EditarLogoEmpresa(p: { id: number; logo: string }): Promise<void> {
  const { error } = await supabase.from(tabla).update({ logo: p.logo }).eq('id', p.id)
  if (error) {
    throw new Error(error.message)
  }
}

export async function EditarEmpresa(
  p: EditarEmpresaParams,
  fileold: string | File,
  filenew: string | File
): Promise<void> {
  const { error } = await supabase.from(tabla).update(p).eq('id', p.id)
  if (error) {
    throw new Error(error.message)
  }
  if (filenew !== '-' && typeof filenew !== 'string' && filenew.size !== undefined) {
    if (fileold !== '-') {
      await EditarIconoStorage(p.id!, filenew)
    } else {
      const dataImagen = await subirImagen(p.id!, filenew)
      const plogoeditar = {
        logo: dataImagen.publicUrl,
        id: p.id!,
      }
      await EditarLogoEmpresa(plogoeditar)
    }
  }
}

export async function EditarIconoStorage(id: number, file: File): Promise<void> {
  const ruta = 'empresa/' + id
  await supabase.storage.from('imagenes').update(ruta, file, {
    cacheControl: '0',
    upsert: true,
  })
}

async function subirImagen(
  idempresa: number,
  file: File
): Promise<{ publicUrl: string }> {
  const ruta = 'empresa/' + idempresa
  const { data, error } = await supabase.storage.from('imagenes').upload(ruta, file, {
    cacheControl: '0',
    upsert: true,
  })
  if (error) {
    throw new Error(error.message)
  }
  if (data) {
    const { data: urlimagen } = supabase.storage.from('imagenes').getPublicUrl(ruta)
    return urlimagen
  }
  throw new Error('Failed to upload image')
}
