import { Icon } from '@iconify/react'
import styled from 'styled-components'

import { useDetalleVentasStore, useEmpresaStore, useVentasStore } from '../../..'
import { useValidarPermisosOperativos } from '../../../hooks/useValidarPermisosOperativos'
import { Device } from '../../../styles/breakpoints'
import { FormatearNumeroDinero } from '../../../utils/Conversiones'
import { Button } from '../../molecules/Button'

export function POSTotal() {
  const { setStateMetodosPago } = useVentasStore()
  const { total } = useDetalleVentasStore()
  const { dataempresa } = useEmpresaStore()
  const { validarPermiso } = useValidarPermisosOperativos()

  const validarPermisoCobrar = (): void => {
    const hasPermission = validarPermiso('Cobrar venta')
    if (!hasPermission) return
    setStateMetodosPago()
  }

  return (
    <Container>
      <section className="imagen">
        <img src="https://i.ibb.co/HdYgDdp/corazon-2.png" alt="Heart" />
      </section>
      <section className="contentTotal">
        <section className="contentTituloTotal">
          <Button
            border="2px"
            bgColor="#ffffff"
            color="#207c33"
            onClick={validarPermisoCobrar}
            title="COBRAR"
            icon={<Icon icon="fluent-emoji:money-with-wings" />}
          />
        </section>
        <span>
          {FormatearNumeroDinero(total, dataempresa?.currency, dataempresa?.iso)}
        </span>
      </section>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  text-align: center;
  justify-content: space-between;
  border-radius: 15px;
  font-weight: 700;
  font-size: 38px;
  background-color: #3ff563;
  padding: 10px;
  color: #207c33;
  position: relative;
  overflow: hidden;
  &::after {
    content: '';
    display: block;
    width: 100px;
    height: 100px;
    background-color: #7fff99;
    position: absolute;
    border-radius: 50%;
    top: -20px;
    left: -15px;
  }
  &::before {
    content: '';
    display: block;
    width: 20px;
    height: 20px;
    background-color: ${({ theme }) => theme.backgroundSecondarytotal};
    position: absolute;
    border-radius: 50%;
    top: 5px;
    right: 5px;
  }
  .imagen {
    z-index: 1;
    width: 55px;
    position: relative;
    @media ${Device.desktop} {
      bottom: initial;
    }
    img {
      width: 100%;
    }
  }
  .contentTotal {
    z-index: 10;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    .contentTituloTotal {
      display: flex;
      align-items: center;
      position: relative;
      margin-top: 30px;
      justify-content: end;
      align-content: end;
      @media ${Device.desktop} {
        display: none;
      }
    }
  }
`
