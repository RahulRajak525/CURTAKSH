import { useCallback } from 'react'
import type { LookScene, Store, AsyncState } from '@/types'
import { getLooks, getStores } from '@/services'
import { useAsync } from './useAsync'

export function useLooks(params?: {
  room?: string
  style?: string
}): AsyncState<LookScene[]> {
  const key = JSON.stringify(params ?? {})
  const factory = useCallback(() => getLooks(params), [key]) // eslint-disable-line react-hooks/exhaustive-deps
  return useAsync(factory, [key])
}

export function useStores(): AsyncState<Store[]> {
  const factory = useCallback(() => getStores(), [])
  return useAsync(factory, [])
}
