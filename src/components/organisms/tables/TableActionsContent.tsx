import { Icon } from '@iconify/react'
import styled from 'styled-components'

import { v } from '../../../styles/variables'
import { TableActions } from './TableActions'

interface TableActionsContentProps {
  readonly onEdit?: () => void
  readonly onDelete?: () => void
}

export function TableActionsContent({
  onEdit,
  onDelete,
}: Readonly<TableActionsContentProps>) {
  return (
    <Container>
      {onEdit && (
        <TableActions
          onClick={onEdit}
          fontSize="18px"
          color="#7d7d7d"
          icon={<v.nameIcon />}
        />
      )}
      {onDelete && (
        <TableActions
          onClick={onDelete}
          fontSize="20px"
          color="#f76e8e"
          icon={<Icon icon="fluent-emoji-high-contrast:skull" />}
        />
      )}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  @media (max-width: 48em) {
    justify-content: end;
  }
`
