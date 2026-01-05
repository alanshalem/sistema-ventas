import { Toaster } from 'sonner'
import styled from 'styled-components'

import { useVentasStore } from '../../index'
import { useCierreCajaStore } from '../../store/CierreCajaStore'
import { useStockStore } from '../../store/StockStore'
import { Device } from '../../styles/breakpoints'
import { blur_in } from '../../styles/keyframes'
import { useMostrarAlmacenesXSucursalQuery } from '../../tanstack/AlmacenesStack'
import { useMostrasrImpresorasPorCajaQuery } from '../../tanstack/ImpresorasStack'
import { useBuscarProductosQuery } from '../../tanstack/ProductosStack'
import { useMostrarSerializacionesVentasQuery } from '../../tanstack/SerializacionStack'
import { useMostrarStockXAlmacenesYProductoQuery } from '../../tanstack/StockStack'
import { CashRegisterClosingScreen } from '../organisms/POSDesign/CashRegisterDesign/CashRegisterClosingScreen'
import { MoneyInOutScreen } from '../organisms/POSDesign/CashRegisterDesign/MoneyInOutScreen'
import { FloatingMenu } from '../organisms/POSDesign/FloatingMenu'
import { PaymentScreen } from '../organisms/POSDesign/PaymentScreen'
import { POSFooter } from '../organisms/POSDesign/POSFooter'
import { POSHeader } from '../organisms/POSDesign/POSHeader'
import { POSKeyboardArea } from '../organisms/POSDesign/POSKeyboardArea'
import { POSSaleDetailArea } from '../organisms/POSDesign/POSSaleDetailArea'
import { SelectWarehouseModal } from '../organisms/POSDesign/SelectWarehouseModal'
export function POSTemplate() {
  const { statePantallaCobro } = useVentasStore()
  const { stateIngresoSalida, stateCierreCaja } = useCierreCajaStore()
  const { stateModal } = useStockStore()
  useBuscarProductosQuery()
  useMostrarAlmacenesXSucursalQuery()
  useMostrarStockXAlmacenesYProductoQuery()
  useMostrarSerializacionesVentasQuery()
  useMostrasrImpresorasPorCajaQuery()
  return (
    <Container>
      {stateModal && <SelectWarehouseModal />}

      {statePantallaCobro && <PaymentScreen />}

      <POSHeader />
      <Main>
        <Toaster position="top-center" />
        <POSSaleDetailArea />
        <POSKeyboardArea />
      </Main>
      <POSFooter />
      <FloatingMenu />
      {stateIngresoSalida && <MoneyInOutScreen />}
      {stateCierreCaja && <CashRegisterClosingScreen />}
    </Container>
  )
}
const Container = styled.div`
  height: calc(100vh - 60px);
  padding: 10px;
  padding-top: 50px;
  display: grid;
  gap: 10px;
  grid-template:
    'header' 220px
    'main' auto;

  animation: ${blur_in} 0.5s linear both;
  @media ${Device.desktop} {
    grid-template:
      'header header' 140px
      'main main'
      'footer footer' 60px;
  }
`

const Main = styled.div`
  grid-area: main;
  /* background-color: rgba(228, 20, 20, 0.5); */
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  overflow: hidden;
  gap: 10px;

  @media ${Device.desktop} {
    flex-direction: row;
  }
`
