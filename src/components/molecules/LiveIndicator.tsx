import { Icon } from '@iconify/react'
import styled, { keyframes } from 'styled-components'

export function LiveIndicator() {
  return (
    <Container>
      <PulseIconWrapper>
        <Icon icon="mdi:record-circle" />
      </PulseIconWrapper>
      <Text>realtime</Text>
    </Container>
  )
}

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 currentColor;
  }
  70% {
    transform: scale(1.5);
    box-shadow: 0 0 0 20px rgba(255, 0, 0, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
  }
`

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 5px;
  font-family: 'Work Sans', sans-serif;
`

const PulseIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: ${({ theme }) => theme.text};
  animation: ${pulse} 1.5s infinite;
  border-radius: 50px;
`

const Text = styled.span`
  color: ${({ theme }) => theme.text};
  font-weight: bold;
  font-size: 12px;
`
