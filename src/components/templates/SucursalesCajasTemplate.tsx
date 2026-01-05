import { Toaster } from 'sonner'
import styled from 'styled-components'

import { useCajasStore } from '../../store/CajasStore'
import { useSucursalesStore } from '../../store/SucursalesStore'
import { BranchesList } from '../organisms/BranchesDesign/BranchesList'
import { RegisterBranch } from '../organisms/forms/RegisterBranch'
import { RegisterCashRegister } from '../organisms/forms/RegisterCashRegister'
import { ButtonDashed } from '../ui/buttons/ButtonDashed'
export const SucursalesCajasTemplate = () => {
  const { stateSucursal, setStateSucursal } = useSucursalesStore()
  const { stateCaja } = useCajasStore()

  return (
    <Container>
      <Toaster position="top-right" />
      {stateSucursal && <RegisterBranch />}
      {stateCaja && <RegisterCashRegister />}

      <section className="area1">
        <Header>
          <Title>Cajas por sucursal</Title>
          <Subtitle>gestiona tus sucursales y cajas</Subtitle>
          <ButtonDashed title="add sucursal" funcion={() => setStateSucursal(true)} />
        </Header>
      </section>
      <section className="area2">
        <BranchesList />
      </section>
      {/* <AnimatedGrid/> */}
    </Container>
  )
}
const Container = styled.div`
  height: 100vh;
  display: grid;
  position: relative;
  grid-template:
    'area1' 300px
    'area2' auto;
  .area1 {
    grid-area: area1;
    /* background-color: rgba(7, 237, 45, 0.14); */
    display: flex;
    flex-direction: column;
  }
  .area2 {
    grid-area: area2;
    /* background-color: rgba(237, 7, 221, 0.14); */
    padding-bottom: 20px;
  }
`
const Header = styled.div`
  margin-bottom: 20px;
  text-align: center;
  justify-content: center;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`
const Title = styled.h3`
  font-size: 25px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  margin: 0;
`
const Subtitle = styled.p`
  font-size: 18px;
  color: #6b7280;
  margin: 5px 0 0;
`
