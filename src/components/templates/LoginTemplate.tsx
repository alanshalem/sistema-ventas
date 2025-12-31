import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast, Toaster } from 'sonner'
import styled from 'styled-components'

import animacionlottie from '../../assets/navidad.json'
import { Button, Footer, GenerateCodeButton, InputText2, useAuthStore } from '../../index'
import { Device } from '../../styles/breakpoints'
import { v } from '../../styles/variables'
import { Divider } from '../atoms/Divider'
import { LottieAnimation } from '../atoms/LottieAnimation'
import { PageTitle } from '../atoms/PageTitle'
import { BackButton } from '../molecules/BackButton'
import { CardModos } from '../organismos/LoginDesign/CardModos'
import { NieveComponente } from '../organismos/NieveComponente'
export function LoginTemplate() {
  const [stateModos, setStateModos] = useState(true)
  const [stateModo, setStateModo] = useState('empleado')
  const { loginGoogle, loginEmail, crearUserYLogin } = useAuthStore()

  const { register, handleSubmit } = useForm()
  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationKey: ['iniciar con email'],
    mutationFn: loginEmail,
    onError: (error) => {
      toast.error(`Error: ${error.message}`)
    },
  })
  const { mutate: mutateTester, isPending } = useMutation({
    mutationKey: ['iniciar con email tester'],
    mutationFn: crearUserYLogin,
    onError: (error) => {
      toast.error(`Error: ${error.message}`)
    },
    onSuccess: () => {
      //queryClient.invalidateQueries();
      // window.location.reload();
    },
  })
  const manejadorEmailSesionTester = () => {
    mutateTester({ email: 'tester1@gmail.com', password: '123456' })
  }
  const manejadorEmailSesion = (data) => {
    mutate({ email: data.email, password: data.password })
  }
  const manejarCrearUSerTester = () => {
    const response = GenerateCodeButton({ id: 2 })
    const gmail = '@gmail.com'
    const correoCompleto = response.toLowerCase() + gmail
    mutateTester({ email: correoCompleto, password: '123456' })
  }
  return (
    <Container>
      <Toaster />
      <div className="card">
        <ContentLogo>
          <img src={v.logo} />
          <span>Sistema de Ventas</span>
        </ContentLogo>
        <PageTitle $paddingbottom="40px">Ingresar Modo</PageTitle>
        {stateModos && (
          <ContentModos>
            <CardModos
              title={'Super admin'}
              subtitle={'crea y gestiona tu empresa'}
              bgColor={'#ed7323'}
              img={'https://i.ibb.co/TDXYj7r9/rey.png'}
              onClick={() => {
                setStateModo('superadmin')
                setStateModos(!stateModos)
              }}
            />
            <CardModos
              title={'Empleado'}
              subtitle={'vende y crece'}
              bgColor={'#542a1b'}
              img={'https://i.ibb.co/ksfCmJyy/casco.png'}
              onClick={() => {
                setStateModo('empleado')
                setStateModos(!stateModos)
              }}
            />
          </ContentModos>
        )}
        {stateModo === 'empleado'
          ? stateModos === false && (
              <PanelModo>
                <BackButton onClick={() => setStateModos(!stateModos)} />
                <span>Modo empleado</span>
                <form onSubmit={handleSubmit(manejadorEmailSesion)}>
                  <InputText2>
                    <input
                      className="form__field"
                      placeholder="email"
                      type="text"
                      {...register('email', { required: true })}
                    />
                  </InputText2>
                  <InputText2>
                    <input
                      className="form__field"
                      placeholder="contraseña"
                      type="password"
                      {...register('password', { required: true })}
                    />
                  </InputText2>
                  <Button
                    border="2px"
                    title="INGRESAR"
                    bgColor="#1CB0F6"
                    color="255,255,255"
                    width="100%"
                  />
                </form>
              </PanelModo>
            )
          : stateModos === false && (
              <PanelModo>
                <BackButton onClick={() => setStateModos(!stateModos)} />
                <span>Modo super admin</span>
                <Button
                  disabled={isPending}
                  onClick={manejarCrearUSerTester}
                  border="2px"
                  title="MODO INVITADO"
                  bgColor="#f6ce1c"
                  color="255,255,255"
                  width="100%"
                />
                <Divider>
                  <span>0</span>
                </Divider>
                <Button
                  border="2px"
                  onClick={loginGoogle}
                  title="Google"
                  bgColor="#fff"
                  icon={<v.iconogoogle />}
                />
              </PanelModo>
            )}
      </div>
      <Footer />
    </Container>
  )
}
const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
  padding: 0 10px;
  color: ${({ theme }) => theme.text};
  .card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    width: 100%;
    margin: 20px;
    @media ${Device.tablet} {
      width: 400px;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  }
`
const ContentLogo = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px;
  span {
    font-weight: 700;
  }
  img {
    width: 10%;
  }
`
const ContentModos = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`
const PanelModo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`
