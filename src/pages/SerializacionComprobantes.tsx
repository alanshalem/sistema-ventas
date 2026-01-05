import { Spinner } from '../components/molecules/Spinner'
import { RegisterSerialization } from '../components/organisms/forms/RegisterSerialization'
import { SerializationsTable } from '../components/organisms/tables/SerializationsTable'
import { CrudTemplate } from '../components/templates/CrudTemplate'
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
      FormularioRegistro={RegisterSerialization}
      title="Comprobantes"
      Tabla={<SerializationsTable data={data} />}
    />
  )
}
