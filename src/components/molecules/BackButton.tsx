import { Icon } from '@iconify/react/dist/iconify.js'
import styled from 'styled-components'

interface BackButtonProps {
  onClick: () => void
}

export function BackButton({ onClick }: Readonly<BackButtonProps>) {
  return (
    <Container onClick={onClick}>
      <Icon icon="mingcute:arrow-left-fill" className="icon" />
      <span className="text">Volver</span>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  gap: 8px;
  margin-bottom: 30px;

  .icon {
    font-size: 25px;
  }

  .text {
    font-size: 18px;
  }
`
