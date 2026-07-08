import type { Store } from '@/types'
import { stores } from '@/data/stores'
import { resolve } from './client'

/** Store locator service. Static now; structured for a map/geo API later. */
export function getStores(): Promise<Store[]> {
  return resolve(stores)
}
