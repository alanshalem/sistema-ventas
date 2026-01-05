import { useState } from 'react'
import ConfettiExplosion from 'react-confetti-explosion'
import { Toaster } from 'sonner'
import styled from 'styled-components'

import { Button, SearchBox, useUsuariosStore } from '../../index'
import { useAsignacionCajaSucursalStore } from '../../store/AsignacionCajaSucursalStore'
import { v } from '../../styles/variables'
import { PageTitle } from '../atoms/PageTitle'
import { RegisterUsers } from '../organisms/forms/RegisterUsers'
import { UsersTable } from '../organisms/tables/UsersTable'

export function UsuariosTemplate() {
  const [openRegistro, SetopenRegistro] = useState(false)
  const [dataSelect, setdataSelect] = useState<unknown>(null)
  const { setItemSelect } = useUsuariosStore()
  const [isExploding, setIsExploding] = useState(false)
  const { accion, setAccion, datausuariosAsignados, setBuscador } =
    useAsignacionCajaSucursalStore()

  function nuevoRegistro() {
    SetopenRegistro(!openRegistro)
    setAccion('Nuevo')
    setdataSelect(null)
    setIsExploding(false)
    setItemSelect(null)
  }

  return (
    <Container>
      <Toaster />
      {openRegistro && (
        <RegisterUsers
          setIsExploding={setIsExploding}
          onClose={() => SetopenRegistro(!openRegistro)}
          dataSelect={dataSelect}
          accion={accion}
        />
      )}

      <section className="area1">
        <PageTitle>Usuarios</PageTitle>
        <Button
          onClick={nuevoRegistro}
          bgColor={v.primaryColor}
          title="nuevo"
          icon={<v.addIcon />}
        />
      </section>
      <section className="area2">
        <SearchBox setSearchTerm={setBuscador} />
      </section>

      <section className="main">
        {isExploding && <ConfettiExplosion />}
        <UsersTable
          setdataSelect={setItemSelect}
          setAccion={setAccion}
          SetopenRegistro={SetopenRegistro}
          data={datausuariosAsignados}
        />
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
