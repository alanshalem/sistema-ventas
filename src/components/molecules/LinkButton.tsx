import type { ReactNode } from 'react'
import styled from 'styled-components'

import { Icon } from '../atoms/Icon'

interface LinkButtonProps {
  title?: string
  bgColor?: string
  icon?: ReactNode
  url?: string
  color?: string
  disabled?: boolean
  width?: string
  border?: string
  height?: string
  decorator?: string
  image?: string
}

export function LinkButton({
  title,
  bgColor,
  icon,
  url,
  color,
  disabled,
  width,
  border,
  height,
  decorator,
  image,
}: Readonly<LinkButtonProps>) {
  return (
    <Container
      $width={width}
      disabled={disabled}
      $color={color}
      $bgColor={bgColor}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      $border={border}
      $decorator={decorator}
      $height={height}
    >
      <section className="content">
        <Icon $color={color}>{icon}</Icon>
        {image && (
          <ImageContent>
            <img src={image} alt="" />
          </ImageContent>
        )}
        {title && <span className="btn">{title}</span>}
      </section>
    </Container>
  )
}

interface ContainerProps {
  $width?: string
  $color?: string
  $bgColor?: string
  $border?: string
  $height?: string
  $decorator?: string
  disabled?: boolean
}

const Container = styled.a<ContainerProps>`
  font-weight: 700;
  display: flex;
  font-size: 15px;
  padding: 10px 25px;
  border-radius: 16px;
  background-color: ${(props) => props.$bgColor};
  border: ${(props) => props.$border} solid rgba(50, 50, 50, 0.2);
  border-bottom: 5px solid rgba(50, 50, 50, 0.2);
  transform: translate(0, -3px);
  cursor: pointer;
  transition: 0.2s;
  transition-timing-function: linear;
  color: ${(props) => props.$color};
  align-items: center;
  justify-content: center;
  width: ${(props) => props.$width};
  height: ${(props) => props.$height};
  overflow: hidden;
  text-decoration: none;
  color: ${(props) => props.$color} !important;

  &::before {
    content: '';
    display: ${(props) => props.$decorator};
    width: 40px;
    height: 40px;
    background-color: rgba(251, 251, 251, 0.25);
    position: absolute;
    border-radius: 50%;
    bottom: -15px;
    right: -15px;
  }

  .content {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  &:active {
    transform: translate(0, 0);
    border-bottom: ${(props) => props.$border} solid rgba(50, 50, 50, 0.2);
  }

  &[disabled] {
    background-color: #646464;
    cursor: no-drop;
    box-shadow: none;
  }
`

const ImageContent = styled.section`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  overflow: hidden;

  img {
    width: 100%;
    object-fit: contain;
  }
`
