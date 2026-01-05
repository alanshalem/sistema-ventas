import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useState } from 'react'
import styled from 'styled-components'

import {
  HamburgerSwitch,
  MobileMenu,
  Sidebar,
  Spinner,
  UserAuth,
  useUsuariosStore,
} from '../index'
import { Device } from '../styles/breakpoints'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: Readonly<LayoutProps>) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { mostrarusuarios } = useUsuariosStore()
  const authContext = UserAuth() // Access the context
  const userId = authContext?.user?.id // Get authenticated user ID

  // #region User Data Query
  const {
    isLoading: isLoadingUsers,
    error: userError,
  } = useQuery({
    queryKey: ['show users'],
    queryFn: () => mostrarusuarios({ id_auth: userId ?? '' }),
    refetchOnWindowFocus: false,
    enabled: !!userId,
  })

  // Consolidation of loading and error states
  const isLoading = isLoadingUsers
  const error = userError

  // Loading state
  if (isLoading) {
    return <Spinner />
  }

  // Error state
  if (error) {
    return <span>Error loading layout: {error.message}</span>
  }

  return (
    <Container className={sidebarOpen ? 'active' : ''}>
      {/* #region Sidebar */}
      <section className="contentSidebar">
        <Sidebar state={sidebarOpen} setState={(state) => setSidebarOpen(state)} />
      </section>

      {/* #region Header with Mobile Menu */}
      <section className="contentMenuHamburger">
        <HamburgerSwitch
          isActive={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
        {mobileMenuOpen && <MobileMenu setState={() => setMobileMenuOpen(false)} />}
      </section>

      {/* #region Main Content */}
      <Containerbody>{children}</Containerbody>
    </Container>
  )
}
const Container = styled.main`
  display: grid;
  grid-template-columns: 1fr;
  transition: 0.1s ease-in-out;
  color: ${({ theme }) => theme.text};
  .contentSidebar {
    display: none;
    /* background-color: rgba(78, 45, 78, 0.5); */
  }
  .contentMenuhambur {
    position: absolute;
    /* background-color: rgba(53, 219, 11, 0.5); */
  }
  @media ${Device.tablet} {
    grid-template-columns: 88px 1fr;
    &.active {
      grid-template-columns: 260px 1fr;
    }
    .contentSidebar {
      display: initial;
    }
    .contentMenuhambur {
      display: none;
    }
  }
`
const Containerbody = styled.section`
  /* background-color: rgba(231, 13, 136, 0.5); */
  grid-column: 1;
  width: 100%;

  @media ${Device.tablet} {
    margin-top: 0;
    grid-column: 2;
  }
`
