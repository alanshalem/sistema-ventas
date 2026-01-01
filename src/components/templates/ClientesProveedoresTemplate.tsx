import { useState } from 'react'
import ConfettiExplosion from 'react-confetti-explosion'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

import {
  Button,
  RegisterClientsSuppliers,
  SearchBox,
  useClientesProveedoresStore,
} from '../../index'
import { v } from '../../styles/variables'
import { PageTitle } from '../atoms/PageTitle'
import { ClientsSuppliersTable } from '../organisms/tables/ClientsSuppliersTable'
export function ClientesProveedoresTemplate() {
  const [openRegistro, SetopenRegistro] = useState(false)
  const { dataclipro, setBuscador } = useClientesProveedoresStore()
  const { setTipo } = useClientesProveedoresStore()
  const [accion, setAccion] = useState('')
  const [dataSelect, setdataSelect] = useState([])
  const [isExploding, setIsExploding] = useState(false)
  const location = useLocation()
  function nuevoRegistro() {
    const tipo = location.pathname === '/configuracion/clientes' ? 'cliente' : 'proveedor'
    setTipo(tipo)
    SetopenRegistro(!openRegistro)
    setAccion('Nuevo')
    setdataSelect([])
    setIsExploding(false)
  }
  return (
    <Container>
      {openRegistro && (
        <RegisterClientsSuppliers
          setIsExploding={setIsExploding}
          onClose={() => SetopenRegistro(!openRegistro)}
          dataSelect={dataSelect}
          accion={accion}
        />
      )}
      <section className="area1">
        <PageTitle>
          {location.pathname === '/configuracion/clientes' ? 'Clientes' : 'Proveedores'}
        </PageTitle>
        <Button
          onClick={nuevoRegistro}
          bgColor={v.colorPrincipal}
          title="nuevo"
          icon={<v.iconoagregar />}
        />
      </section>
      <section className="area2">
        <SearchBox setBuscador={setBuscador} />
      </section>

      <section className="main">
        {isExploding && <ConfettiExplosion />}
        <ClientsSuppliersTable
          setdataSelect={setdataSelect}
          setAccion={setAccion}
          SetopenRegistro={SetopenRegistro}
          data={dataclipro}
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
