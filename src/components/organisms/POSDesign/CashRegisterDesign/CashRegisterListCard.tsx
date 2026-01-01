import { Icon } from '@iconify/react/dist/iconify.js'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ChangeEvent } from 'react'
import { useState } from 'react'
import { toast } from 'sonner'
import styled from 'styled-components'

import { useFormattedDate } from '../../../../hooks/useFormattedDate'
import { useCajasStore } from '../../../../store/CajasStore'
import { useCierreCajaStore } from '../../../../store/CierreCajaStore'
import { useEmpresaStore } from '../../../../store/EmpresaStore'
import { useMetodosPagoStore } from '../../../../store/MetodosPagoStore'
import { useMovCajaStore } from '../../../../store/MovCajaStore'
import { useUsuariosStore } from '../../../../store/UsuariosStore'
import type { AbrirCajaParams, InsertarMovimientoCajaParams } from '../../../../types'
import { Button } from '../../../molecules/Button'
import { TextInput2 } from '../../forms/TextInput2'

interface CashRegisterListCardProps {
  readonly title: string
  readonly subtitle: string | number
  readonly bgcolor: string
  readonly funcion: () => void
  readonly sucursal: string
  readonly state: boolean
}

export function CashRegisterListCard({
  title,
  subtitle,
  bgcolor,
  funcion,
  sucursal,
  state,
}: Readonly<CashRegisterListCardProps>) {
  const [montoEfectivo, setMontoEfectivo] = useState<number>(0)
  const fechaActual = useFormattedDate()
  const queryClient = useQueryClient()
  const { datausuarios } = useUsuariosStore()
  const { dataempresa } = useEmpresaStore()

  const { aperturarcaja } = useCierreCajaStore()
  const { dataMetodosPago } = useMetodosPagoStore()
  const { insertarMovCaja } = useMovCajaStore()
  const { cajaSelectItem } = useCajasStore()

  const registrarMovCaja = async (p: { id_cierre_caja: number }): Promise<void> => {
    const efectivoMethod = dataMetodosPago?.find((item) => item.nombre === 'Efectivo')
    const id_metodo_pago = efectivoMethod?.id ?? 0
    const pmovcaja: InsertarMovimientoCajaParams = {
      fecha: fechaActual,
      tipo: 'ingreso',
      tipo_movimiento: 'apertura',
      monto: montoEfectivo || 0,
      id_metodo_pago,
      descripcion: 'Apertura de caja con',
      id_usuario: datausuarios?.id ?? 0,
      id_cierre_caja: p.id_cierre_caja,
      id_caja: cajaSelectItem?.id ?? 0,
      id_empresa: dataempresa?.id ?? 0,
    }

    await insertarMovCaja(pmovcaja)
  }

  const insertar = async (): Promise<void> => {
    const p: AbrirCajaParams = {
      id_caja: cajaSelectItem?.id ?? 0,
      id_usuario: datausuarios?.id ?? 0,
      saldo_inicial: montoEfectivo,
      id_empresa: dataempresa?.id ?? 0,
    }
    console.log('pcierrecaja', p)
    const data = await aperturarcaja(p)

    await registrarMovCaja({ id_cierre_caja: data?.id ?? 0 })
  }

  const mutation = useMutation({
    mutationKey: ['aperturar caja'],
    mutationFn: insertar,
    onSuccess: () => {
      toast.success('Caja aperturada correctamente')
      queryClient.invalidateQueries({ queryKey: ['mostrar cierre de caja'] })
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`)
    },
  })

  return (
    <Container $bgcolor={bgcolor} onClick={funcion} $state={!state}>
      <article className="content-wrapper">
        <section className="badge-container">
          <span className="badge-button">
            {title} {state ? '(aperturada)' : '(libre)'}{' '}
          </span>
        </section>

        <span className="sucursal-text">Sucursal: {sucursal} </span>
        {subtitle !== 0 && (
          <section className="title-section">
            <Icon
              className="subtitle"
              icon="pepicons-print:open"
              width="20"
              height="20"
            />
            <span className="label">caja aperturada por: </span>
            <span className="subtitle">{subtitle} </span>
          </section>
        )}
        {state && <Button title="TOMAR TURNO" />}

        {!state && (
          <section className="contentInputs">
            <span className="title">Aperturar caja con:</span>
            <TextInput2>
              <input
                className="form__field"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setMontoEfectivo(Number.parseFloat(e.target.value) || 0)
                }
                type="number"
                placeholder="0.00"
              />
            </TextInput2>
          </section>
        )}

        {!state && (
          <article className="contentbtn">
            <Button
              title="OMITIR"
              onClick={() => {
                setMontoEfectivo(0)
                mutation.mutateAsync()
              }}
            />
            <Button
              title="APERTURAR"
              color="#ffffff"
              border="2px"
              bgColor="#0d0d0d"
              onClick={() => mutation.mutateAsync()}
            />
          </article>
        )}
      </article>
    </Container>
  )
}

const Container = styled.section<{ $bgcolor: string; $state: boolean }>`
  transition: 0.2s;
  transition-timing-function: linear;
  cursor: pointer;
  position: relative;
  background-color: ${({ theme }) => theme.background};
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  gap: 1.25rem;
  overflow: hidden;
  border: 1px solid rgba(50, 50, 50, 0.4);
  transform: translate(0, -3px);

  &:active {
    transform: translate(0, 0);
  }

  &::before {
    content: '';
    display: flex;
    width: 60px;
    height: 60px;
    background-color: rgba(251, 251, 251, 0.25);
    position: absolute;
    border-radius: 50%;
    bottom: -15px;
    right: -15px;
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 15px;
  }
  .contentInputs {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .form__field:focus {
      font-weight: 700;
      border-image-slice: 1;
      border: 2px solid ${(props) => props.$bgcolor};
    }
  }
  .contentbtn {
    display: flex;
    gap: 10px;
  }
  .badge-container {
    color: ${(props) => props.$bgcolor};
    border-radius: 8px;
    display: flex;
    gap: 0.5rem;
  }

  .badge-button {
    font-weight: bold;
    text-transform: uppercase;
  }
  .sucursal-text {
    font-weight: bold;
  }
  .title-section {
    display: flex;
    gap: 4px;
    align-items: center;
    .label {
      font-size: 14px;
    }
    .subtitle {
      font-weight: 600;
      font-size: 16px;
    }
  }

  .title {
    font-weight: bold;
  }

  .emoji-container {
    position: absolute;
    right: 10px;
    display: flex;
    align-items: center;
    height: 60px;
    font-size: 2rem;
  }

  .character-image {
    height: 100%;
    position: relative;
  }
`
