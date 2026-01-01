import type { ReactElement } from 'react'
import styled from 'styled-components'

import { useStockStore } from '../../../store/StockStore'
import { Button } from '../../molecules/Button'

export function SelectWarehouseModal(): ReactElement {
  const { setStateModal, dataStockXAlmacenesYProducto: data } = useStockStore()

  return (
    <Container>
      <SubContainer>
        <Avatar>
          <span>Seleccionar almacén</span>
        </Avatar>
        <ContainerTable>
          <table className="responsive-table">
            <thead>
              <tr>
                <th>Almacen</th>
                <th>Stock</th>
                <th>Stock Mínimo</th>
              </tr>
            </thead>
            <tbody>
              {(data as any[])?.map((item: any, index: number) => {
                return (
                  <tr
                    key={index}
                    className={`${
                      item.stock_minimo > item.stock ? 'bajo-stock' : 'alto-stock'
                    }`}
                  >
                    <td>{item.almacen_nombre}</td>
                    <td>{item.stock}</td>
                    <td>{item.stock_minimo}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </ContainerTable>
        <div className="buttons-container">
          <Button
            bgColor="#d7360e"
            color="#fff"
            title="Volver"
            onClick={() => setStateModal(false)}
          />
        </div>
      </SubContainer>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 1000;
`

const SubContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 500px;
  height: 100%;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.background};
  border: 2px solid ${({ theme }) => theme.bordercolorDash};
`

const Avatar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1em;

  span {
    color: ${({ theme }) => theme.text};
    font-size: 20px;
    font-weight: bold;
  }
`

const ContainerTable = styled.div`
  width: 100%;
  overflow: hidden;
  border-radius: 20px;
  border: 2px solid ${({ theme }) => theme.bordercolorDash};
  background-color: ${({ theme }) => theme.background};

  .responsive-table {
    width: 100%;
    margin-bottom: 1.5em;
    border-spacing: 0;
    font-size: 0.9em;

    thead {
      position: relative;
      display: block;

      th {
        border-bottom: 1px solid ${({ theme }) => theme.neutral};
        font-weight: 700;
        text-align: center;
        color: ${({ theme }) => theme.text};
        &:first-of-type {
          border-top-left-radius: 10px;
        }
        &:last-of-type {
          border-top-right-radius: 10px;
        }
      }
    }

    tbody {
      display: block;
      overflow-x: auto;

      tr {
        display: table-row;
        border: none;

        td {
          display: table-cell;
          border: none;
          text-align: center;
          color: ${({ theme }) => theme.text};

          &:first-of-type {
            border-top-left-radius: 10px;
          }

          &:last-of-type {
            border-top-right-radius: 10px;
          }
        }
      }

      .bajo-stock {
        background-color: #ffcccc;
        color: #d9534f;
      }

      .alto-stock {
        background-color: #d4edda;
        color: #155724;
        cursor: pointer;
      }
    }
  }

  .buttons-container {
    display: flex;
    gap: 10px;
    justify-content: center;
  }
`
