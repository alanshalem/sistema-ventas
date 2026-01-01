import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { BarLoader } from 'react-spinners'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import styled from 'styled-components'

import animacionvacio from '../../../assets/vacioanimacion.json'
import { useDetalleVentasStore } from '../../../store/DetalleVentasStore'
import { useEmpresaStore } from '../../../store/EmpresaStore'
import { useThemeStore } from '../../../store/ThemeStore'
import { LottieAnimation } from '../../atoms/LottieAnimation'

export function Top5ProductsChart(): ReactNode {
  const { dataempresa } = useEmpresaStore()
  const { themeStyle } = useThemeStore()
  const { mostrartop5productosmasvendidosxcantidad } = useDetalleVentasStore()

  const { data, isLoading, error } = useQuery({
    queryKey: ['mostrar top5 productos mas vendidos xcantidad', dataempresa?.id],
    queryFn: () =>
      mostrartop5productosmasvendidosxcantidad({
        id_empresa: dataempresa?.id ?? 0,
      }) as Promise<any>,
    enabled: !!dataempresa,
  })

  if (isLoading) return <BarLoader color="#6d6d6d" />
  if (error) return <span>error...{error.message}</span>

  return (
    <Container>
      <Header>
        <Title>TOP 5</Title>
        <Subtitle>Productos por cantidad vendida</Subtitle>
      </Header>

      {data && data.length > 0 ? (
        <>
          {(data as any[]).map((item: any, index: number) => (
            <Row key={index}>
              <NameContent>
                <Name>{item.nombre_producto}</Name>
              </NameContent>
              <Stats>
                <Value>{item.total_vendido}</Value>
                <Percentage>{item.porcentaje}%</Percentage>
              </Stats>
            </Row>
          ))}

          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              width={500}
              height={400}
              data={data}
              margin={{
                top: 10,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <XAxis
                dataKey="nombre_producto"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="total_vendido"
                fill={themeStyle.text}
                fillOpacity={1}
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </>
      ) : (
        <LottieAnimation animation={animacionvacio} height="200" width="200" />
      )}
    </Container>
  )
}

function CustomTooltip({ active, payload, label }: any): ReactNode {
  if (active && payload && payload.length) {
    return (
      <TooltipContainer>
        <Date>{label}</Date>
        <Value>cant: {payload[0].value}</Value>
      </TooltipContainer>
    )
  }
  return null
}

const Container = styled.div`
  padding: 20px;
`

const Header = styled.div`
  margin-bottom: 20px;
  text-align: center;
`

const Title = styled.h3`
  font-size: 25px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  margin: 0;
`

const Subtitle = styled.p`
  font-size: 18px;
  color: #6b7280;
  margin: 5px 0 0;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 8px;
`

const NameContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 2;
`

const Name = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`

const Stats = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`

const Value = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: ${({ theme }) => theme.textOnCard};
`

const Percentage = styled.span`
  font-size: 12px;
  font-weight: bold;
  color: #828282;
`

const TooltipContainer = styled.div`
  background: ${({ theme }) => theme.backgroundSecondary};
  padding: 10px;
  border-radius: 8px;
  font-size: 12px;
  box-shadow: ${({ theme }) => theme.boxshadow};
`

const Date = styled.div`
  font-size: 14px;
`
