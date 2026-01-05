import { Icon } from '@iconify/react/dist/iconify.js'
import styled from 'styled-components'

import { Button } from '@/components/molecules/Button'

import { SearchBox } from '../SearchBox'

interface SearchPanelProps {
  readonly setStateBuscador: () => void
  readonly setBuscador: (value: string) => void
  readonly displayField: string
  readonly data: unknown[]
  readonly selector: (item: unknown) => void
  readonly funcion: () => void
}

export function SearchPanel({
  setStateBuscador,
  setBuscador,
  displayField,
  data,
  selector,
  funcion,
}: Readonly<SearchPanelProps>) {
  return (
    <Container>
      <div className="subcontent">
        <Icon className="icono" icon="ep:arrow-left-bold" onClick={setStateBuscador} />
        <div>
          <Button title="add" onClick={funcion} />
        </div>

        <SearchBox setSearchTerm={setBuscador} />
        {data?.map((item, index: number) => {
          const displayValue = (item as Record<string, string>)[displayField]
          return (
            <Item
              onClick={() => {
                selector(item)
                setStateBuscador()
              }}
              key={index}
            >
              {displayValue}
            </Item>
          )
        })}
      </div>
    </Container>
  )
}

const Container = styled.div`
  background-color: #fff;
  height: 100%;
  position: absolute;
  width: 100%;
  .subcontent {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    .icono {
      cursor: pointer;
    }
  }
`

const Item = styled.div`
  border-radius: 5px;
  font-size: 18px;
  padding: 5px;
  display: flex;
  gap: 8px;
  &:hover {
    background-color: #e0e0e0;
    cursor: pointer;
  }
`
