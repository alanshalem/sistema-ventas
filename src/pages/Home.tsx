import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { HomeTemplate, useUsuariosStore } from '../index'
export function Home() {
  const { datausuarios } = useUsuariosStore()
  const queryClient = useQueryClient()
  useEffect(() => {
    console.log('entrando')
    if (!datausuarios?.id) {
      queryClient.invalidateQueries({ queryKey: ['mostrar usuarios'] })
      //  window.location.reload();
      console.log('actualizado')
    }
  }, [datausuarios, queryClient])
  return <HomeTemplate />
}
