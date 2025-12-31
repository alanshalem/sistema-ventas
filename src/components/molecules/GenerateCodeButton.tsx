import type { MouseEvent,ReactNode } from 'react'
import styled from 'styled-components'

import { Icon } from '../atoms/Icon'

interface GenerateCodeButtonProps {
  onClick?: (event: MouseEvent<HTMLDivElement>) => void
  title?: string
  bgColor?: string
  icon?: ReactNode
  color?: string
  width?: string
}

export function GenerateCodeButton({
  onClick,
  title,
  bgColor,
  icon,
  color,
  width,
}: Readonly<GenerateCodeButtonProps>) {
  return (
    <Container $width={width} $color={color} $bgColor={bgColor} onClick={onClick}>
      <section className="content">
        <Icon $color={color}>{icon}</Icon>
        {title && (
          <span className="btn">
            <a>{title}</a>
          </span>
        )}
      </section>
    </Container>
  )
}

interface ContainerProps {
  $width?: string
  $color?: string
  $bgColor?: string
}

const Container = styled.div<ContainerProps>`
  font-weight: 700;
  display: flex;
  font-size: 15px;
  padding: 10px 25px;
  border-radius: 16px;
  background-color: ${(props) => props.$bgColor};
  border: 2px solid rgba(50, 50, 50, 0.2);
  border-bottom: 5px solid rgba(50, 50, 50, 0.2);
  transform: translate(0, -3px);
  cursor: pointer;
  transition: 0.2s;
  transition-timing-function: linear;
  color: rgb(${(props) => props.$color});
  align-items: center;
  justify-content: center;
  width: ${(props) => props.$width};

  .content {
    display: flex;
    gap: 12px;
  }

  &:active {
    transform: translate(0, 0);
    border-bottom: 2px solid rgba(50, 50, 50, 0.2);
  }

  &[disabled] {
    background-color: #646464;
    cursor: no-drop;
    box-shadow: none;
  }
`
