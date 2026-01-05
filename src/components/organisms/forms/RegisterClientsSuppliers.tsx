import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'

import {
  Button,
  ConvertirCapitalize,
  TextInput,
  useClientesProveedoresStore,
} from '../../../index'
import { useEmpresaStore } from '../../../store/EmpresaStore'
import { v } from '../../../styles/variables'

interface RegisterClientsSuppliersProps {
  readonly onClose: () => void
  readonly dataSelect: {
    id?: number | null
    nombres?: string
    direccion?: string
    telefono?: string
    email?: string
    identificador_nacional?: string
    identificador_fiscal?: string
  }
  readonly action: string
  readonly setIsExploding: (value: boolean) => void
}

interface FormData {
  nombres: string
  direccion: string
  telefono: string
  email: string
  identificador_nacional: string
  identificador_fiscal: string
}

export function RegisterClientsSuppliers({
  onClose,
  dataSelect,
  action,
  setIsExploding,
}: Readonly<RegisterClientsSuppliersProps>) {
  const { insertarCliPro, editarCliPro, tipo } = useClientesProveedoresStore()
  const { dataempresa } = useEmpresaStore()

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: {
      nombres: dataSelect?.nombres ?? '',
      direccion: dataSelect?.direccion ?? '',
      telefono: dataSelect?.telefono ?? '',
      email: dataSelect?.email ?? '',
      identificador_nacional: dataSelect?.identificador_nacional ?? '',
      identificador_fiscal: dataSelect?.identificador_fiscal ?? '',
    },
  })

  const { isPending, mutate: doInsertar } = useMutation({
    mutationFn: insertar,
    mutationKey: ['insertar clientes proveedores mutation'],
    onError: (err: Error) => console.log('El error', err.message),
    onSuccess: () => cerrarFormulario(),
  })

  const handlesub: SubmitHandler<FormData> = (data) => {
    doInsertar(data)
  }

  const cerrarFormulario = () => {
    onClose()
    setIsExploding(true)
  }

  async function insertar(data: FormData) {
    if (action === 'Editar') {
      const p = {
        _id: dataSelect.id ?? 0,
        _nombres: ConvertirCapitalize(data.nombres),
        _direccion: data.direccion,
        _telefono: data.telefono,
        _email: data.email,
        _documento: data.identificador_nacional,
        _tipo_documento: data.identificador_fiscal,
      }
      await editarCliPro(p)
    } else {
      const p = {
        nombres: ConvertirCapitalize(data.nombres),
        id_empresa: dataempresa?.id ?? 0,
        direccion: data.direccion,
        telefono: data.telefono,
        email: data.email,
        documento: data.identificador_nacional,
        tipo_documento: data.identificador_fiscal,
        tipo: tipo.toLowerCase() as 'cliente' | 'proveedor',
      }

      await insertarCliPro(p)
    }
  }

  useEffect(() => {
    if (action === 'Editar') {
      // Logic for edit mode if needed
    }
  }, [action])

  return (
    <Container>
      {isPending ? (
        <span>...</span>
      ) : (
        <div className="sub-contenedor">
          <div className="headers">
            <section>
              <h1>
                {action === 'Editar' ? 'Editar ' + tipo : 'Registrar nuevo ' + tipo}
              </h1>
            </section>

            <section>
              <span onClick={onClose}>x</span>
            </section>
          </div>

          <form className="formulario" onSubmit={handleSubmit(handlesub)}>
            <section className="form-subcontainer">
              <article>
                <TextInput icono={<v.rightArrowIcon />}>
                  <input
                    className="form__field"
                    type="text"
                    placeholder="nombres"
                    {...register('nombres', {
                      required: true,
                    })}
                  />
                  <label className="form__label">nombres</label>
                  {errors.nombres?.type === 'required' && <p>Campo requerido</p>}
                </TextInput>
              </article>
              <article>
                <TextInput icono={<v.rightArrowIcon />}>
                  <input
                    className="form__field"
                    type="text"
                    placeholder="direccion"
                    {...register('direccion', {
                      required: true,
                    })}
                  />
                  <label className="form__label">direccion</label>
                  {errors.direccion?.type === 'required' && <p>Campo requerido</p>}
                </TextInput>
              </article>
              <article>
                <TextInput icono={<v.rightArrowIcon />}>
                  <input
                    className="form__field"
                    type="text"
                    placeholder="telefono"
                    {...register('telefono', {
                      required: true,
                    })}
                  />
                  <label className="form__label">telefono</label>
                  {errors.telefono?.type === 'required' && <p>Campo requerido</p>}
                </TextInput>
              </article>
              <article>
                <TextInput icono={<v.rightArrowIcon />}>
                  <input
                    className="form__field"
                    type="text"
                    placeholder="email"
                    {...register('email', {
                      required: true,
                    })}
                  />
                  <label className="form__label">email</label>
                  {errors.email?.type === 'required' && <p>Campo requerido</p>}
                </TextInput>
              </article>
              <article>
                <TextInput icono={<v.rightArrowIcon />}>
                  <input
                    className="form__field"
                    type="text"
                    placeholder="identificador_nacional"
                    {...register('identificador_nacional', {
                      required: true,
                    })}
                  />
                  <label className="form__label">identificador nacional</label>
                  {errors.identificador_nacional?.type === 'required' && (
                    <p>Campo requerido</p>
                  )}
                </TextInput>
              </article>
              <article>
                <TextInput icono={<v.rightArrowIcon />}>
                  <input
                    className="form__field"
                    type="text"
                    placeholder="identificador_fiscal"
                    {...register('identificador_fiscal', {
                      required: true,
                    })}
                  />
                  <label className="form__label">identificador fiscal</label>
                  {errors.identificador_fiscal?.type === 'required' && (
                    <p>Campo requerido</p>
                  )}
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
  background-color: rgba(10, 9, 9, 0.5);
  display: flex;
  width: 100%;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .sub-contenedor {
    position: relative;
    width: 500px;
    max-width: 85%;
    border-radius: 20px;
    background: ${({ theme }) => theme.backgroundSecondarytotal};
    box-shadow: -10px 15px 30px rgba(10, 9, 9, 0.4);
    padding: 13px 36px 20px 36px;
    z-index: 100;

    .headers {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h1 {
        font-size: 20px;
        font-weight: 500;
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
