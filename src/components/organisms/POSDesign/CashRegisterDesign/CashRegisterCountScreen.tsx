import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ChangeEvent } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { BarLoader } from 'react-spinners'
import { toast } from 'sonner'
import styled from 'styled-components'

import { Button, FormatearNumeroDinero, useAuthStore, useEmpresaStore } from '../../../..'
import { useCierreCajaStore } from '../../../../store/CierreCajaStore'
import { useMovCajaStore } from '../../../../store/MovCajaStore'
import type { CerrarCajaParams } from '../../../../types'
import { BackButton } from '../../../molecules/BackButton'
import { TextInput2 } from '../../forms/TextInput2'

interface FormData {
  montoreal: number
}

export function CashRegisterCountScreen() {
  const { cerrarSesion } = useAuthStore()
  const [montoEfectivo, setMontoEfectivo] = useState<number>(0)
  const { totalEfectivoTotalCaja } = useMovCajaStore()
  const { dataempresa } = useEmpresaStore()
  const { cerrarTurnoCaja, dataCierreCaja, setStateConteoCaja, setStateCierraCaja } =
    useCierreCajaStore()
  const queryClient = useQueryClient()

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormData>()

  const diferencia = montoEfectivo - totalEfectivoTotalCaja

  const insertar = async (data: FormData): Promise<void> => {
    const p: CerrarCajaParams = {
      id: dataCierreCaja?.id ?? 0,
      saldo_final: Number.parseFloat(String(data.montoreal)),
      total_ingresos: totalEfectivoTotalCaja,
      total_egresos: 0,
      observaciones: `Diferencia: ${diferencia}`,
    }
    console.log(p)
    await cerrarTurnoCaja(p)
  }

  const { isPending, mutate: doInsertar } = useMutation({
    mutationKey: ['cerrar turno caja'],
    mutationFn: insertar,
    onSuccess: () => {
      toast.success('Caja cerrada correctamente')
      setStateConteoCaja(false)
      setStateCierraCaja(false)
      reset()
      queryClient.invalidateQueries({ queryKey: ['mostrar cierre de caja'] })
      cerrarSesion()
    },
    onError: (error: Error) => {
      toast.error(`Error al cerrar caja: ${error.message}`)
    },
  })

  const handleSub = (data: FormData): void => {
    doInsertar(data)
  }

  const anuncioMensaje =
    diferencia === 0
      ? 'Genial, todo está perfecto'
      : 'La diferencia será registrada en su turno y se enviará a gerencia'
  const anuncioColor = diferencia === 0 ? '#09bc42' : '#ff3f56'

  return (
    <Container>
      <BackButton onClick={() => setStateConteoCaja(false)} />
      <span className="title">Efectivo esperado en caja:</span>
      <span className="title">
        {FormatearNumeroDinero(
          totalEfectivoTotalCaja,
          dataempresa?.currency,
          dataempresa?.iso
        )}{' '}
      </span>
      {isPending ? (
        <BarLoader color="#2af169" />
      ) : (
        <form onSubmit={handleSubmit(handleSub)}>
          <section className="area1">
            <span>¿Cuánto de EFECTIVO hay en caja física?</span>
            <TextInput2>
              <input
                type="number"
                placeholder="0.00"
                step="0.01"
                className="form__field"
                {...register('montoreal', {
                  required: true,
                  onChange: (e: ChangeEvent<HTMLInputElement>) =>
                    setMontoEfectivo(Number.parseFloat(e.target.value) || 0),
                })}
              />
              {errors.montoreal?.type === 'required' && <p>Campo requerido</p>}
            </TextInput2>
            <Divider />
            <span style={{ textAlign: 'center' }}>
              diferencia:{' '}
              {FormatearNumeroDinero(diferencia, dataempresa?.currency, dataempresa?.iso)}
            </span>
            <article className="contentbtn">
              <Button
                title="CERRAR TURNO"
                color="#ffffff"
                border="2px"
                bgColor="#1da939"
              />
            </article>
          </section>
        </form>
      )}

      <span style={{ color: anuncioColor, textAlign: 'center' }}>{anuncioMensaje} </span>
    </Container>
  )
}

const Container = styled.div`
  position: absolute;
  height: 100vh;
  background-color: ${({ theme }) => theme.backgroundSecondarytotal};
  width: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  gap: 10px;
  flex-direction: column;
  input {
    text-align: center;
  }
  p {
    color: #ff0062;
    font-weight: bold;
  }
  .title {
    font-size: 25px;
    font-weight: bold;
  }
  .area1 {
    display: flex;
    flex-direction: column;
    gap: 12px;
    .contentbtn {
      margin-top: 15px;
      display: flex;
      gap: 12px;
      justify-content: center;
    }
  }
`

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.neutral};
  margin-right: 10px;
`
