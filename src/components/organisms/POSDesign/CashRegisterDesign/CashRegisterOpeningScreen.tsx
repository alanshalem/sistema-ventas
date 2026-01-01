import { Toaster } from 'sonner'
import styled from 'styled-components'

import { useAsignacionCajaSucursalStore } from '../../../../store/AsignacionCajaSucursalStore'
import { useCajasStore } from '../../../../store/CajasStore'
import { useCierreCajaStore } from '../../../../store/CierreCajaStore'
import { Device } from '../../../../styles/breakpoints'
import { useMostrarCierreCajaPorEmpresaQuery } from '../../../../tanstack/CierresCajaStack'
import type { Caja } from '../../../../types'
import { CashRegisterListCard } from './CashRegisterListCard'

interface CierreCajaApertura {
  id: number
  id_caja: number
  rol: string
  usuario: string
}

export function CashRegisterOpeningScreen() {
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
          let state = false
          let aperturaActiva: CierreCajaApertura | null = null

          if (Array.isArray(dataCierreCajaPorEmpresa)) {
            const found = dataCierreCajaPorEmpresa.find((a: unknown) => {
              const apertura = a as CierreCajaApertura
              return apertura.id_caja === item.id_caja
            })
            if (found) {
              aperturaActiva = found as CierreCajaApertura
              state = true
            }
          }

          return (
            <CashRegisterListCard
              key={index}
              title={item.caja?.descripcion ?? ''}
              sucursal={item.sucursales?.nombre ?? ''}
              funcion={() => {
                const cajaItem: Caja = {
                  id: item.caja?.id ?? 0,
                  nombre: item.caja?.nombre ?? '',
                  descripcion: item.caja?.descripcion,
                  id_empresa: item.caja?.id_empresa ?? 0,
                  id_sucursal: item.id_sucursal,
                }
                setCajaSelectItem(cajaItem)
                if (state && aperturaActiva) {
                  setCierreCajaItemSelect({
                    id: aperturaActiva.id,
                    id_caja: aperturaActiva.id_caja,
                    id_usuario: 0,
                    fecha_apertura: '',
                    saldo_inicial: 0,
                    total_ingresos: 0,
                    total_egresos: 0,
                    saldo_final: 0,
                    estado: 'abierto',
                    id_empresa: item.caja?.id_empresa ?? 0,
                  })
                }
              }}
              bgcolor={state ? '#f34a4a' : '#58CC02'}
              state={state}
              subtitle={
                state && aperturaActiva
                  ? `${aperturaActiva.rol}-${aperturaActiva.usuario}`
                  : 0
              }
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
  background-color: ${({ theme }) => theme.backgroundSecondarytotal};
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
