import { resolve } from './client'

/**
 * Free-swatch service — stub. Real interface, no-op/local body.
 */
export interface SwatchRequest {
  /** present when ordered from a product; absent for a raw fabric swatch */
  productId?: string
  fabricId?: string
  colour?: string
}

export interface SwatchConfirmation {
  id: string
  status: 'requested'
  request: SwatchRequest
}

export function requestSwatch(
  request: SwatchRequest,
): Promise<SwatchConfirmation> {
  return resolve<SwatchConfirmation>({
    id: `swatch-${Date.now()}`,
    status: 'requested',
    request,
  })
}
