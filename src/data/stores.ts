import type { Store } from '@/types'

/** Local seed data. Only ever read through services/ — never import directly.
 *  Structured so a map / distance API can slot in later (lat/lng present). */
export const stores: Store[] = [
  {
    id: 'store-mumbai',
    name: 'CurtakshMumbai',
    city: 'Mumbai',
    address: 'Kala Ghoda, Fort, Mumbai 400001',
    phone: '+91 22 5550 0147',
    hours: 'Tue–Sun, 11–7',
    lat: 18.9285,
    lng: 72.8326,
  },
  {
    id: 'store-delhi',
    name: 'CurtakshNew Delhi',
    city: 'New Delhi',
    address: 'Dhan Mill Compound, Chhatarpur, New Delhi 110074',
    phone: '+91 11 5550 0148',
    hours: 'Tue–Sun, 11–7',
    lat: 28.5021,
    lng: 77.1908,
  },
  {
    id: 'store-bengaluru',
    name: 'CurtakshBengaluru',
    city: 'Bengaluru',
    address: 'Indiranagar 100 Ft Road, Bengaluru 560038',
    phone: '+91 80 5550 0149',
    hours: 'Tue–Sun, 11–7',
    lat: 12.9719,
    lng: 77.6412,
  },
  {
    id: 'store-chennai',
    name: 'CurtakshChennai',
    city: 'Chennai',
    address: 'Boat Club Road, R.A. Puram, Chennai 600028',
    phone: '+91 44 5550 0150',
    hours: 'Tue–Sun, 11–7',
    lat: 13.0186,
    lng: 80.2565,
  },
]
