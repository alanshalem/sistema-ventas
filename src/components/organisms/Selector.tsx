import type { MouseEvent } from "react"
import { IoIosArrowDown } from "react-icons/io"
import styled from "styled-components"

interface SelectorProps {
  color: string
  isOpen: boolean
  onClick: (event: MouseEvent<HTMLDivElement>) => void
  primaryText: string
  secondaryText: string
}

export function Selector({
  color,
  isOpen,
  onClick,
  primaryText,
  secondaryText,
}: Readonly<SelectorProps>) {
  return (
    <Container $color={color} onClick={onClick}>
      <div>
        <span>{primaryText}</span>
        <span>{secondaryText}</span>
      </div>
      <span className={isOpen ? "open" : "close"}>
        <IoIosArrowDown />
      </span>
    </Container>
  )
}

const Container = styled.div<{ $color: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  cursor: pointer;
  border: 2px solid ${(props) => props.$color};
  border-radius: 10px;
  padding: 10px;
  gap: 10px;
  transition: 0.3s;
  font-weight: 600;
  box-shadow: 4px 9px 20px -12px ${(props) => props.$color};
  .open {
    transition: 0.3s;
    transform: rotate(0deg);
  }
  .close {
    transition: 0.3s;
    transform: rotate(180deg);
  }
  &:hover {
    background-color: ${(props) => props.$color};
    color: #fff;
  }
`
