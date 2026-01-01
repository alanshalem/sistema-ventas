import { Icon } from '@iconify/react/dist/iconify.js'
import { useState } from 'react'
import styled from 'styled-components'

interface BuscadorListProps<T> {
  setBuscador: (value: string) => void
  data: T[] | undefined
  onSelect: (item: T) => void
  displayField?: keyof T
  itemSelect?: T | null
}

export function BuscadorList<T extends Record<string, any>>({
  setBuscador,
  data,
  onSelect,
  displayField = 'nombre',
  itemSelect,
}: BuscadorListProps<T>) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>('')
  const [selected, setSelected] = useState<T | undefined>(itemSelect ?? undefined)

  function buscar(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setInputValue(value)
    setBuscador(value)
    setIsOpen(!!value)
  }
  const handleSelect = (item: T) => {
    setSelected(item)
    setIsOpen(false)
    onSelect(item)
  }

  return (
    <Container>
      <section className="content">
        <Icon icon="ic:outline-search" width="25" height="25" />
        <input
          placeholder="...buscar"
          value={inputValue}
          onChange={buscar}
          onFocus={() => setIsOpen(!!inputValue && (data?.length ?? 0) > 0)}
        />
        {isOpen && (
          <DropdownList>
            {data?.map((item: T, index: number) => {
              const isSelected = item?.[displayField] === selected?.[displayField]
              return (
                <DropdownItem
                  key={index}
                  onClick={() => handleSelect(item)}
                  $isSelected={isSelected}
                >
                  {isSelected && <CheckMark>✔</CheckMark>}
                  {item?.[displayField] as string}
                </DropdownItem>
              )
            })}
          </DropdownList>
        )}
      </section>
    </Container>
  )
}
const Container = styled.div`
  border-radius: 10px;
  height: 60px;
  align-items: center;
  display: flex;
  color: ${(props) => props.theme.text};
  border: 2px solid ${({ theme }) => theme.neutral};
  .content {
    padding: 15px;
    gap: 10px;
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
    .icono {
      font-size: 18px;
    }
    input {
      font-size: 18px;
      width: 100%;
      outline: none;
      background: none;
      border: 0;
      color: ${(props) => props.theme.text};
    }
  }
`
const DropdownList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: ${({ theme }) => theme.background};
  border: 1px solid #333;
  border-radius: 5px;
  margin-top: 10px;
  max-height: 150px;
  overflow-y: auto;
  z-index: 1000;

  // Evita que se adapte al tamaño del header
  min-width: 200px; /* Ancho mínimo */
  width: max-content; /* Ancho según el contenido */
  max-width: 300px; /* Ancho máximo */
`

const DropdownItem = styled.div<{ $isSelected: boolean }>`
  padding: 10px 15px;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  background-color: ${({ $isSelected }) =>
    $isSelected ? (props) => props.theme.backgroundSecondary : 'transparent'};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundSecondary};
  }
`

const CheckMark = styled.span`
  color: ${({ theme }) => theme.text};
  font-size: 14px;
`
