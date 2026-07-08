import type { HeaderStyle } from '@/types'

/** Tiny line diagrams for each curtain header style. Inherit currentColor. */
export function HeaderStyleIcon({ type }: { type: HeaderStyle }) {
  const common = {
    width: 40,
    height: 32,
    viewBox: '0 0 40 32',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  const rod = <line x1="3" y1="6" x2="37" y2="6" />

  switch (type) {
    case 'eyelet':
      return (
        <svg {...common}>
          {rod}
          {[10, 20, 30].map((x) => (
            <circle key={x} cx={x} cy="6" r="2.2" />
          ))}
          <path d="M7 10c2 3-2 5 0 8s-2 5 0 8M20 10c2 3-2 5 0 8s-2 5 0 8M33 10c2 3-2 5 0 8s-2 5 0 8" />
        </svg>
      )
    case 'pinch-pleat':
      return (
        <svg {...common}>
          {rod}
          <path d="M8 8l2 4 2-4M18 8l2 4 2-4M28 8l2 4 2-4" />
          <path d="M8 12v14M14 12v14M22 12v14M28 12v14M34 12v14" />
        </svg>
      )
    case 'tab-top':
      return (
        <svg {...common}>
          {rod}
          {[9, 20, 31].map((x) => (
            <path key={x} d={`M${x - 3} 10c0-5 6-5 6 0`} />
          ))}
          <path d="M6 12c3 3-1 5 1 8s-1 5 1 8M20 12c3 3-1 5 1 8s-1 5 1 8M34 12c-3 3 1 5-1 8s1 5-1 8" />
        </svg>
      )
    case 'rod-pocket':
      return (
        <svg {...common}>
          {rod}
          <path d="M3 9h34" />
          <path d="M6 12c2 3-2 5 0 8s-2 5 0 8M14 12c2 3-2 5 0 8s-2 5 0 8M22 12c2 3-2 5 0 8s-2 5 0 8M30 12c2 3-2 5 0 8s-2 5 0 8" />
        </svg>
      )
  }
}
