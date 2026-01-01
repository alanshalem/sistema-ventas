import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { BarLoader } from 'react-spinners'
import styled from 'styled-components'

import { useEmpresaStore } from '../../..'
import { useSupabaseSubscription } from '../../../hooks/useSupabaseSubscription'
import { useMovCajaStore } from '../../../store/MovCajaStore'
import { LiveIndicator } from '../../molecules/LiveIndicator'
import { LiveCashMovementsTable } from '../tables/LiveCashMovementsTable'

export function LiveCashMovementsCard(): ReactNode {
  const { dataempresa } = useEmpresaStore()
  const { mostrarmovimientoscajalive } = useMovCajaStore()

  const { data, isLoading, error } = useQuery({
    queryKey: ['mostrar movimientos caja live'],
    queryFn: () => mostrarmovimientoscajalive({}),
    enabled: !!dataempresa,
  })

  useSupabaseSubscription({
    channelName: 'public:movimientos_caja',
    options: { event: '*', schema: 'public', table: 'movimientos_caja' },
    queryKey: ['mostrar movimientos caja live'],
  })

  if (isLoading) return <BarLoader color="#6d6d6d" />
  if (error) return <span>error...{error.message}</span>

  return (
    <Container>
      <HeaderCard>
        <Title>Movimientos de caja</Title>
        <LiveIndicator />
      </HeaderCard>
      <LiveCashMovementsTable
        data={(data as any) ?? []}
        setOpenRegister={() => {}}
        setSelectedData={() => {}}
        setAction={() => {}}
      />
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  border: 2px solid ${({ theme }) => theme.bordercolorDash};
  border-radius: 20px;
  background-color: ${({ theme }) => theme.background};
`

const HeaderCard = styled.div`
  text-align: center;
  display: flex;
  gap: 15px;
  align-items: center;
  padding-left: 20px;
`

const Title = styled.h3`
  font-size: 25px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`
