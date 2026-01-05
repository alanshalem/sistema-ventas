import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import styled from 'styled-components'

import { Button, ConvertirCapitalize, TextInput, useUsuariosStore } from '../../../index'
import { useAsignacionCajaSucursalStore } from '../../../store/AsignacionCajaSucursalStore'
import { useCajasStore } from '../../../store/CajasStore'
import { v } from '../../../styles/variables'
import { BtnClose } from '../../ui/buttons/BtnClose'

interface FormData {
  descripcion: string
}

export function RegisterCashRegister() {
  const queryClient = useQueryClient()
  const { insertarAsignacionSucursal } = useAsignacionCajaSucursalStore()
  const { accion, cajaSelectItem, setStateCaja, insertarCaja, editarCaja } =
    useCajasStore()
  const { datausuarios } = useUsuariosStore()
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>()

  const insertar = async (data: FormData) => {
    if (accion === 'Editar') {
      const p = {
        id: cajaSelectItem?.id ?? 0,
        nombre: ConvertirCapitalize(data.descripcion),
      }
      await editarCaja(p)
    } else {
      const p = {
        nombre: ConvertirCapitalize(data.descripcion),
        id_empresa: cajaSelectItem?.id_empresa ?? 0,
      }
      const response = await insertarCaja(p)
      const pAsignaciones = {
        id_sucursal: cajaSelectItem?.id,
        id_usuario: datausuarios?.id,
        id_caja: response?.id,
      }
      await insertarAsignacionSucursal(pAsignaciones)
    }
  }

  const { isPending, mutate: doInsertar } = useMutation({
    mutationKey: ['insertar caja'],
    mutationFn: insertar,
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`)
    },
    onSuccess: () => {
      toast.success('Caja registrada correctamente')
      queryClient.invalidateQueries({ queryKey: ['mostrar Cajas XSucursal'] })
      setStateCaja(false)
    },
  })

  const handlesub: SubmitHandler<FormData> = (data) => {
    doInsertar(data)
  }

  return (
    <Container>
      {isPending ? (
        <span>guardando...</span>
      ) : (
        <div className="sub-contenedor">
          <div className="headers">
            <section>
              <h1>{accion === 'Editar' ? 'Editar caja' : 'Registrar nueva caja'}</h1>
            </section>

            <section>
              <BtnClose funcion={() => setStateCaja(false)} />
            </section>
          </div>

          <form className="formulario" onSubmit={handleSubmit(handlesub)}>
            <section className="form-subcontainer">
              <article>
                <TextInput icono={<v.rightArrowIcon />}>
                  <input
                    className="form__field"
                    defaultValue={accion === 'Editar' ? cajaSelectItem?.descripcion : ''}
                    type="text"
                    placeholder="sucursal"
                    {...register('descripcion', {
                      required: true,
                    })}
                  />
                  <label className="form__label">caja</label>
                  {errors.descripcion?.type === 'required' && <p>Campo requerido</p>}
                </TextInput>
              </article>

              <Button icon={<v.saveIcon />} title="Guardar" bgColor="#F9D70B" />
            </section>
          </form>
        </div>
      )}
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
  .sub-contenedor {
    position: relative;
    width: 500px;
    max-width: 85%;
    border-radius: 20px;
    background: ${({ theme }) => theme.background};
    box-shadow: -10px 15px 30px rgba(10, 9, 9, 0.4);
    padding: 13px 36px 20px 36px;
    z-index: 100;
    max-height: 80vh;
    overflow-y: auto;

    .headers {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h1 {
        font-size: 30px;
        font-weight: 700;
        text-transform: uppercase;
      }
      span {
        font-size: 20px;
        cursor: pointer;
      }
    }
    .formulario {
      .form-subcontainer {
        gap: 20px;
        display: flex;
        flex-direction: column;
        .colorContainer {
          .colorPickerContent {
            padding-top: 15px;
            min-height: 50px;
          }
        }
      }
    }
  }
`
