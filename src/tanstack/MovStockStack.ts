import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { useFormattedDate } from '../hooks/useFormattedDate'
import { useAlmacenesStore } from '../store/AlmacenesStore'
import { useEmpresaStore } from '../store/EmpresaStore'
import { useGlobalStore } from '../store/GlobalStore'
import { useMovStockStore } from '../store/MovStockStore'
import { useProductosStore } from '../store/ProductosStore'
import { useStockStore } from '../store/StockStore'

// export const useBuscarProductosQuery = () => {
//   const { buscador, buscarProductos } = useProductosStore();
//   const { dataempresa } = useEmpresaStore();

//   return useQuery({
//     queryKey: ["buscar productos", buscador],
//     queryFn: () =>
//       buscarProductos({
//         id_empresa: dataempresa?.id,
//         buscador: buscador,
//       }),
//     enabled: !!dataempresa,
//   });
// };

interface InsertarMovStockFormData {
  cantidad: string
  precio_compra: number
  precio_venta: number
}

export const useInsertarMovStockMutation = () => {
  const queryClient = useQueryClient()
  const { productosItemSelect, editarPreciosProductos } = useProductosStore()
  const { setStateClose } = useGlobalStore()
  const { tipo, insertarMovStock } = useMovStockStore()
  const { editarStock } = useStockStore()
  const { almacenSelectItem } = useAlmacenesStore()
  const { dataempresa } = useEmpresaStore()
  const fechaActual = useFormattedDate()

  return useMutation({
    mutationKey: ['insertar movimiento stock'],
    mutationFn: async (data: InsertarMovStockFormData) => {
      const pMovimientoStock = {
        id_empresa: dataempresa?.id ?? 0,
        id_almacen: almacenSelectItem?.id ?? 0,
        id_producto: productosItemSelect?.id ?? 0,
        id_usuario: 1, // This should come from auth context
        tipo: tipo,
        cantidad: parseFloat(data.cantidad),
        fecha: fechaActual,
        motivo: 'registro de inventario manual',
      }

      const stockTipo = tipo === 'entrada' ? 'ingreso' : 'egreso'

      const pStock = {
        _id_producto: productosItemSelect?.id ?? 0,
        _id_almacen: almacenSelectItem?.id ?? 0,
        _cantidad: parseFloat(data.cantidad),
      }

      const pProductos = {
        id: productosItemSelect?.id ?? 0,
        precio_compra: parseFloat(
          String(((productosItemSelect?.precio_compra ?? 0) + data.precio_compra) / 2)
        ),
        precio_venta: parseFloat(
          String(((productosItemSelect?.precio_venta ?? 0) + data.precio_venta) / 2)
        ),
      }

      await insertarMovStock(pMovimientoStock)
      await editarStock(pStock, stockTipo)
      await editarPreciosProductos(pProductos)
    },
    onError: (error: Error) => {
      toast.error('Error:' + error.message)
    },
    onSuccess: () => {
      toast.success('Registro guardado correctamente')
      queryClient.invalidateQueries({ queryKey: ['buscar productos'] })
      setStateClose(false)
    },
  })
}
