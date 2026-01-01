import { Icon } from '@iconify/react/dist/iconify.js'
import styled from 'styled-components'

interface ButtonDashedProps {
  title: string
  funcion: () => void
}

export const ButtonDashed = ({ title, funcion }: ButtonDashedProps) => {
  return (
    <Container onClick={funcion}>
      <Icon className="icon" icon="ic:baseline-add-circle-outline" />
      <span>{title} </span>
    </Container>
  )
}
const Container = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px 20px;
  width: 100%;
  background-color: ${(props) => props.theme.background};
  border: 2px dashed ${(props) => props.theme.text};
  border-radius: 10px;
  color: ${(props) => props.theme.text};
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  .icon {
    margin-right: 8px;
    font-size: 20px;
  }
  &:hover {
    background-color: ${(props) => props.theme.text};
    color: ${(props) => props.theme.background};
  }
`
