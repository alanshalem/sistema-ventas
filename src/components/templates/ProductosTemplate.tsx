import { useState } from 'react'
import ConfettiExplosion from 'react-confetti-explosion'
import { Toaster } from 'sonner'
import styled from 'styled-components'

import {
  Button,
  ProductsTable,
  RegisterProducts,
  SearchBox,
  useProductosStore,
} from '../../index'
import { v } from '../../styles/variables'
import { PageTitle } from '../atoms/PageTitle'
export function ProductosTemplate() {
  const [openRegistro, SetopenRegistro] = useState(false)
  const { dataProductos, setBuscador, generarCodigo } = useProductosStore()
  const [accion, setAccion] = useState('')
  const [dataSelect, setdataSelect] = useState([])
  const [isExploding, setIsExploding] = useState(false)
  function nuevoRegistro() {
    SetopenRegistro(!openRegistro)
    setAccion('Nuevo')
    setdataSelect([])
    setIsExploding(false)
    generarCodigo()
  }

  return (
    <Container>
      <Toaster />
      {openRegistro && (
        <RegisterProducts
          setIsExploding={setIsExploding}
          onClose={() => SetopenRegistro(!openRegistro)}
          dataSelect={dataSelect}
          accion={accion}
          state={openRegistro}
        />
      )}

      <section className="area1">
        <PageTitle>Productos</PageTitle>
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
        <ProductsTable
          setdataSelect={setdataSelect}
          setAccion={setAccion}
          SetopenRegistro={SetopenRegistro}
          data={dataProductos}
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
