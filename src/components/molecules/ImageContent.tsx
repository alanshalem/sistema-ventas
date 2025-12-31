import 'react-lazy-load-image-component/src/effects/blur.css'

import { LazyLoadImage } from 'react-lazy-load-image-component'
import styled from 'styled-components'

interface ImageContentProps {
  image: string
}

export function ImageContent({ image }: Readonly<ImageContentProps>) {
  return (
    <Container>
      <LazyLoadImage effect="blur" src={image} width={50} height={50} alt="" />
    </Container>
  )
}

const Container = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 10%;
  overflow: hidden;

  img {
    object-fit: cover;
  }
`
