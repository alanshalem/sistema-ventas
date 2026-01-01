import { create } from 'zustand'

import { EditarImpresoras, MostrarImpresoraXCaja } from '../supabase/crudImpresoras'
import type { EditarImpresoraParams, IdCajaParam, Impresora } from '../types'

const fetchWithTimeout = (url: string, timeout = 5000): Promise<Response> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Timeout')), timeout)
    fetch(url)
      .then((response) => {
        clearTimeout(timer)
        resolve(response)
      })
      .catch((error) => {
        clearTimeout(timer)
        reject(error)
      })
  })
}

interface ImpresorasState {
  dataImpresorasPorCaja: Impresora | null
  selectImpresora: { name: string } | Impresora
  statePrintDirecto: boolean
}

interface ImpresorasActions {
  setSelectImpresora: (printer: { name: string } | Impresora) => void
  setStatePrintDirecto: () => void
  mostrarDatosPc: () => Promise<unknown | null>
  mostrarListaImpresoraLocales: () => Promise<unknown | undefined>
  editarImpresoras: (params: EditarImpresoraParams) => Promise<void>
  mostrarImpresoraXCaja: (params: IdCajaParam) => Promise<Impresora | null>
}

type ImpresorasStore = ImpresorasState & ImpresorasActions

export const useImpresorasStore = create<ImpresorasStore>((set) => ({
  // State
  dataImpresorasPorCaja: null,
  selectImpresora: {
    name: 'seleccione una impresora',
  },
  statePrintDirecto: false,

  // Actions
  setSelectImpresora: (p) => {
    set({ selectImpresora: p })
  },

  setStatePrintDirecto: () => {
    set((state) => ({ statePrintDirecto: !state.statePrintDirecto }))
  },

  mostrarDatosPc: async () => {
    try {
      const response = await fetchWithTimeout(
        'http://localhost:5075/api/get-local-ip',
        5000
      )
      if (!response.ok) {
        throw new Error(`Error de red: ${response.statusText}`)
      }
      const data = await response.json()
      return data
    } catch (error) {
      return null
    }
  },

  mostrarListaImpresoraLocales: async () => {
    try {
      const response = await fetch('http://localhost:5075/api/list')
      if (!response.ok) {
        return undefined
      }
      const data = await response.json()
      return data
    } catch {
      return undefined
    }
  },

  editarImpresoras: async (p) => {
    await EditarImpresoras(p)
  },

  mostrarImpresoraXCaja: async (p) => {
    const response = await MostrarImpresoraXCaja(p)
    set(() => ({
      dataImpresorasPorCaja: response,
      statePrintDirecto: (response as any)?.state ?? false,
      selectImpresora:
        (response as any)?.name === '-'
          ? {
            name: 'seleccione una impresora',
          }
          : (response ?? {
            name: 'seleccione una impresora',
          }),
    }))
    return response
  },
}))
