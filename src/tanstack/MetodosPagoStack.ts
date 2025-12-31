import { useQuery } from '@tanstack/react-query'

import { useEmpresaStore } from '../store/EmpresaStore'
import { useMetodosPagoStore } from '../store/MetodosPagoStore'

export const useMostrarMetodosPagoQuery = () => {
  const { mostrarMetodosPago } = useMetodosPagoStore()
  const { dataempresa } = useEmpresaStore()
  return useQuery({
    queryKey: ['mostrar metodos de pago'],
    queryFn: () => mostrarMetodosPago({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
  })
}
