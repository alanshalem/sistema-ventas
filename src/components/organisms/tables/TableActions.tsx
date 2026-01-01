import type { ReactNode } from "react"
import styled from "styled-components"

interface TableActionsProps {
  readonly onClick: () => void
  readonly icon: ReactNode
  readonly color: string
  readonly fontSize: string
}

export function TableActions({ onClick, icon, color, fontSize }: Readonly<TableActionsProps>) {
  return (
    <Container onClick={onClick} $color={color} $fontSize={fontSize}>
      {icon}
    </Container>
  )
}

const Container = styled.span<{ $color: string; $fontSize: string }>`
  color: ${(props) => props.$color};
  font-size: ${(props) => props.$fontSize};
  cursor: pointer;
`
