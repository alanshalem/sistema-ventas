import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { useAlmacenesStore } from '../store/AlmacenesStore'
import { useEmpresaStore } from '../store/EmpresaStore'
import { useGlobalStore } from '../store/GlobalStore'
import { useProductosStore } from '../store/ProductosStore'
import { useStockStore } from '../store/StockStore'
export const useMostrarStockXAlmacenesYProductoQuery = () => {
  const { mostrarStockXAlmacenesYProducto } = useStockStore()
  const { almacenSelectItem } = useAlmacenesStore()
  const { productosItemSelect } = useProductosStore()
  const { dataempresa } = useEmpresaStore()

  return useQuery({
    queryKey: [
      'mostrar Stock XAlmacenes YProducto',
      {
        id_producto: productosItemSelect?.id,
        id_almacen: almacenSelectItem?.id,
      },
    ],
    queryFn: () =>
      mostrarStockXAlmacenesYProducto({
        id_empresa: dataempresa?.id ?? 0,
        id_producto: productosItemSelect?.id ?? 0,
        id_almacen: almacenSelectItem?.id ?? 0,
      }),
    enabled: !!almacenSelectItem && !!productosItemSelect,
    refetchOnWindowFocus: false,
  })
}
export const useMostrarStockXAlmacenYProductoQuery = () => {
  const { mostrarStockXAlmacenYProducto } = useStockStore()
  const { dataempresa } = useEmpresaStore()
  const { almacenSelectItem } = useAlmacenesStore()
  const { productosItemSelect } = useProductosStore()

  return useQuery({
    queryKey: [
      'mostrar StockXAlmacenYProducto',
      {
        id_almacen: almacenSelectItem?.id,
        id_producto: productosItemSelect?.id,
      },
    ],
    queryFn: () =>
      mostrarStockXAlmacenYProducto({
        id_empresa: dataempresa?.id ?? 0,
        id_almacen: almacenSelectItem?.id ?? 0,
        id_producto: productosItemSelect?.id ?? 0,
      }),
    enabled: !!almacenSelectItem && !!productosItemSelect,
  })
}
export const useMostrarStockPorProductoQuery = () => {
  const { mostrarStockPorProducto } = useStockStore()
  const { productosItemSelect } = useProductosStore()
  return useQuery({
    queryKey: [
      'mostrar stock por producto',
      {
        id_producto: productosItemSelect?.id,
      },
    ],
    queryFn: () =>
      mostrarStockPorProducto({
        id_producto: productosItemSelect?.id ?? 0,
      }),
    enabled: !!productosItemSelect,
  })
}
export const useInsertarStockMutation = () => {
  const { setStateClose } = useGlobalStore()
  const queryClient = useQueryClient()
  const { productosItemSelect } = useProductosStore()
  const { insertarStock } = useStockStore()
  const { almacenSelectItem } = useAlmacenesStore()
  const { dataempresa } = useEmpresaStore()

  return useMutation({
    mutationKey: ['insertar stock'],
    mutationFn: async (data: {
      stock: string
      stock_minimo: string
      ubicacion: string
    }) => {
      const pStock = {
        id_empresa: dataempresa?.id ?? 0,
        id_almacen: almacenSelectItem?.id ?? 0,
        id_producto: productosItemSelect?.id ?? 0,
        cantidad: parseFloat(data.stock),
        stock: parseFloat(data.stock),
        stock_minimo: parseFloat(data.stock_minimo),
        ubicacion: data.ubicacion,
      }

      await insertarStock(pStock)
    },
    onError: (error: Error) => {
      toast.error('Error: ' + error.message)
    },
    onSuccess: () => {
      toast.success('Registro guardado correctamente')
      setStateClose(true)
      queryClient.invalidateQueries({ queryKey: ['mostrar stock por producto'] })
      queryClient.invalidateQueries({ queryKey: ['mostrar StockXAlmacenYProducto'] })
      queryClient.invalidateQueries({ queryKey: ['mostrar Stock XAlmacenes YProducto'] })
    },
  })
}
