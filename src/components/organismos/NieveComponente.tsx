import { useRef } from 'react'
import styled from 'styled-components'

import { NieveEffect } from '../../utils/Efectonieve/NieveEffect'
export function NieveComponente() {
  const canvasRef = useRef(null)
  return (
    <Container>
      <canvas ref={canvasRef}></canvas>
      <NieveEffect canvasRef={canvasRef} />
    </Container>
  )
}
const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
`
