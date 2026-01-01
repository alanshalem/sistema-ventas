import { useQuery } from '@tanstack/react-query'
import type { ReactElement } from 'react'
import { useEffect } from 'react'
import { BarLoader } from 'react-spinners'
import styled from 'styled-components'

import { useAsignacionCajaSucursalStore } from '../../../store/AsignacionCajaSucursalStore'
import { useModulosStore } from '../../../store/ModulosStore'
import { usePermisosStore } from '../../../store/PermisosStore'
import { useRolesStore } from '../../../store/RolesStore'
import { useUsuariosStore } from '../../../store/UsuariosStore'
import { SelectList } from '../../ui/lists/SelectList'
import { Check } from '../../ui/toggles/Check'

export function UserPermissions(): ReactElement {
  const {
    mostrarPermisos,
    toggleModule,
    selectedModules,
    setSelectedModules,
    mostrarPermisosDefault,
    datapermisos,
  } = usePermisosStore()
  const { accion } = useAsignacionCajaSucursalStore()
  const { mostrarModulos } = useModulosStore()
  const { rolesItemSelect, setRolesItemSelect, dataroles } = useRolesStore()
  const { itemSelect } = useUsuariosStore()

  const { data: datamodulos, isLoading: isLoadingModulos } = useQuery({
    queryKey: ['mostrar modulos'],
    queryFn: mostrarModulos,
  })

  const { data: dataPermisosDefault, isLoading: isLoadingPermisosDefault } = useQuery({
    queryKey: ['mostrar permisos default'],
    queryFn: mostrarPermisosDefault,
  })

  const { isLoading: isLoadingPermisosUser } = useQuery({
    queryKey: ['mostrar permisos por usuario', { id_usuario: itemSelect?.id }],
    queryFn: () => mostrarPermisos({ id_usuario: itemSelect?.id ?? 0 }),
    enabled: !!itemSelect,
  })

  useEffect(() => {
    if (accion === 'Nuevo') {
      const permisosPorRol =
        (dataPermisosDefault as any[])
          ?.filter((permiso) => permiso.id_rol === rolesItemSelect?.id)
          .map((permiso) => permiso.id_modulo as number) || []
      setSelectedModules(permisosPorRol)
    } else if (itemSelect?.id_rol) {
      const foundRol = dataroles?.find((r) => r.id === itemSelect.id_rol)
      if (foundRol) {
        setRolesItemSelect(foundRol)
      }
    }
  }, [])

  useEffect(() => {
    if (accion !== 'Nuevo' && datapermisos) {
      const permisosUsuario = datapermisos
        .map((p) => p.idmodulo)
        .filter((id): id is number => id !== undefined)
      setSelectedModules(permisosUsuario)
    }
  }, [accion, datapermisos])

  const isLoading = isLoadingModulos || isLoadingPermisosDefault || isLoadingPermisosUser
  if (isLoading) return <BarLoader />

  return (
    <Container>
      <Title>permisos</Title>
      <label>Tipo: </label>
      <SelectList
        data={dataroles ?? []}
        displayField="nombre"
        onSelect={setRolesItemSelect}
        itemSelect={rolesItemSelect}
      />
      <List>
        {datamodulos?.map((module) => {
          const isChecked = itemSelect
            ? datapermisos?.some((p) => String(p.idmodulo) === String(module.id))
            : selectedModules.includes(module.id)
          return (
            <ListItem key={module.id}>
              <Check checked={isChecked} onChange={() => toggleModule(module.id)} />
              <Label>{module.nombre} </Label>
            </ListItem>
          )
        })}
      </List>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1.5rem;
`

const Title = styled.span`
  font-size: 1.5rem;
  text-align: center;
`

const List = styled.ul`
  list-style: none;
  padding: 0;
`

const ListItem = styled.li`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
`

const Label = styled.span`
  font-size: 1rem;
  color: #555;
  margin-left: 15px;
`
