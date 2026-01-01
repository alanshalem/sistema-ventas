import type { MetodoPago } from '../types'
import { supabase } from './supabase.config'

const tabla = 'metodos_pago'

interface MostrarMetodosPagoParams {
  id_empresa: number
}

interface InsertarMetodosPagoParams {
  nombre: string
  descripcion?: string
  id_empresa: number
  estado?: boolean
  requiere_referencia?: boolean
}

interface EditarIconoMetodosPagoParams {
  icono: string
  id: number
}

interface EditarMetodosPagoParams {
  id: number
  _id?: number
  nombre?: string
  descripcion?: string
  estado?: boolean
}

interface EliminarMetodosPagoParams {
  id: number
  icono?: string
}

export async function MostrarMetodosPago(
  p: MostrarMetodosPagoParams
): Promise<MetodoPago[] | null> {
  const { data } = await supabase.from(tabla).select().eq('id_empresa', p.id_empresa)
  return data as MetodoPago[] | null
}

export async function InsertarMetodosPago(
  p: InsertarMetodosPagoParams,
  file?: File
): Promise<void> {
  const { error, data } = await supabase.from(tabla).insert(p).select().maybeSingle()
  if (error) {
    throw new Error(error.message)
  }

  if (file?.size) {
    const nuevo_id = (data as MetodoPago).id
    const urlImagen = await subirImagen(nuevo_id, file)
    const piconoeditar: EditarIconoMetodosPagoParams = {
      icono: urlImagen.publicUrl,
      id: nuevo_id,
    }
    await EditarIconoMetodosPago(piconoeditar)
  }
}

async function subirImagen(
  idmetodopago: number,
  file: File
): Promise<{ publicUrl: string }> {
  const ruta = 'metodospago/' + idmetodopago
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

async function EditarIconoMetodosPago(p: EditarIconoMetodosPagoParams): Promise<void> {
  const { error } = await supabase.from(tabla).update(p).eq('id', p.id)
  if (error) {
    throw new Error(error.message)
  }
}

async function EditarIconoStorage(id: number, file: File): Promise<void> {
  const ruta = 'metodospago/' + id
  await supabase.storage.from('imagenes').update(ruta, file, {
    cacheControl: '0',
    upsert: true,
  })
}

export async function EditarMetodosPago(
  p: EditarMetodosPagoParams,
  fileold: string | File,
  filenew: string | File
): Promise<void> {
  const { error } = await supabase.from(tabla).update(p).eq('id', p.id)
  if (error) {
    throw new Error(error.message)
  }
  if (
    typeof filenew !== 'string' &&
    filenew instanceof File &&
    filenew.size !== undefined
  ) {
    if (typeof fileold !== 'string' && fileold instanceof File) {
      await EditarIconoStorage(p._id!, filenew)
    } else {
      const dataImagen = await subirImagen(p._id!, filenew)
      const piconoeditar: EditarIconoMetodosPagoParams = {
        icono: dataImagen.publicUrl,
        id: p._id!,
      }
      await EditarIconoMetodosPago(piconoeditar)
    }
  }
}

export async function EliminarMetodosPago(
  p: EliminarMetodosPagoParams
): Promise<void> {
  const { error } = await supabase.from(tabla).delete().eq('id', p.id)
  if (error) {
    throw new Error(error.message)
  }
  if (p.icono && p.icono !== '-') {
    const ruta = 'metodospago/' + p.id
    await supabase.storage.from('imagenes').remove([ruta])
  }
}
