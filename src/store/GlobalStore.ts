import { create } from 'zustand'

interface GlobalState {
  stateClose: boolean
  itemSelect: unknown
  accion: string
  isExploding: boolean
  file: File[]
  fileUrl: string
}

interface GlobalActions {
  setStateClose: (state: boolean) => void
  setAccion: (action: string) => void
  setItemSelect: (item: unknown) => void
  setIsExploding: (exploding: boolean) => void
  setFile: (files: File[]) => void
  setFileUrl: (url: string) => void
}

type GlobalStore = GlobalState & GlobalActions

const initialState = {
  stateClose: false,
  itemSelect: null,
  accion: '',
  isExploding: false,
  file: [],
  fileUrl: '',
}

export const useGlobalStore = create<GlobalStore>((set) => ({
  ...initialState,
  setStateClose: (p) => {
    set({ stateClose: p })
  },
  setAccion: (p) => set({ accion: p }),
  setItemSelect: (p) => set({ itemSelect: p }),
  setIsExploding: (p) => set({ isExploding: p }),
  setFile: (p) => set({ file: p }),
  setFileUrl: (p) => set({ fileUrl: p }),
}))
