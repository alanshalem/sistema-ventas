import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { BarLoader } from 'react-spinners'
import styled from 'styled-components'

import { useDetalleVentasStore, useEmpresaStore } from '../../..'
import { Top10ProductsTable } from '../tables/Top10ProductsTable'

export function TopProductsByAmountCard(): ReactNode {
  const { dataempresa } = useEmpresaStore()
  const { mostrartop10productosmasvendidosxmonto } = useDetalleVentasStore()

  const { data, isLoading, error } = useQuery({
    queryKey: ['mostrar top10 productos masvendidosxmonto', dataempresa?.id],
    queryFn: () =>
      mostrartop10productosmasvendidosxmonto({
        id_empresa: dataempresa?.id ?? 0,
      }) as Promise<any>,
    enabled: !!dataempresa,
  })

  if (isLoading) return <BarLoader color="#6d6d6d" />
  if (error) return <span>error...{error.message}</span>

  return (
    <Container>
      <HeaderCard>
        <Title>TOP 10 (productos por monto)</Title>
      </HeaderCard>
      {data && data.length > 0 ? (
        <Top10ProductsTable
          data={data}
          setOpenRegister={() => {}}
          setSelectedData={() => {}}
          setAction={() => {}}
        />
      ) : (
        <span className="textsindata">sin data...</span>
      )}
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  border: 2px solid ${({ theme }) => theme.bordercolorDash};
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.background};

  .textsindata {
    text-align: center;
  }
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
