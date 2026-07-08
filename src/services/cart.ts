import type { Cart, CartLineInput } from '@/types'
import { resolve } from './client'

/**
 * Cart service — stub. Real interface, local (in-memory + localStorage) body.
 * Swap the bodies for API calls later; signatures stay put.
 */
const STORAGE_KEY = 'drape.cart'

function emptyCart(): Cart {
  return { id: 'local-cart', lines: [], subtotal: { amount: 0, currency: 'USD' } }
}

function read(): Cart {
  if (typeof localStorage === 'undefined') return emptyCart()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Cart) : emptyCart()
  } catch {
    return emptyCart()
  }
}

function write(cart: Cart): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
}

export function getCart(): Promise<Cart> {
  return resolve(read())
}

export function addToCart(line: CartLineInput): Promise<Cart> {
  const cart = read()
  cart.lines.push({ ...line, id: `line-${Date.now()}` })
  write(cart)
  return resolve(cart)
}

export function removeFromCart(lineId: string): Promise<Cart> {
  const cart = read()
  cart.lines = cart.lines.filter((l) => l.id !== lineId)
  write(cart)
  return resolve(cart)
}

export function clearCart(): Promise<Cart> {
  const cart = emptyCart()
  write(cart)
  return resolve(cart)
}
