import type { ChangeEvent } from 'react'
import styled from 'styled-components'

import { v } from '../../styles/variables'

interface SearchBoxProps {
  setSearchTerm: (value: string) => void
}

export function SearchBox({ setSearchTerm }: Readonly<SearchBoxProps>) {
  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value)
  }

  return (
    <Container>
      <section className="content">
        <v.searchIcon className="icono" />
        <input placeholder="...buscar" onChange={handleSearch} />
      </section>
    </Container>
  )
}

const Container = styled.div`
  border-radius: 10px;
  height: 60px;
  align-items: center;
  display: flex;
  color: ${(props) => props.theme.text};
  border: 2px solid ${({ theme }) => theme.neutral};
  .content {
    padding: 15px;
    gap: 10px;
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
    .icono {
      font-size: 18px;
    }
    input {
      font-size: 18px;
      width: 100%;
      outline: none;
      background: none;
      border: 0;
      color: ${(props) => props.theme.text};
    }
  }
`
