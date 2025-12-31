import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast, Toaster } from 'sonner'
import styled from 'styled-components'

import { useFormattedDate } from '../../../../hooks/useFormattedDate'
import { useAsignacionCajaSucursalStore } from '../../../../store/AsignacionCajaSucursalStore'
import { useCajasStore } from '../../../../store/CajasStore'
import { useCierreCajaStore } from '../../../../store/CierreCajaStore'
import { useMetodosPagoStore } from '../../../../store/MetodosPagoStore'
import { useMovCajaStore } from '../../../../store/MovCajaStore'
import { useUsuariosStore } from '../../../../store/UsuariosStore'
import { Device } from '../../../../styles/breakpoints'
import { useMostrarCierreCajaPorEmpresaQuery } from '../../../../tanstack/CierresCajaStack'
import { Button } from '../../../molecules/Button'
import { InputText2 } from '../../formularios/InputText2'
import { CardListCajas } from './CardListCajas'
export function PantallaAperturaCaja() {
  const { dataSucursalesAsignadas } = useAsignacionCajaSucursalStore()

  const { setCajaSelectItem } = useCajasStore()
  const { setCierreCajaItemSelect } = useCierreCajaStore()
  const { data: dataCierreCajaPorEmpresa } = useMostrarCierreCajaPorEmpresaQuery()

  return (
    <Container>
      <Toaster position="top-center" />
      <ContainerCajas>
        <span className="title">Seleccione una caja a aperturar</span>
        {dataSucursalesAsignadas?.map((item, index) => {
          let state = Boolean(false)
          let aperturaActiva = null
          if (Array.isArray(dataCierreCajaPorEmpresa)) {
            aperturaActiva = dataCierreCajaPorEmpresa.find((a) => a.id_caja === item.id)
            state = Boolean(aperturaActiva)
          }
          return (
            <CardListCajas
              key={index}
              title={item.caja?.descripcion}
              sucursal={item.sucursales?.nombre}
              funcion={() => {
                setCajaSelectItem(item)
                if (state) {
                  setCierreCajaItemSelect(aperturaActiva)
                }
              }}
              bgcolor={state ? '#f34a4a' : '#58CC02'}
              state={state}
              subtitle={state ? `${aperturaActiva?.rol}-${aperturaActiva?.usuario}` : 0}
            />
          )
        })}
      </ContainerCajas>
    </Container>
  )
}
const Container = styled.div`
  padding-top: 40px;
  width: 100%;
  background-color: ${({ theme }) => theme.bgtotal};
  align-items: center;
  justify-content: center;
  display: flex;
`
const ContainerCajas = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin: 10px;
  @media ${Device.tablet} {
    width: 550px;
  }
  .title {
    font-weight: bold;
    font-size: 18px;
  }
`
