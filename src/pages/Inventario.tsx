import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import styled from 'styled-components'

import { PageTitle } from '../components/atoms/PageTitle'
import { Button } from '../components/molecules/Button'
import { RegisterInventory } from '../components/organisms/forms/RegisterInventory'
import { InventoriesTable } from '../components/organisms/tables/InventoriesTable'
import { BuscadorList } from '../components/ui/lists/BuscadorList'
import { useEmpresaStore } from '../store/EmpresaStore'
import { useGlobalStore } from '../store/GlobalStore'
import { useMovStockStore } from '../store/MovStockStore'
import { useProductosStore } from '../store/ProductosStore'

export const Inventario = () => {
  const { mostrarMovStock } = useMovStockStore()
  const { dataempresa } = useEmpresaStore()
  const { buscarProductos, buscador } = useProductosStore()
  const { productosItemSelect, setBuscador, selectProductos } = useProductosStore()
  const [openRegistro] = useState(false)
  const { setStateClose, setAccion, stateClose } = useGlobalStore()

  useQuery({
    queryKey: ['buscar productos', buscador],
    queryFn: () =>
      buscarProductos({
        id_empresa: dataempresa?.id ?? 0,
      }),
    enabled: !!dataempresa,
  })

  const { data, isLoading } = useQuery({
    queryKey: [
      'mostrar movimientos de stock',
      {
        id_empresa: dataempresa?.id,
        id_producto: productosItemSelect?.id,
      },
    ],
    queryFn: () =>
      mostrarMovStock({
        id_empresa: dataempresa?.id ?? 0,
        id_producto: productosItemSelect?.id ?? 0,
      }),
    enabled: !!dataempresa,
  })

  function nuevoRegistro() {
    setStateClose(true)
    setAccion('Nuevo')
  }
  return (
    <Container>
      {stateClose && <RegisterInventory />}

      <section className="area1">
        {productosItemSelect?.nombre && (
          <span>
            {' '}
            Producto: <strong>{productosItemSelect?.nombre}</strong>{' '}
          </span>
        )}
        |<PageTitle>Inventario</PageTitle>
        <Button onClick={nuevoRegistro} title="Registrar" />
      </section>
      <section className="area2">
        <BuscadorList setBuscador={setBuscador} data={[]} onSelect={selectProductos} />
      </section>

      <section className="main">
        <InventoriesTable
          setAction={setAccion}
          setOpenRegister={openRegistro}
          data={(data as any) ?? []}
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
