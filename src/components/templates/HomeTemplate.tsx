import styled from 'styled-components'

import { Welcome } from '../../index'
import { WelcomeLandingPage } from '../organisms/LandingPages/WelcomeLandingPage'

export function HomeTemplate() {
  return <WelcomeLandingPage />
}
const Container = styled.div`
  height: 100vh;
`
