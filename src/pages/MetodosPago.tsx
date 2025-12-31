import { useQuery } from '@tanstack/react-query'

import { Spinner } from '../components/molecules/Spinner'
import { MetodosPagoTemplate } from '../components/templates/MetodosPagoTemplate'
import { useEmpresaStore } from '../store/EmpresaStore'
import { useMetodosPagoStore } from '../store/MetodosPagoStore'

export function MetodosPago() {
  const { mostrarMetodosPago } = useMetodosPagoStore()
  const { dataempresa } = useEmpresaStore()
  const { isLoading, error } = useQuery({
    queryKey: ['mostrar metodos pago'],
    queryFn: () => mostrarMetodosPago({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  })
  if (isLoading) {
    return <Spinner />
  }
  if (error) {
    return <span>error... {error.message} </span>
  }
  return <MetodosPagoTemplate />
}
