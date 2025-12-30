/* Zustand Store Types */

import { StoreApi } from 'zustand'

export type StateCreator<T> = (
  set: StoreApi<T>['setState'],
  get: StoreApi<T>['getState']
) => T
