import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import styled from 'styled-components'

import { useFormattedDate } from '../../../../hooks/useFormattedDate'
import { useCajasStore } from '../../../../store/CajasStore'
import { useCierreCajaStore } from '../../../../store/CierreCajaStore'
import { useEmpresaStore } from '../../../../store/EmpresaStore'
import { useMetodosPagoStore } from '../../../../store/MetodosPagoStore'
import { useMovCajaStore } from '../../../../store/MovCajaStore'
import { useUsuariosStore } from '../../../../store/UsuariosStore'
import type { InsertarMovimientoCajaParams, MetodoPago } from '../../../../types'
import { BackButton } from '../../../molecules/BackButton'
import { Button } from '../../../molecules/Button'
import { TextInput2 } from '../../forms/TextInput2'

interface FormData {
  monto: number
  motivo?: string
}

export function MoneyInOutScreen() {
  const fechaActual = useFormattedDate()
  const { tipoRegistro, setStateIngresoSalida } = useCierreCajaStore()
  const { insertarMovCaja } = useMovCajaStore()
  const [selectedMetodo, setSelectedMetodo] = useState<MetodoPago | null>(null)
  const { cajaSelectItem } = useCajasStore()
  const { dataMetodosPago } = useMetodosPagoStore()
  const { datausuarios } = useUsuariosStore()
  const { dataCierreCaja } = useCierreCajaStore()
  const { dataempresa } = useEmpresaStore()

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormData>()

  const insertar = async (data: FormData): Promise<void> => {
    const pmovcaja: InsertarMovimientoCajaParams = {
      fecha: fechaActual,
      tipo: tipoRegistro === 'ingreso' ? 'ingreso' : 'egreso',
      tipo_movimiento: tipoRegistro,
      monto: Number.parseFloat(String(data.monto)),
      id_metodo_pago: selectedMetodo?.id ?? 0,
      descripcion: `${tipoRegistro === 'ingreso' ? 'Ingreso' : 'Salida'} de dinero con ${selectedMetodo?.nombre ?? ''} ${data.motivo ? `- detalle: ${data.motivo}` : ''}`,
      id_usuario: datausuarios?.id ?? 0,
      id_cierre_caja: dataCierreCaja?.id ?? 0,
      id_caja: cajaSelectItem?.id ?? 0,
      id_empresa: dataempresa?.id ?? 0,
    }

    await insertarMovCaja(pmovcaja)
  }

  const { mutate: doInsertar } = useMutation({
    mutationKey: ['insertar ingresos salidas caja'],
    mutationFn: insertar,
    onSuccess: () => {
      toast.success('Registrado')
      setStateIngresoSalida(false)
      reset()
    },
    onError: (error: Error) => {
      const errorMessage = error.message || 'Error al registrar'
      toast.error(`Error: ${errorMessage}`)
    },
  })

  const manejadorEnvio = (data: FormData): void => {
    doInsertar(data)
  }

  const handleMetodoClick = (item: MetodoPago): void => {
    setSelectedMetodo(item)
  }

  useEffect(() => {
    const efectivo = dataMetodosPago?.find((item) => item.nombre === 'Efectivo')
    if (efectivo) {
      console.log(efectivo)
      setSelectedMetodo(efectivo)
    }
  }, [dataMetodosPago])

  return (
    <Container>
      <BackButton onClick={() => setStateIngresoSalida(false)} />

      <span className="title">
        {tipoRegistro === 'ingreso' ? 'INGRESAR DINERO A CAJA' : 'RETIRAR DINERO DE CAJA'}
      </span>

      <section className="areatipopago">
        {dataMetodosPago
          ?.filter((item) => item.nombre !== 'Mixto')
          .map((item, index) => {
            return (
              <article className="box" key={index}>
                <Button
                  title={item.nombre}
                  border="0"
                  height="70px"
                  width="100%"
                  onClick={() => handleMetodoClick(item)}
                  bgColor={item.id === selectedMetodo?.id ? '#FFD700' : '#FFF'}
                />
              </article>
            )
          })}
      </section>
      <form onSubmit={handleSubmit(manejadorEnvio)}>
        <section className="area1">
          <span>Monto:</span>
          <TextInput2>
            <input
              className="form__field"
              placeholder="0.00"
              type="number"
              {...register('monto', { required: true })}
            />
            {errors.monto?.type === 'required' && <p>Campo requerido</p>}
          </TextInput2>

          <span>Motivo (puede estar en blanco)</span>
          <TextInput2>
            <textarea
              className="form__field"
              rows={3}
              placeholder="motivo"
              {...register('motivo')}
            />
          </TextInput2>
          <article className="contentbtn">
            <Button title="REGISTRAR" color="#ffffff" border="2px" bgColor="#1da939" />
          </article>
        </section>
      </form>
    </Container>
  )
}

const Container = styled.div`
  height: 100vh;
  position: absolute;
  background-color: ${({ theme }) => theme.backgroundSecondarytotal};
  width: 100%;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .areatipopago {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 10px;

    .box {
      flex: 1 1 40%;
      display: flex;
      gap: 10px;
    }
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
    }
  }
`
