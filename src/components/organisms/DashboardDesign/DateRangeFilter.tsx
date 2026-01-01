import { DatePicker } from 'antd'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { useDashboardStore } from '../../../store/DashboardStore'

const { RangePicker } = DatePicker

type RangeName =
  | 'Todo'
  | '7 días'
  | '30 días'
  | '12 meses'
  | 'Hoy'
  | 'Por Día'
  | 'Rango'
  | 'Limpiar'

export function DateRangeFilter(): ReactNode {
  const [dates, setDates] = useState<[Dayjs, Dayjs]>([
    dayjs('1900-01-01'),
    dayjs('9999-12-31'),
  ])
  const [singleDate, setSingleDate] = useState<Dayjs | null>(null)
  const [activeRange, setActiveRange] = useState<RangeName>('Todo')

  const { setRangoFechas, limpiarFechas } = useDashboardStore()

  const setSiempreRange = (): void => {
    const startDate = dayjs('1900-01-01')
    const endDate = dayjs('9999-12-31')
    setDates([startDate, endDate])
    setActiveRange('Todo')
    setRangoFechas(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'))
  }

  const setPresetRange = (days: number, rangeName: RangeName): void => {
    const startDate = dayjs().subtract(days, 'day').startOf('day')
    const endDate = dayjs().endOf('day')
    setDates([startDate, endDate])
    setRangoFechas(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'))
    setActiveRange(rangeName)
  }

  const selectToday = (): void => {
    const today = dayjs().startOf('day')
    setSingleDate(today)
    setRangoFechas(today.format('YYYY-MM-DD'), today.format('YYYY-MM-DD'))
    setActiveRange('Hoy')
  }

  const handleClearFilter = (): void => {
    setSingleDate(null)
    limpiarFechas()
    setActiveRange('Rango')
  }

  useEffect(() => {
    setSiempreRange()
  }, [])

  return (
    <Container>
      <ButtonGroup>
        <TimeRangeButton onClick={setSiempreRange} $isActive={activeRange === 'Todo'}>
          Todo
        </TimeRangeButton>
        <TimeRangeButton
          $isActive={activeRange === '7 días'}
          onClick={() => setPresetRange(7, '7 días')}
        >
          Últimos días 7 dias
        </TimeRangeButton>
        <TimeRangeButton
          $isActive={activeRange === '30 días'}
          onClick={() => setPresetRange(30, '30 días')}
        >
          Últimos 30 días
        </TimeRangeButton>
        <TimeRangeButton
          $isActive={activeRange === '12 meses'}
          onClick={() => setPresetRange(365, '12 meses')}
        >
          Últimos 12 meses
        </TimeRangeButton>
        <TimeRangeButton $isActive={activeRange === 'Hoy'} onClick={selectToday}>
          Hoy
        </TimeRangeButton>
        <TimeRangeButton
          $isActive={activeRange === 'Por Día'}
          onClick={() => setActiveRange('Por Día')}
        >
          Por Día
        </TimeRangeButton>
        <TimeRangeButton
          $isActive={activeRange === 'Limpiar'}
          onClick={handleClearFilter}
        >
          Limpiar filtro
        </TimeRangeButton>
      </ButtonGroup>

      {(activeRange === '30 días' ||
        activeRange === '12 meses' ||
        activeRange === '7 días') && (
        <StyledRangePicker
          format="YYYY-MM-DD"
          onChange={(dates, dateStrings) => {
            if (dates && dates[0] && dates[1]) {
              setDates([dates[0], dates[1]])
              setRangoFechas(dateStrings[0], dateStrings[1])
            } else {
              setDates([dayjs('1900-01-01'), dayjs('9999-12-31')])
            }
          }}
          value={dates}
        />
      )}

      {activeRange === 'Por Día' && (
        <StyledDatePicker
          format="YYYY-MM-DD"
          onChange={(date, dateString) => {
            const dateObj = date as Dayjs | null
            const dateStr = Array.isArray(dateString) ? dateString[0] : dateString
            setSingleDate(dateObj)
            if (dateObj && dateStr) {
              setRangoFechas(dateStr, dateStr)
            }
            setActiveRange('Por Día')
          }}
          value={singleDate}
        />
      )}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 20px;
`

const ButtonGroup = styled.div``

const TimeRangeButton = styled.button<{ readonly $isActive: boolean }>`
  color: ${({ theme }) => theme.text};
  background-color: ${({ $isActive, theme }) =>
    $isActive ? theme.backgroundSecondary : 'transparent'};
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  font-weight: ${({ $isActive }) => ($isActive ? 'bold' : 'normal')};
`

const StyledRangePicker = styled(RangePicker)`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border: 2px dashed ${({ theme }) => theme.background};

  .ant-picker-input > input {
    color: ${({ theme }) => theme.text};
    font-weight: bold;
  }

  .ant-picker-input input::placeholder {
    color: ${({ theme }) => theme.text};
  }

  .ant-picker-suffix {
    color: ${({ theme }) => theme.text};
  }

  &:hover {
    background-color: ${({ theme }) => theme.background};
  }

  &:focus,
  &.ant-picker-focused {
    background-color: ${({ theme }) => theme.backgroundSecondary};
  }
`

const StyledDatePicker = styled(DatePicker)`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border: 2px dashed ${({ theme }) => theme.background};

  .ant-picker-input > input {
    color: ${({ theme }) => theme.text};
    font-weight: bold;
  }

  .ant-picker-input input::placeholder {
    color: ${({ theme }) => theme.text};
  }

  .ant-picker-suffix {
    color: ${({ theme }) => theme.text};
  }

  &:hover {
    background-color: ${({ theme }) => theme.background};
  }

  &:focus,
  &.ant-picker-focused {
    background-color: ${({ theme }) => theme.backgroundSecondary};
  }
`
