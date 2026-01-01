import { Icon } from '@iconify/react/dist/iconify.js'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'

import { ImageSelector } from '../../../hooks/useImageSelector'
import { useEmpresaStore } from '../../../store/EmpresaStore'
import { useGlobalStore } from '../../../store/GlobalStore'
import { slideBackground } from '../../../styles/keyframes'
import { useUpdateEmpresaMutation } from '../../../tanstack/EmpresaStack'
import { TextInput2 } from '../forms/TextInput2'

interface BasicConfigFormData {
  nombre: string
  direccion: string
  impuesto: string
  valor_impuesto: number
}

interface ButtonProps {
  readonly bgColor: string
  readonly color: string
  readonly title: string
}

function Button({ bgColor, color, title }: Readonly<ButtonProps>) {
  return (
    <StyledButton type="submit" $bgColor={bgColor} $color={color}>
      {title}
    </StyledButton>
  )
}

export function BasicConfig() {
  const { fileUrl } = useGlobalStore()
  const { dataempresa } = useEmpresaStore()

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<BasicConfigFormData>({
    defaultValues: {
      nombre: dataempresa?.nombre ?? '',
      direccion: dataempresa?.direccion_fiscal ?? '',
      impuesto: dataempresa?.impuesto ?? '',
      valor_impuesto: dataempresa?.valor_impuesto ?? 0,
    },
  })

  const { mutate, isPending } = useUpdateEmpresaMutation()

  const onSubmit = (data: BasicConfigFormData) => {
    mutate(data as any)
  }

  return (
    <Container>
      {isPending ? (
        <span>guardando...</span>
      ) : (
        <>
          <Title>Básico</Title>

          <Avatar>
            <span className="nombre">{dataempresa?.nombre}</span>
            <ImageSelector fileUrl={fileUrl ?? dataempresa?.logo ?? ''} />
          </Avatar>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Label>Nombre</Label>
            <TextInput2>
              <input
                className="form__field"
                placeholder="nombre"
                type="text"
                {...register('nombre', {
                  required: true,
                })}
              />
              {errors.nombre?.type === 'required' && <p>Campo requerido</p>}
            </TextInput2>
            <Label>Dirección</Label>
            <TextInput2>
              <input
                className="form__field"
                placeholder="direccion"
                type="text"
                {...register('direccion', {
                  required: true,
                })}
              />
              {errors.direccion?.type === 'required' && <p>Campo requerido</p>}
            </TextInput2>
            <Label>Impuesto</Label>
            <TextInput2>
              <input
                className="form__field"
                placeholder="impuesto"
                type="text"
                {...register('impuesto', {
                  required: true,
                })}
              />
              {errors.impuesto?.type === 'required' && <p>Campo requerido</p>}
            </TextInput2>
            <Label>Valor impuesto</Label>
            <TextInput2>
              <input
                step="0.01"
                className="form__field"
                placeholder="valor impuesto"
                type="number"
                {...register('valor_impuesto', {
                  required: true,
                })}
              />
              {errors.valor_impuesto?.type === 'required' && <p>Campo requerido</p>}
            </TextInput2>
            <br></br>
            <Button bgColor="#0930bb" color="#fff" title="GUARDAR CAMBIOS" />
          </form>
          <br></br>
          <section className="advertencia">
            <Icon className="icono" icon="meteocons:barometer" />
            <span>los cambios de logo se ven reflejados en el lapso de 10 segundos.</span>
          </section>
        </>
      )}
    </Container>
  )
}

const Container = styled.div`
  padding: 20px;
  border-radius: 10px;
  max-width: 400px;
  margin: 0 auto;
  p {
    color: #f75510;
    font-weight: 700;
  }
  .advertencia {
    background-color: rgba(237, 95, 6, 0.2);
    border-radius: 10px;
    padding: 10px;
    margin-top: 10px;
    margin: auto;
    height: 70px;
    display: flex;
    color: #f75510;
    width: 100%;
    align-items: center;
    .icono {
      font-size: 100px;
    }
  }
`

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`

const Avatar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
  width: 100%;
  border-radius: 10px;
  padding: 10px;
  .nombre {
    font-weight: 700;
    position: absolute;
    text-align: center;
    align-self: center;
    margin: auto;
    top: 0;
    left: 100px;
    bottom: 0;
    right: 10px;
    font-size: 25px;
    overflow: hidden;
    white-space: normal;
    word-wrap: break-word;
    color: #fff !important;
  }
  background-color: #391ebb;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 120 120'%3E%3Cpolygon fill='%23000' fill-opacity='0.19' points='120 0 120 60 90 30 60 0 0 0 0 0 60 60 0 120 60 120 90 90 120 60 120 0'/%3E%3C/svg%3E");
  background-size: 60px 60px;
  animation: ${slideBackground} 10s linear infinite;
  img {
    object-fit: cover;
  }
  input {
    display: none;
  }
`

const Label = styled.label`
  display: block;
  margin: 10px 0 5px;
`

const StyledButton = styled.button<{ $bgColor: string; $color: string }>`
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  border: none;
  border-radius: 5px;
  background-color: ${(props) => props.$bgColor};
  color: ${(props) => props.$color};
  cursor: pointer;
`
