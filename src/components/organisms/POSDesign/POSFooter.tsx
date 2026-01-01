import { Icon } from '@iconify/react/dist/iconify.js'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import styled from 'styled-components'

import { useCierreCajaStore } from '../../../store/CierreCajaStore'
import { useVentasStore } from '../../../store/VentasStore'
import { Device } from '../../../styles/breakpoints'
import { Button } from '../../molecules/Button'

export function POSFooter() {
  const { eliminarVenta, idventa } = useVentasStore()
  const { setStateIngresoSalida, setTipoRegistro, setStateCierraCaja } = useCierreCajaStore()
  const queryClient = useQueryClient()

  const { mutate: mutateEliminarVenta, isPending } = useMutation({
    mutationKey: ['eliminar venta'],
    mutationFn: () => {
      if (idventa > 0) {
        return eliminarVenta({ id: idventa })
      } else {
        return Promise.reject(new Error('Sin registro de venta para eliminar'))
      }
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`)
    },
    onSuccess: () => {
      toast.success('Venta eliminada')
      queryClient.invalidateQueries({ queryKey: ['mostrar detalle venta'] })
    },
  })

  return (
    <Footer>
      <article className="content">
        <Button
          disabled={isPending}
          bgColor="#f44141"
          color="#fff"
          onClick={() => mutateEliminarVenta()}
          icon={<Icon icon="fluent-emoji-flat:skull" />}
          title="Eliminar venta"
        />
        <Button
          bgColor="#fff"
          color="#2d2d2d"
          onClick={() => setStateCierraCaja(true)}
          icon={<Icon icon="emojione:card-file-box" />}
          title="Cerrar caja"
        />
        <Button
          bgColor="#fff"
          color="#2d2d2d"
          onClick={() => {
            setStateIngresoSalida(true)
            setTipoRegistro('ingreso')
          }}
          icon={<Icon icon="fluent-emoji:dollar-banknote" />}
          title="Ingresar dinero"
        />
        <Button
          bgColor="#fff"
          color="#2d2d2d"
          onClick={() => {
            setStateIngresoSalida(true)
            setTipoRegistro('salida')
          }}
          icon={<Icon icon="noto-v1:money-bag" />}
          title="Retirar dinero"
        />
      </article>
    </Footer>
  )
}

const Footer = styled.section`
  grid-area: footer;
  display: none;

  @media ${Device.desktop} {
    display: flex;
  }
  .content {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`
