import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { UserAuth } from '../context/AuthContent'
import { usePermisosStore } from '../store/PermisosStore'
import { useUsuariosStore } from '../store/UsuariosStore'

interface ProtectedRouteProps {
  children: ReactNode
  accessBy: 'authenticated' | 'non-authenticated'
}

export const ProtectedRoute = ({ children, accessBy }: ProtectedRouteProps) => {
  const authContext = UserAuth()
  const user = authContext?.user
  const { mostrarPermisosGlobales } = usePermisosStore()
  const location = useLocation()
  const { datausuarios } = useUsuariosStore()

  const {
    data: dataPermisosGlobales,
    isLoading: isLoadingPermisosGlobales,
  } = useQuery({
    queryKey: ['mostrar permisos globales', datausuarios?.id],
    queryFn: () => mostrarPermisosGlobales({ id_usuario: datausuarios?.id ?? 0 }),
    enabled: !!datausuarios,
  })
  if (isLoadingPermisosGlobales) {
    return <span>cargando permisos...</span>
  }
  const hasPermission = dataPermisosGlobales?.some(
    (item) => item.modulos?.ruta === location.pathname
  )

  if (accessBy === 'non-authenticated') {
    if (!user) {
      return children
    } else {
      return <Navigate to="/" />
    }
  } else if (accessBy === 'authenticated') {
    if (user) {
      if (!hasPermission) {
        // return <Navigate to="/404" />;
      }

      return children
    }
  }
  return <Navigate to="/login" />
}
