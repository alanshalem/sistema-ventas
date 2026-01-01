import styled from 'styled-components'

import { useValidarPermisosOperativos } from '../../../hooks/useValidarPermisosOperativos'
import { useDetalleVentasStore } from '../../../store/DetalleVentasStore'
import { useMetodosPagoStore } from '../../../store/MetodosPagoStore'
import { useVentasStore } from '../../../store/VentasStore'
import { Device } from '../../../styles/breakpoints'
import { Button } from '../../molecules/Button'
import { POSTotal } from './POSTotal'

interface MetodoPagoWithIcon {
  id: number
  nombre: string
  icono: string
}

export function POSKeyboardArea() {
  const { setStatePantallaCobro, stateMetodosPago } = useVentasStore()
  const { dataMetodosPago: datametodospago } = useMetodosPagoStore()
  const { datadetalleventa } = useDetalleVentasStore()
  const { validarPermiso } = useValidarPermisosOperativos()

  const ValidarPermisocobrar = (p: MetodoPagoWithIcon): void => {
    const response = validarPermiso('Cobrar venta')
    if (!response) return
    console.log('tipocobro', p.nombre)
    setStatePantallaCobro({ data: datadetalleventa, tipocobro: p.nombre })
  }

  return (
    <Container $stateMetodosPago={stateMetodosPago}>
      <section className="areatipopago">
        {datametodospago?.map((item: any, index: number) => {
          return (
            <article className="box" key={index}>
              <Button
                image={undefined}
                onClick={() => ValidarPermisocobrar(item)}
                title={item.nombre}
                border="0"
                height="70px"
                width="100%"
              />
            </article>
          )
        })}
      </section>
      <section className="totales">
        <POSTotal />
      </section>
    </Container>
  )
}

const Container = styled.div<{ $stateMetodosPago: boolean }>`
  border: 1px solid ${({ theme }) => theme.neutral};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  bottom: 10px;
  width: calc(100% - 5px);
  border-radius: 15px;
  @media ${Device.desktop} {
    position: relative;
    width: 450px;
    bottom: initial;
  }
  .areatipopago {
    display: ${({ $stateMetodosPago }) => ($stateMetodosPago ? 'flex' : 'none')};
    flex-wrap: wrap;
    gap: 10px;
    padding: 10px;
    @media ${Device.desktop} {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      padding: 10px;
    }
    .box {
      flex: 1 1 40%;
      display: flex;
      gap: 10px;
    }
  }
  .totales {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    .subtotal {
      display: none;
      flex-direction: column;
      justify-content: end;
      text-align: end;
      gap: 10px;
      font-weight: 500;
      @media ${Device.desktop} {
        display: flex;
      }
    }
  }
`
