import { Icon } from '@iconify/react/dist/iconify.js'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllInfoByISO } from 'iso-country-currency'
import type { ChangeEvent } from 'react'
import { FlagIcon } from 'react-flag-kit'
import { toast } from 'sonner'
import styled from 'styled-components'

import { useEmpresaStore } from '../../../store/EmpresaStore'
import { useMonedasStore } from '../../../store/MonedasStore'
import { Divider } from '../../atoms/Divider'
import { TextInput2 } from '../forms/TextInput2'

interface CountryData {
  iso: string
  countryName: string
  symbol: string
  currency?: string
}

interface EditarEmpresaParams {
  id: number
  simbolo_moneda: string
  iso: string
  pais: string
  currency?: string
}

export function CurrencyConfig() {
  const { dataempresa, editarMonedaEmpresa } = useEmpresaStore()
  const { search, setSearch, selectedCountry, setSelectedCountry } = useMonedasStore()
  const queryClient = useQueryClient()

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.toLowerCase())
  }

  const handleSelectCountry = (country: CountryData) => {
    const countryInfo = getAllInfoByISO(country.iso as any)
    setSelectedCountry({
      id: 0,
      nombre: countryInfo?.currency || country.currency || '',
      codigo: country.iso,
      simbolo: country.symbol,
      iso: country.iso,
      countryName: country.countryName,
      currency: country.currency,
    })
    setSearch(country.countryName)

    mutate.mutateAsync()
  }

  const allCountries = getAllInfoByISO('US') as any
  const allCountriesList = Object.values(allCountries)
  const filteredCountries = allCountriesList.filter((country: any) =>
    country?.countryName?.toLowerCase().includes(search)
  )

  const editar = async () => {
    const p: EditarEmpresaParams = {
      id: dataempresa?.id ?? 0,
      simbolo_moneda: selectedCountry?.symbol ?? '',
      iso: selectedCountry?.iso ?? '',
      pais: selectedCountry?.countryName ?? '',
      currency: selectedCountry?.currency ?? '',
    }
    await editarMonedaEmpresa(p)
  }

  const mutate = useMutation({
    mutationKey: ['editar empresa moneda'],
    mutationFn: editar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mostrar empresa'] })
      toast.success('datos guardados')
    },
  })

  return (
    <Container>
      <TextInput2>
        <input
          className="form__field"
          type="search"
          placeholder="buscar país..."
          value={search}
          onChange={handleSearchChange}
          onFocus={() => setSearch(search)}
        />
      </TextInput2>
      <Divider />

      {search && filteredCountries.length > 0 && (
        <Dropdown>
          <DropdownList>
            {filteredCountries.map((country: any, index: number) => (
              <DropdownItem
                key={index}
                onClick={() => handleSelectCountry(country as CountryData)}
              >
                {country.countryName}
              </DropdownItem>
            ))}
          </DropdownList>
        </Dropdown>
      )}

      <Cardselect
        $flag={
          selectedCountry
            ? `https://flagcdn.com/${selectedCountry.iso?.toLowerCase() ?? ''}.svg`
            : ''
        }
      >
        <article className="area1">
          <span className="titulo">Moneda actual</span>
        </article>
        <article className="area2">
          <article className="area2_1">
            <FlagIcon
              code={
                (selectedCountry == null ? dataempresa?.iso : selectedCountry?.iso) as any
              }
              size={60}
            />
          </article>

          <article className="area2_2">
            <span>
              {selectedCountry == null
                ? dataempresa?.pais
                : (selectedCountry?.countryName ?? '')}
            </span>
            <span className="simbolo">
              <Icon className="icono" icon="fluent-emoji:money-with-wings" />
              {selectedCountry == null
                ? dataempresa?.simbolo_moneda
                : selectedCountry?.symbol}
            </span>
          </article>
        </article>
      </Cardselect>
      {mutate.isSuccess && <span>cambios guardados</span>}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const Dropdown = styled.div`
  top: -20px;
  position: relative;
`

const DropdownList = styled.ul`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  position: absolute;
  margin-bottom: 15px;
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  gap: 10px;
  z-index: 3;
  height: 230px;
  width: 95%;
  overflow: hidden;
  &:focus {
    outline: none;
  }
`

const DropdownItem = styled.li`
  gap: 10px;
  display: flex;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundSecondarytotal};
  }
`

const Cardselect = styled.section<{ $flag: string }>`
  border: 2px solid ${({ theme }) => theme.neutral};
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  overflow: hidden;
  width: 320px;

  .area2 {
    display: flex;
    align-items: center;
    gap: 20px;
    .area2_2 {
      display: flex;
      flex-direction: column;
      gap: 10px;
      .simbolo {
        align-items: center;
        display: flex;
        gap: 5px;
        font-weight: 700;
        font-size: 20px;
        .icono {
          font-size: 30px;
        }
      }
    }
  }
`
