import { useQuery } from '@tanstack/react-query'

import {
  CategoriasTemplate,
  Spinner,
  useCategoriasStore,
  useEmpresaStore,
} from '../index'

export function Categorias() {
  const { mostrarCategorias, buscarCategorias, buscador } = useCategoriasStore()
  const { dataempresa } = useEmpresaStore()
  const { isLoading, error } = useQuery({
    queryKey: ['mostrar categorias', dataempresa?.id],
    queryFn: () => mostrarCategorias({ id_empresa: dataempresa?.id ?? 0 }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  })
  //buscar categorias
  const {} = useQuery({
    queryKey: ['buscar categorias', buscador],
    queryFn: () =>
      buscarCategorias({ id_empresa: dataempresa?.id ?? 0, descripcion: buscador }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  })

  if (isLoading) {
    return <Spinner />
  }
  if (error) {
    return <span>error...</span>
  }
  return <CategoriasTemplate />
}
