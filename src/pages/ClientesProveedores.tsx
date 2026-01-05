import { useQuery } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'

import { ClientesProveedoresTemplate } from '../components/templates/ClientesProveedoresTemplate'
import { useClientesProveedoresStore } from '../store/ClientesProveedoresStore'
import { useEmpresaStore } from '../store/EmpresaStore'

export function ClientesProveedores() {
  const location = useLocation()
  const { mostrarCliPro, buscarCliPro, buscador } = useClientesProveedoresStore()

  const { dataempresa } = useEmpresaStore()
  const { isLoading } = useQuery({
    queryKey: [
      'mostrar clientes proveedores',
      {
        dataempresa: dataempresa?.id,
        tipo: location.pathname === '/configuracion/clientes' ? 'cliente' : 'proveedor',
      },
    ],
    queryFn: () =>
      mostrarCliPro({
        id_empresa: dataempresa?.id ?? 0,
        tipo: location.pathname === '/configuracion/clientes' ? 'cliente' : 'proveedor',
      }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  })

  //buscador
  useQuery({
    queryKey: [
      'buscar clientes proveedores',
      {
        dataempresa: dataempresa?.id,
        tipo: location.pathname === '/configuracion/clientes' ? 'cliente' : 'proveedor',
        buscador: buscador,
      },
    ],
    queryFn: () =>
      buscarCliPro({
        id_empresa: dataempresa?.id ?? 0,
        tipo: location.pathname === '/configuracion/clientes' ? 'cliente' : 'proveedor',
        buscador: buscador,
      }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  })

  if (isLoading) {
    return <span>cargando...</span>
  }

  return <ClientesProveedoresTemplate />
}
