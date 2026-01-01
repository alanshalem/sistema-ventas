import { useQuery } from '@tanstack/react-query'

import { ProductosTemplate, Spinner, useEmpresaStore, useProductosStore } from '../index'

export function Productos() {
  const { mostrarProductos, buscarProductos, buscador } = useProductosStore()
  const { dataempresa } = useEmpresaStore()
  const { isLoading: isLoadingProductos, error: errorProductos } = useQuery({
    queryKey: ['mostrar productos', dataempresa?.id],
    queryFn: () => mostrarProductos({ id_empresa: dataempresa?.id ?? 0 }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  })

  // Buscar categorías
  useQuery({
    queryKey: ['buscar productos', buscador],
    queryFn: () => buscarProductos({ id_empresa: dataempresa?.id ?? 0 }),
    enabled: !!dataempresa && !!buscador,
    refetchOnWindowFocus: false,
  })

  // Consolidación de isLoading y error
  const isLoading = isLoadingProductos
  const error = errorProductos

  if (isLoading) {
    return <Spinner />
  }

  if (error) {
    return <span>Error: {error.message}</span>
  }

  return <ProductosTemplate />
}
