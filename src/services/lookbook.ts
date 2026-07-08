import type { LookScene } from '@/types'
import { looks } from '@/data/looks'
import { resolve } from './client'

/** Lookbook service — read endpoints shaped like a future REST API. */
export function getLooks(params?: {
  room?: string
  style?: string
}): Promise<LookScene[]> {
  let list = looks
  if (params?.room) list = list.filter((l) => l.room === params.room)
  if (params?.style) list = list.filter((l) => l.style === params.style)
  return resolve(list)
}

export function getLookById(id: string): Promise<LookScene | null> {
  return resolve(looks.find((l) => l.id === id) ?? null)
}
