import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ChangeEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import styled from 'styled-components'

import { Button, ConvertirCapitalize, TextInput } from '../../../index'
import { useEmpresaStore } from '../../../store/EmpresaStore'
import { useMetodosPagoStore } from '../../../store/MetodosPagoStore'
import { v } from '../../../styles/variables'
import { Icon } from '../../atoms/Icon'

interface RegisterPaymentMethodsProps {
  readonly onClose: () => void
  readonly dataSelect: {
    id: number
    nombre: string
    icono: string
  }
  readonly action: string
  readonly setIsExploding: (value: boolean) => void
}

interface FormData {
  nombre: string
}

export function RegisterPaymentMethods({
  onClose,
  dataSelect,
  action,
  setIsExploding,
}: Readonly<RegisterPaymentMethodsProps>) {
  const { insertarMetodosPago, editarMetodosPago } = useMetodosPagoStore()
  const { dataempresa } = useEmpresaStore()
  const [file, setFile] = useState<File | null>(null)
  const ref = useRef<HTMLInputElement>(null)
  const [fileurl, setFileurl] = useState<string>()
  const queryClient = useQueryClient()

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>()

  const { isPending, mutate: doInsertar } = useMutation({
    mutationFn: insertar,
    mutationKey: ['insertar metodos pago'],
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`)
    },
    onSuccess: () => {
      toast.success('Metodo de pago guardado exitosamente')
      queryClient.invalidateQueries({ queryKey: ['mostrar metodos pago'] })
      cerrarFormulario()
    },
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
        nombre: ConvertirCapitalize(data.nombre),
        id: dataSelect.id,
      }
      await editarMetodosPago(p, dataSelect.icono ?? '-', file ?? undefined)
    } else {
      const p = {
        nombre: ConvertirCapitalize(data.nombre),
        id_empresa: dataempresa?.id ?? 0,
      }

      await insertarMetodosPago(p, file ?? undefined)
    }
  }

  function abrirImagenes() {
    ref.current?.click()
  }

  function prepararImagen(e: ChangeEvent<HTMLInputElement>) {
    const filelocal = e.target.files
    const fileReaderlocal = new FileReader()
    if (filelocal && filelocal[0]) {
      fileReaderlocal.readAsDataURL(filelocal[0])
      const tipoimg = filelocal[0]
      setFile(tipoimg)
      if (fileReaderlocal && filelocal && filelocal.length) {
        fileReaderlocal.onload = function load() {
          setFileurl(fileReaderlocal.result as string)
        }
      }
    }
  }

  useEffect(() => {
    if (action === 'Editar') {
      setFileurl(dataSelect.icono)
    }
  }, [action, dataSelect])

  return (
    <Container>
      {isPending ? (
        <span>...</span>
      ) : (
        <div className="sub-contenedor">
          <div className="headers">
            <section>
              <h1>
                {action === 'Editar' ? 'Editar metodo pago' : 'Registrar metodo pago'}
              </h1>
            </section>

            <section>
              <span onClick={onClose}>x</span>
            </section>
          </div>
          <PictureContainer>
            {fileurl !== '-' ? (
              <div className="ContentImage">
                <img src={fileurl} alt="metodo pago" />
              </div>
            ) : (
              <Icon>{<v.iconoimagenvacia />}</Icon>
            )}

            <Button
              onClick={abrirImagenes}
              title="+imagen"
              color="#5f5f5f"
              bgColor="rgb(183, 183, 182)"
              icon={<v.iconosupabase />}
            />
            <input type="file" ref={ref} onChange={(e) => prepararImagen(e)} />
          </PictureContainer>
          <form className="formulario" onSubmit={handleSubmit(handlesub)}>
            <section className="form-subcontainer">
              <article>
                <TextInput icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    defaultValue={dataSelect.nombre}
                    type="text"
                    placeholder="categoria"
                    {...register('nombre', {
                      required: true,
                    })}
                  />
                  <label className="form__label">categoria</label>
                  {errors.nombre?.type === 'required' && <p>Campo requerido</p>}
                </TextInput>
              </article>

              <Button icon={<v.iconoguardar />} title="Guardar" bgColor="#F9D70B" />
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

const PictureContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  border: 2px dashed #f9d70b;
  border-radius: 5px;
  background-color: rgba(249, 215, 11, 0.1);
  padding: 8px;
  position: relative;
  gap: 3px;
  margin-bottom: 8px;

  .ContentImage {
    overflow: hidden;
    img {
      width: 100%;
      object-fit: contain;
    }
  }
  input {
    display: none;
  }
`
