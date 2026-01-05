import { Icon } from '@iconify/react/dist/iconify.js'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ReactElement } from 'react'
import { BarLoader } from 'react-spinners'
import { toast } from 'sonner'
import styled from 'styled-components'
import Swal from 'sweetalert2'

import { useAlmacenesStore } from '../../../store/AlmacenesStore'
import { useEmpresaStore } from '../../../store/EmpresaStore'
import { useSucursalesStore } from '../../../store/SucursalesStore'
import { Device } from '../../../styles/breakpoints'
import type { Almacen as AlmacenBase, Sucursal as SucursalBase } from '../../../types'
import { ButtonDashed } from '../../ui/buttons/ButtonDashed'

interface AlmacenExtended extends AlmacenBase {
  fecha_creacion?: string
  delete?: boolean
}

interface SucursalExtended extends SucursalBase {
  almacen?: AlmacenExtended[]
  delete?: boolean
}

export function WarehousesList(): ReactElement {
  const queryClient = useQueryClient()
  const { setStateSucursal, setAccion, selectSucursal, eliminarSucursal } =
    useSucursalesStore()
  const { dataempresa } = useEmpresaStore()
  const {
    setStateAlmacen,
    setAlmacenSelectItem,
    setAccion: setAccionAlmacen,
    eliminarAlmacen,
    mostrarAlmacenesXEmpresa,
  } = useAlmacenesStore()

  const { data, isLoading, error } = useQuery({
    queryKey: ['mostrar almacenes X empresa'],
    queryFn: async () => {
      const result = await mostrarAlmacenesXEmpresa({ id_empresa: dataempresa?.id ?? 0 })
      return result as unknown as SucursalExtended[]
    },
    enabled: !!dataempresa,
  })

  const editarSucursal = (p: SucursalExtended | SucursalBase) => {
    selectSucursal(p as SucursalBase)
    setStateSucursal(true)
    setAccion('Editar')
  }

  const addAlmacen = (p: SucursalExtended | SucursalBase) => {
    setAccionAlmacen('Nuevo')
    setStateAlmacen(true)
    console.log(p)
    setAlmacenSelectItem(p as AlmacenBase)
  }

  const editarAlmacen = (p: AlmacenExtended | AlmacenBase) => {
    setStateAlmacen(true)
    setAccionAlmacen('Editar')
    setAlmacenSelectItem(p as AlmacenBase)
  }

  const controladorEliminarAlmacen = (id: number) => {
    return new Promise<void>((resolve, reject) => {
      Swal.fire({
        title: '¿Estás seguro(a)(e)?',
        text: 'Una vez eliminado, se eliminaran todas las ventas relacionadas',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await eliminarAlmacen({ id: id })
            resolve()
          } catch (error) {
            reject(error)
          }
        } else {
          reject(new Error('Eliminación cancelada'))
        }
      })
    })
  }

  const controladorEliminarSucursal = (id: number) => {
    return new Promise<void>((resolve, reject) => {
      Swal.fire({
        title: '¿Estás seguro(a)(e)?',
        text: 'Una vez eliminado, se eliminaran todas las ventas relacionadas',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await eliminarSucursal({ id: id })
            resolve()
          } catch (error) {
            reject(error)
          }
        } else {
          reject(new Error('Eliminación cancelada'))
        }
      })
    })
  }

  const { mutate: doDeleteSucursal } = useMutation({
    mutationKey: ['eliminar Sucursal'],
    mutationFn: controladorEliminarSucursal,
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`)
    },
    onSuccess: () => {
      toast.success('Sucursal eliminada')
      queryClient.invalidateQueries({ queryKey: ['mostrar Cajas XSucursal'] })
    },
  })

  const { mutate: doDeleteAlmacen } = useMutation({
    mutationKey: ['eliminar almacen'],
    mutationFn: controladorEliminarAlmacen,
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`)
    },
    onSuccess: () => {
      toast.success('Almacen eliminado')
      queryClient.invalidateQueries({ queryKey: ['mostrar almacenes X empresa'] })
    },
  })

  if (isLoading) return <BarLoader color="#6d6d6d" />
  if (error) return <span>error...{error.message}</span>

  return (
    <Container>
      {data?.map((sucursal: SucursalExtended, index: number) => {
        return (
          <Sucursal key={index}>
            <SucursalHeader>
              <Acciones $right="0px" $top="0px">
                {sucursal?.delete && (
                  <Icon
                    icon="wpf:delete"
                    width="15"
                    height="15"
                    className="deleteicon"
                    onClick={() => doDeleteSucursal(sucursal?.id)}
                  />
                )}

                <Icon
                  icon="mdi:edit"
                  width="20"
                  height="20"
                  onClick={() => editarSucursal(sucursal)}
                />
              </Acciones>
              <SucursalTitle>SUCURSAL: {sucursal.nombre}</SucursalTitle>
            </SucursalHeader>
            <AlmacenList>
              {sucursal.almacen?.map((almacen: AlmacenExtended, index: number) => {
                return (
                  <AlmacenItem key={index}>
                    <AlmacenInfo>
                      <FechaCreacion>{almacen.fecha_creacion} </FechaCreacion>
                    </AlmacenInfo>
                    <AlmacenDescripcion>{almacen.nombre} </AlmacenDescripcion>
                    <Acciones $right="10px" $bottom="10px">
                      {almacen?.delete && (
                        <Icon
                          icon="wpf:delete"
                          width="15"
                          height="15"
                          className="deleteicon"
                          onClick={() => doDeleteAlmacen(almacen?.id)}
                        />
                      )}
                      <Icon
                        icon="mdi:edit"
                        width="20"
                        height="20"
                        onClick={() => editarAlmacen(almacen)}
                      />
                    </Acciones>
                  </AlmacenItem>
                )
              })}
            </AlmacenList>
            <ButtonDashed title={'add almacen'} funcion={() => addAlmacen(sucursal)} />
          </Sucursal>
        )
      })}
    </Container>
  )
}

const Container = styled.div`
  column-count: 1;
  column-gap: 20px;
  width: 90%;
  max-width: 1200px;
  margin: auto;
  @media ${Device.tablet} {
    column-count: 2;
  }
  @media ${Device.desktop} {
    column-count: 3;
  }
`

const Acciones = styled.section<{ $right?: string; $top?: string; $bottom?: string }>`
  position: absolute;
  right: ${(props) => props.$right};
  top: ${(props) => props.$top};
  bottom: ${(props) => props.$bottom};
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  .deleteicon {
    &:hover {
      color: #c22929 !important;
    }
  }
`

const Sucursal = styled.div`
  background-color: ${({ theme }) => theme.background};
  border: 2px solid ${({ theme }) => theme.bordercolorDash};
  border-radius: 20px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1);
  break-inside: avoid;
  margin-bottom: 20px;
  position: relative;
`

const SucursalHeader = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`

const SucursalTitle = styled.h3`
  font-size: 18px;
  color: ${({ theme }) => theme.text};
  font-weight: bold;
  text-transform: uppercase;
  position: relative;
  top: 10px;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: normal;
`

const AlmacenList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const AlmacenItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 5px;
  border: 2px solid ${({ theme }) => theme.backgroundSecondary};
  padding: 10px;
  border-radius: 8px;
  justify-content: space-between;
  position: relative;
`

const AlmacenInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const FechaCreacion = styled.span`
  font-size: 14px;
  color: #9ca3af;
  text-align: start;
`

const AlmacenDescripcion = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.text};
  font-weight: bold;
  text-align: center;
`
