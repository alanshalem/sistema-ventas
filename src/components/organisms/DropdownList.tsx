import type { KeyboardEvent, MouseEvent } from 'react'
import { useRef, useState } from 'react'
import styled from 'styled-components'

import { Device } from '../../index'

interface DropdownItem {
  nombre: string
  [key: string]: unknown
}

interface DropdownListProps {
  data: DropdownItem[]
  isOpen: boolean
  onClose: () => void
  onSelect: (item: DropdownItem) => void
  scroll?: string
  top?: string
  refetch?: () => void
  funcioncrud?: () => void
}

export function DropdownList({
  data,
  isOpen,
  onClose,
  onSelect,
  scroll,
  top,
  refetch,
  funcioncrud,
}: Readonly<DropdownListProps>) {
  if (!isOpen) return null

  const [selectedIndex, setSelectedIndex] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)

  function handleSelect(item: DropdownItem) {
    if (refetch) {
      refetch()
    }

    onSelect(item)
    onClose()
    if (funcioncrud) {
      funcioncrud()
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      const selectedItem = data[selectedIndex]
      if (selectedItem) {
        handleSelect(selectedItem)
      }
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex((prevIndex) => (prevIndex === 0 ? data.length - 1 : prevIndex - 1))
    } else if (e.key === 'ArrowDown') {
      setSelectedIndex((prevIndex) => (prevIndex === 0 ? data.length - 1 : prevIndex + 1))
    }
  }

  const handleCloseClick = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    onClose()
  }

  return (
    <Container
      $scroll={scroll}
      $top={top}
      ref={dropdownRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <section className="contentClose" onClick={handleCloseClick}>
        x
      </section>
      <section className="contentItems">
        {data?.map((item, index) => {
          return (
            <ItemContainer
              style={{
                background: index === selectedIndex ? 'rgba(47,48,52,0.3)' : '',
              }}
              key={index}
              onClick={() => handleSelect(item)}
            >
              <span>🌫️</span>
              <span>{item?.nombre}</span>
            </ItemContainer>
          )
        })}
      </section>
    </Container>
  )
}

const Container = styled.div<{ $scroll?: string; $top?: string }>`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  position: absolute;
  margin-bottom: 15px;
  top: ${(props) => props.$top};
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  gap: 10px;
  z-index: 3;

  width: 95%;
  &:focus {
    outline: none;
  }
  @media ${() => Device.tablet} {
  }
  .contentClose {
    font-weight: 700;
    cursor: pointer;
    font-size: 20px;
  }
  .contentItems {
    overflow-y: ${(props) => props.$scroll};
  }
`
const ItemContainer = styled.div`
  gap: 10px;
  display: flex;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundSecondarytotal};
  }
`
