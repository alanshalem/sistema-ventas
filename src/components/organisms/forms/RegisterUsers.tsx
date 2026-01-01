import { Icon } from '@iconify/react/dist/iconify.js'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { BarLoader } from 'react-spinners'
import { toast } from 'sonner'
import styled from 'styled-components'

import {
  Button,
  Device,
  TextInput,
  useEmpresaStore,
  useSucursalesStore,
  useUsuariosStore,
} from '../../../index'
import { useCajasStore } from '../../../store/CajasStore'
import { useRolesStore } from '../../../store/RolesStore'
import { BtnClose } from '../../ui/buttons/BtnClose'
import { SelectList } from '../../ui/lists/SelectList'
import { UserPermissions } from '../UsersDesign/UserPermissions'

interface RegisterUsersProps {
  readonly action: string
  readonly dataSelect: {
    id?: number
    descripcion?: string
  }
  readonly onClose: () => void
}

interface FormData {
  nombres: string
  email: string
  nro_doc: string
  telefono: string
  pass: string
}

export function RegisterUsers({
  action,
  dataSelect,
  onClose,
}: Readonly<RegisterUsersProps>) {
  const queryClient = useQueryClient()
  const { mostrarCajaXSucursal } = useCajasStore()
  const { insertarUsuario, itemSelect, editarUsuarios } = useUsuariosStore()
  const { dataempresa } = useEmpresaStore()
  const { mostrarSucursales, sucursalesItemSelect, selectSucursal } = useSucursalesStore()
  const { rolesItemSelect } = useRolesStore()

  const { data: dataSucursales, isLoading: isloadingSucursales } = useQuery({
    queryKey: ['mostrar sucursales', { id_empresa: dataempresa?.id }],
    queryFn: () => mostrarSucursales({ id_empresa: dataempresa?.id ?? 0 }),
    enabled: !!dataempresa,
  })

  const { isLoading: isloadingCajas } = useQuery({
    queryKey: ['mostrar caja por sucursal', { id_sucursal: sucursalesItemSelect?.id }],
    queryFn: () => mostrarCajaXSucursal({ id_sucursal: sucursalesItemSelect?.id ?? 0 }),
    enabled: !!sucursalesItemSelect,
  })

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: {
      nombres: itemSelect?.nombres ?? '',
      email: itemSelect?.correo ?? '',
      nro_doc: '',
      telefono: itemSelect?.telefono ?? '',
      pass: '123456',
    },
  })

  const insertar = async (data: FormData) => {
    if (action === 'Editar') {
      const p = {
        id: itemSelect?.id ?? 0,
        nombres: data.nombres,
        telefono: data.telefono,
        id_rol: rolesItemSelect?.id ?? 0,
      }
      await editarUsuarios(p)
    } else {
      const p = {
        email: data.email,
        pass: data.pass,
        nombres: data.nombres,
        nro_doc: data.nro_doc,
        telefono: data.telefono,
        id_rol: rolesItemSelect?.id ?? 0,
        id_sucursal: sucursalesItemSelect?.id ?? 0,
        id_caja: 0,
      }
      await insertarUsuario(p)
    }
  }

  const { isPending, mutate: doInsertar } = useMutation({
    mutationKey: ['insertar usuarios'],
    mutationFn: insertar,
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`)
    },
    onSuccess: () => {
      toast.success('Usuario registrado correctamente')
      queryClient.invalidateQueries({ queryKey: ['mostrar usuarios asignados'] })
      onClose()
    },
  })

  const manejadorInsertar: SubmitHandler<FormData> = (data) => {
    doInsertar(data)
  }

  const isLoading = isloadingSucursales || isloadingCajas
  if (isLoading) return <BarLoader color="#6d6d6d" />

  return (
    <Container>
      {isPending ? (
        <span>guardando...</span>
      ) : (
        <Form onSubmit={handleSubmit(manejadorInsertar)}>
          <Header>
            <Title>{action === 'Editar' ? 'Editar usuario' : 'Registrar usuario'}</Title>
            <BtnClose funcion={onClose} />
          </Header>
          <section className="main">
            <section className="area1">
              <article>
                <TextInput
                  icono={
                    <Icon
                      icon="material-symbols-light:stacked-email-outline-rounded"
                      width="24"
                      height="24"
                    />
                  }
                >
                  <input
                    disabled={action === 'Editar'}
                    className="form__field"
                    type="text"
                    {...register('email', {
                      required: true,
                    })}
                  />
                  <label className="form__label">email</label>
                  {errors.email?.type === 'required' && <p>Campo requerido</p>}
                </TextInput>
              </article>
              <article>
                <TextInput
                  icono={
                    <Icon
                      icon="material-symbols-light:stacked-email-outline-rounded"
                      width="24"
                      height="24"
                    />
                  }
                >
                  <input
                    disabled={action === 'Editar'}
                    className="form__field"
                    defaultValue={action === 'Editar' ? dataSelect?.descripcion : ''}
                    type="password"
                    {...register('pass', {
                      required: true,
                    })}
                  />
                  <label className="form__label">contraseña</label>
                  {errors.pass?.type === 'required' && <p>Campo requerido</p>}
                </TextInput>
              </article>
              <article>
                <TextInput
                  icono={<Icon icon="icon-park-solid:edit-name" width="24" height="24" />}
                >
                  <input
                    className="form__field"
                    type="text"
                    {...register('nombres', { required: true })}
                  />
                  <label className="form__label">Nombres</label>
                  {errors.nombres?.type === 'required' && <p>Campo requerido</p>}
                </TextInput>
              </article>
              <article>
                <TextInput
                  icono={<Icon icon="solar:document-outline" width="24" height="24" />}
                >
                  <input
                    className="form__field"
                    type="number"
                    {...register('nro_doc', { required: true })}
                  />
                  <label className="form__label">Nro. doc</label>
                  {errors.nro_doc?.type === 'required' && <p>Campo requerido</p>}
                </TextInput>
              </article>
              <article>
                <TextInput
                  icono={<Icon icon="solar:document-outline" width="24" height="24" />}
                >
                  <input
                    className="form__field"
                    type="text"
                    {...register('telefono', { required: true })}
                  />
                  <label className="form__label">Teléfono</label>
                  {errors.telefono?.type === 'required' && <p>Campo requerido</p>}
                </TextInput>
              </article>
              <span>Asignación de sucursal</span>
              <article className="contentasignacion">
                <span>Sucursal:</span>
                <SelectList
                  onSelect={selectSucursal}
                  itemSelect={sucursalesItemSelect}
                  displayField="nombre"
                  data={dataSucursales}
                />
              </article>

              <Button title={'Guardar'} bgColor={'#2c2ca8'} color={'#fff'} />
            </section>
            <section className="area2">
              <UserPermissions />
            </section>
          </section>
        </Form>
      )}
    </Container>
  )
}

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow-y: auto;
  backdrop-filter: blur(5px);
  padding: 1rem;
`

const Form = styled.form`
  width: 100%;
  max-width: 900px;
  background-color: ${({ theme }) => theme.background};
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 15px;

  .main {
    display: flex;
    flex-direction: column;
    gap: 15px;
    overflow-y: auto;
    justify-content: center;

    @media ${Device.laptop} {
      flex-direction: row;
    }
    .area1 {
      display: flex;
      flex-direction: column;
      height: 100%;
      align-items: center;
    }
    .area2 {
      display: flex;
      flex-direction: column;
      height: 100%;
      align-items: center;
    }
  }
`

const Header = styled.div`
  width: 100%;

  display: flex;
  text-align: center;
  justify-content: center;
`

const Title = styled.span`
  font-size: 30px;
  font-weight: bold;
`
