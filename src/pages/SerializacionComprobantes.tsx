import { Spinner } from '../components/molecules/Spinner'
import { RegistrarSerializacion } from '../components/organismos/formularios/RegistrarSerializacion'
import { TablaSerializaciones } from '../components/organismos/tablas/TablaSerializaciones'
import { CrudTemplate } from '../components/templates/CrudTemplate'
import { useGlobalStore } from '../store/GlobalStore'
import {
  useEditarSerializacionDefaultMutation,
  useMostrarSerializacionesQuery,
} from '../tanstack/SerializacionStack'
export const SerializacionComprobantes = () => {
  const { data, isLoading, error } = useMostrarSerializacionesQuery()
  const { mutate, isPending } = useEditarSerializacionDefaultMutation()

  if (isLoading) {
    return <Spinner />
  }
  if (error) {
    return <span>error...{error.message} </span>
  }
  return (
    <CrudTemplate
      data={data}
      FormularioRegistro={RegistrarSerializacion}
      title="Comprobantes"
      Tabla={<TablaSerializaciones data={data} />}
    />
  )
}
