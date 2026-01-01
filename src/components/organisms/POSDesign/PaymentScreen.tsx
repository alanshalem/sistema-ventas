import { Icon } from '@iconify/react/dist/iconify.js'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { useDetalleVentasStore } from '../../../store/DetalleVentasStore'
import { useImpresorasStore } from '../../../store/ImpresorasStore'
import { useVentasStore } from '../../../store/VentasStore'
import { useEditarImpresorasMutation } from '../../../tanstack/ImpresorasStack'
import { Switch } from '../../ui/toggles/Switch'
import { PaymentEntry } from './PaymentEntry'
import { SaleTicketViewer } from './SaleTicketViewer'

interface PaymentEntryHandle {
  mutateAsync: () => Promise<void>
}

export function PaymentScreen() {
  const [stateVerticket, setStateVerticker] = useState<boolean>(false)
  const { setStatePantallaCobro, tipocobro } = useVentasStore()
  const ingresoCobroRef = useRef<PaymentEntryHandle>(null)
  const { datadetalleventa } = useDetalleVentasStore()
  const { statePrintDirecto, setStatePrintDirecto } = useImpresorasStore()
  const { mutate, isPending } = useEditarImpresorasMutation()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Enter') {
        event.preventDefault()
        if (ingresoCobroRef.current) {
          ingresoCobroRef.current.mutateAsync()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <Container>
      <section className="contentingresocobro">
        {stateVerticket && (
          <SaleTicketViewer setState={() => setStateVerticker(!stateVerticket)} />
        )}

        <article className="contentverticket">
          <ContentSwich>
            imprimir directo
            <Switch
              state={statePrintDirecto}
              setState={() => {
                setStatePrintDirecto()
                mutate()
              }}
            />
          </ContentSwich>
        </article>
        {isPending ? (
          <span>guardando cambios de impresora...</span>
        ) : (
          <PaymentEntry ref={ingresoCobroRef} />
        )}

        <article
          className="contentverticket"
          onClick={() =>
            setStatePantallaCobro({
              data: datadetalleventa,
              tipocobro: tipocobro,
            })
          }
        >
          <Icon className="icono" icon="ep:arrow-left-bold" />
          <span>volver</span>
        </article>
      </section>
    </Container>
  )
}

const Container = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 100;
  background-color: ${({ theme }) => theme.backgroundSecondarytotal};
  .contentingresocobro {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    height: calc(100% - 10rem);
    .contentverticket {
      align-self: flex-end;
      cursor: pointer;
      display: flex;
      gap: 10px;
      align-items: center;
      span {
        font-weight: 700px;
        font-size: 18px;
      }
      .icono {
        font-size: 30px;
      }
    }
  }
`

const ContentSwich = styled.section`
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
`
