import { create } from 'zustand'

interface GlobalState {
  stateClose: boolean
  itemSelect: any | null
  accion: string
  isExploding: boolean
  file: File[]
  fileUrl: string
  setStateClose: (p: boolean) => void
  setAccion: (p: string) => void
  setItemSelect: (p: any | null) => void
  setIsExploding: (p: boolean) => void
  setFile: (p: File[]) => void
  setFileUrl: (p: string) => void
}

const initialState = {
  stateClose: false,
  itemSelect: null,
  accion: '',
  isExploding: false,
}

export const useGlobalStore = create<GlobalState>((set) => ({
  ...initialState,
  setStateClose: (p) => {
    set({ stateClose: p })
  },
  setAccion: (p) => set({ accion: p }),
  setItemSelect: (p) => set({ itemSelect: p }),
  setIsExploding: (p) => set({ isExploding: p }),
  file: [],
  setFile: (p) => set({ file: p }),
  fileUrl: '',
  setFileUrl: (p) => set({ fileUrl: p }),
}))
