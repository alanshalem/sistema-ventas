import { supabase } from '../index'
import type { TipoDocumento } from '../types'

const tabla = 'tipodocumento'

interface MostrarTipoDocumentosParams {
  id_empresa: number
}

export async function MostrarTipoDocumentos(
  p: MostrarTipoDocumentosParams
): Promise<TipoDocumento[] | null> {
  const { data } = await supabase.from(tabla).select().eq('id_empresa', p.id_empresa)
  return data as TipoDocumento[] | null
}
