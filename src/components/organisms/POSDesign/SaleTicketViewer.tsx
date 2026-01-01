import { Icon } from '@iconify/react/dist/iconify.js'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import ticket from '../../../reports/TicketVenta'
import { useVentasStore } from '../../../store/VentasStore'

interface SaleTicketViewerProps {
  readonly setState: () => void
}

export function SaleTicketViewer({ setState }: Readonly<SaleTicketViewerProps>) {
  const [base64, setBase64] = useState<string>('')
  const { items } = useVentasStore()

  const onGenerateTicket = async (output: string): Promise<void> => {
    const dataempresa = {
      logo: 'https://cdn.forbes.com.mx/2020/03/El-sen%CC%83or-de-los-anillos-Golum-.jpg',
      productos: items,
    }
    const response = await ticket(output, dataempresa)
    if (output === 'b64' && response && (response as any).content) {
      setBase64((response as any).content)
    }
  }

  useEffect(() => {
    onGenerateTicket('b64')
  }, [])

  return (
    <Container>
      <ContentTicket>
        <article className="contentverticket" onClick={setState}>
          <span>Ocultar ticket</span>
          <Icon className="icono" icon="fluent-emoji:monkey-face" />
        </article>

        <iframe
          style={{ width: '100%', height: '100%' }}
          src={`data:application/pdf;base64,${base64}`}
        />
      </ContentTicket>
    </Container>
  )
}

const Container = styled.div`
  position: absolute;
  z-index: 2;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.backgroundSecondarytotal};
`

const ContentTicket = styled.div`
  height: 80%;
  display: flex;
  gap: 10px;
  flex-direction: column;
`
