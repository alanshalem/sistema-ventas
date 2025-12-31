import { create } from 'zustand'

import type { Moneda } from '../types'

interface MonedasState {
  search: string
  selectedCountry: Moneda | null
  setSearch: (search: string) => void
  setSelectedCountry: (p: Moneda | null) => void
}

export const useMonedasStore = create<MonedasState>((set) => ({
  search: '',
  setSearch: (search) => set({ search }),
  selectedCountry: null,
  setSelectedCountry: (p) => set({ selectedCountry: p }),
}))
