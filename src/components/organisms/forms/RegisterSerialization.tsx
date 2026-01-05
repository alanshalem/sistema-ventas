import type { ChangeEvent } from 'react'
import { useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'

import { Button, TextInput } from '../../../index'
import { useAsignacionCajaSucursalStore } from '../../../store/AsignacionCajaSucursalStore'
import { useGlobalStore } from '../../../store/GlobalStore'
import { v } from '../../../styles/variables'
import { useEditarSerializacionMutation } from '../../../tanstack/SerializacionStack'
import type { Serializacion, TipoDocumento } from '../../../types'
import { BtnClose } from '../../ui/buttons/BtnClose'

interface FormData {
  cantidad_numeros: number
  correlativo: number
  serie: string
  sucursal_id: number
}

interface SerializacionConTipoComprobante extends Serializacion {
  tipo_comprobantes: TipoDocumento | null
}

export function RegisterSerialization() {
  const { setStateClose, itemSelect } = useGlobalStore()
  const typedItemSelect = itemSelect as SerializacionConTipoComprobante | null
  const [cantidadNumeros, setCantidadNumeros] = useState(
    typedItemSelect?.cantidad_numeros ?? 0
  )
  const { sucursalesItemSelectAsignadas } = useAsignacionCajaSucursalStore()
  const { mutate } = useEditarSerializacionMutation()
  const [correlativo, setCorrelativo] = useState(typedItemSelect?.correlativo ?? 0)
  const [serie, setSerie] = useState(typedItemSelect?.serie ?? '')

  const formatearCorrelativo = (numero: number, longitud: number): string => {
    return String(numero).padStart(longitud, '0')
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: {
      cantidad_numeros: typedItemSelect?.cantidad_numeros,
      correlativo: typedItemSelect?.correlativo,
      serie: typedItemSelect?.serie,
      sucursal_id: sucursalesItemSelectAsignadas?.id_sucursal,
    },
  })

  const handleSubmitForm: SubmitHandler<FormData> = (data) => {
    mutate(data)
  }

  return (
    <Container>
      <section className="sub-container">
        <div className="comprobante">
          <BtnClose funcion={() => setStateClose(false)} />
          <span className="title">Comprobante</span>
          <div className="tipo"> {typedItemSelect?.tipo_comprobantes?.nombre} </div>
          <div className="numero">
            <span>{serie}-</span>
            <span>{formatearCorrelativo(correlativo, cantidadNumeros)}</span>
          </div>
        </div>

        <form className="form" onSubmit={handleSubmit(handleSubmitForm)}>
          <article>
            <TextInput icono={<v.rightArrowIcon />}>
              <input
                className="form__field"
                placeholder="Cantidad de numeros"
                type="number"
                value={cantidadNumeros}
                {...register('cantidad_numeros', {
                  required: true,
                })}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setCantidadNumeros(Math.max(1, parseInt(e.target.value) || 1))
                }
              />
              <label className="form__label">Cantidad de numeros</label>
              {errors.cantidad_numeros?.type === 'required' && <p>Campo requerido</p>}
            </TextInput>
          </article>
          <article>
            <TextInput icono={<v.rightArrowIcon />}>
              <input
                className="form__field"
                placeholder="Correlativos"
                type="number"
                value={correlativo}
                {...register('correlativo', {
                  required: true,
                })}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setCorrelativo(Math.max(0, parseInt(e.target.value) || 0))
                }
              />
              <label className="form__label">Correlativo</label>
              {errors.correlativo?.type === 'required' && <p>Campo requerido</p>}
            </TextInput>
          </article>

          <article>
            <TextInput icono={<v.rightArrowIcon />}>
              <input
                className="form__field"
                placeholder="Serie"
                type="text"
                value={serie}
                {...register('serie', {
                  required: true,
                })}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSerie(e.target.value.toUpperCase())
                }
              />
              <label className="form__label">Serie</label>
              {errors.serie?.type === 'required' && <p>Campo requerido</p>}
            </TextInput>
          </article>

          <div className="buttons">
            <Button title={'Guardar'} bgColor={'#fff'} />
          </div>
        </form>
      </section>
    </Container>
  )
}

const Container = styled.div`
  transition: 0.5s;
  top: 0;
  left: 0;
  position: fixed;
  display: flex;
  width: 100%;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  input {
    color: ${({ theme }) => theme.text};
  }
  .sub-container {
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    background: ${({ theme }) => theme.backgroundSecondarytotal};
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    align-items: center;
    justify-content: center;
    .form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
  }
  .comprobante {
    display: flex;
    gap: 8px;
    flex-direction: column;
    align-items: center;
    background: #fff;
    padding: 15px;
    border-radius: 8px;
    width: 300px;
    text-align: center;
    position: relative;
    margin-bottom: 20px;
    .title {
      color: #000;
      font-weight: bold;
      text-transform: uppercase;
    }
    .tipo {
      background: #ea5605;

      padding: 5px 10px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: bold;
      text-transform: uppercase;
    }

    .numero {
      margin-top: 10px;
      font-size: 18px;
      font-weight: bold;
      background: white;
      padding: 5px 10px;
      border-radius: 4px;
      border: 2px solid black;

      span:first-child {
        color: red;
      }
      span:last-child {
        color: black;
      }
    }
  }

  .checkbox {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .buttons {
    display: flex;
    margin-top: 20px;
    gap: 10px;

    .guardar {
      background: #ffcc00;
      color: black;
      font-size: 14px;
      font-weight: bold;
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .volver {
      background: #777;
      color: white;
      font-size: 14px;
      font-weight: bold;
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  }
`
