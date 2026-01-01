import { Icon } from '@iconify/react/dist/iconify.js'
import type { ReactNode } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import styled from 'styled-components'

import { useEmpresaStore } from '../../../store/EmpresaStore'
import { useReportesStore } from '../../../store/ReportesStore'
import { useThemeStore } from '../../../store/ThemeStore'
import {
  useGananciasDetalleVentaQuery,
  useMostrarCantidadDetalleVentaDashboardQuery,
  useMostrarVentasDashboardPeriodoAnteriorQuery,
  useMostrarVentasDashboardQuery,
} from '../../../tanstack/ReportesStack'
import { FormatearNumeroDinero } from '../../../utils/Conversiones'

export function SalesChart(): ReactNode {
  const { data } = useMostrarVentasDashboardQuery()
  useMostrarVentasDashboardPeriodoAnteriorQuery()
  useMostrarCantidadDetalleVentaDashboardQuery()
  useGananciasDetalleVentaQuery()

  const { totalventas, porcentajeCambio } = useReportesStore()
  const { dataempresa } = useEmpresaStore()
  const { themeStyle } = useThemeStore()

  const isPositive = porcentajeCambio > 0
  const isNeutral = porcentajeCambio === 0

  return (
    <Container>
      <Header>
        <Title>Total ventas</Title>
      </Header>

      <MainInfo>
        <Revenue>
          {FormatearNumeroDinero(
            totalventas || 0,
            dataempresa?.currency,
            dataempresa?.iso
          )}
        </Revenue>
        <Change>
          <Percentage $isPositive={isPositive} $isNeutral={isNeutral}>
            <Icon
              width="26"
              height="26"
              icon={
                isNeutral
                  ? 'akar-icons:minus'
                  : isPositive
                    ? 'iconamoon:arrow-up-2-fill'
                    : 'iconamoon:arrow-down-2-fill'
              }
            />
            {porcentajeCambio}% al periodo anterior
          </Percentage>
        </Change>
      </MainInfo>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
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
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={themeStyle.text} stopOpacity={0.2} />
              <stop offset="95%" stopColor={themeStyle.text} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeOpacity={0.2} vertical={false} />
          <XAxis
            dataKey="fecha"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Area
            strokeWidth={1.5}
            type="monotone"
            dataKey="total_ventas"
            stroke={themeStyle.text}
            fill="url(#colorValue)"
            activeDot={{ r: 6 }}
            fillOpacity={1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Container>
  )
}

function CustomTooltip({ active, payload, label }: any): ReactNode {
  const { dataempresa } = useEmpresaStore()

  if (active && payload && payload.length) {
    return (
      <TooltipContainer>
        <Date>{label}</Date>
        <Value>
          {FormatearNumeroDinero(
            payload[0].value ?? 0,
            dataempresa?.currency,
            dataempresa?.iso
          )}
        </Value>
      </TooltipContainer>
    )
  }
  return null
}

const Container = styled.div``

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
`

const Title = styled.h3`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`

const MainInfo = styled.div`
  margin: 20px 0;
  padding-left: 20px;
`

const Revenue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`

const Change = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
`

const Percentage = styled.span<{
  readonly $isPositive: boolean
  readonly $isNeutral: boolean
}>`
  display: flex;
  text-align: center;
  align-items: center;
  font-size: 14px;
  color: ${({ $isNeutral, $isPositive }) =>
    $isNeutral ? '#6b7280' : $isPositive ? '#12ca3a' : '#d32f5b'};
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

const Value = styled.div`
  font-size: 16px;
  font-weight: bold;
`
