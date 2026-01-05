import ConfettiExplosion from 'react-confetti-explosion'
import { Toaster } from 'sonner'
import styled from 'styled-components'

import { Button, SearchBox } from '../../index'
import { useGlobalStore } from '../../store/GlobalStore'
import { v } from '../../styles/variables'
import { PageTitle } from '../atoms/PageTitle'
import { BuscadorList } from '../ui/lists/BuscadorList'
interface CrudTemplateProps {
  FormularioRegistro?: React.ComponentType<unknown>
  title: string
  Tabla?: React.ComponentType<unknown>
  data?: unknown[]
  setBuscador?: (value: string) => void
  tipoBuscador?: 'list' | 'simple'
  dataBuscadorList?: unknown[]
  selectBuscadorList?: (item: unknown) => void
  setBuscadorList?: (value: string) => void
  stateBtnAdd?: boolean
  stateBuscador?: boolean
}

export function CrudTemplate({
  FormularioRegistro,
  title,
  Tabla,
  data,
  setBuscador,
  tipoBuscador,
  dataBuscadorList,
  selectBuscadorList,
  setBuscadorList,
  stateBtnAdd,
  stateBuscador,
}: CrudTemplateProps) {
  const {
    stateClose,
    isExploding,
    setItemSelect,
    setAccion,
    setIsExploding,
    setStateClose,
  } = useGlobalStore()

  function nuevoRegistro() {
    setStateClose(true)
    setAccion('Nuevo')
    setItemSelect([])
    setIsExploding(false)
  }
  return (
    <Container>
      <Toaster position="top-right" />
      {stateClose && FormularioRegistro && <FormularioRegistro />}
      <section className="area1">
        <PageTitle>{title} </PageTitle>
        {stateBtnAdd && (
          <Button
            onClick={nuevoRegistro}
            bgColor={v.primaryColor}
            title="nuevo"
            icon={<v.addIcon />}
          />
        )}
      </section>
      {stateBuscador && (
        <section className="area2">
          {tipoBuscador === 'list' ? (
            <BuscadorList
              data={(dataBuscadorList as Record<string, unknown>[]) ?? []}
              onSelect={selectBuscadorList ?? (() => {})}
              setBuscador={setBuscadorList ?? (() => {})}
            />
          ) : (
            <SearchBox setSearchTerm={setBuscador ?? (() => {})} />
          )}
        </section>
      )}

      <section className="main">
        {isExploding && <ConfettiExplosion />}
        {data && data.length > 0 && Tabla && <Tabla />}
      </section>
    </Container>
  )
}
const Container = styled.div`
  height: calc(100vh - 80px);

  margin-top: 50px;
  padding: 15px;
  display: grid;
  grid-template:
    'area1' 60px
    'area2' 60px
    'main' auto;
  .area1 {
    grid-area: area1;
    /* background-color: rgba(103, 93, 241, 0.14); */
    display: flex;
    justify-content: end;
    align-items: center;
    gap: 15px;
  }
  .area2 {
    grid-area: area2;
    /* background-color: rgba(7, 237, 45, 0.14); */
    display: flex;
    justify-content: end;
    align-items: center;
  }
  .main {
    grid-area: main;
    /* background-color: rgba(237, 7, 221, 0.14); */
  }
`
