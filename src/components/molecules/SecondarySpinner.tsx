import styled from 'styled-components'

interface SecondarySpinnerProps {
  text: string
}

export function SecondarySpinner({ text }: Readonly<SecondarySpinnerProps>) {
  return (
    <Container>
      <span>{text}</span>
    </Container>
  )
}

const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
