import { useQuery } from '@tanstack/react-query'

import { ConfiguracionesTemplate, Spinner, useUsuariosStore } from '../index'
import { useAsignacionCajaSucursalStore } from '../store/AsignacionCajaSucursalStore'
import { useModulosStore } from '../store/ModulosStore'
import { usePermisosStore } from '../store/PermisosStore'
export function Configuraciones() {
  const { datausuarios } = useUsuariosStore()
  const { mostrarPermisosConfiguracion } = usePermisosStore()
  const { isLoading, error } = useQuery({
    queryKey: ['mostrar permisos configuracion'],
    queryFn: () => mostrarPermisosConfiguracion({ id_usuario: datausuarios?.id }),
  })
  if (isLoading) {
    return <Spinner />
  }
  if (error) {
    return <span>error...</span>
  }
  return <ConfiguracionesTemplate />
}
