import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Centered max-width wrapper with responsive gutters. */
export function Container({
  as,
  size = 'default',
  className,
  children,
}: {
  as?: ElementType
  size?: 'default' | 'narrow' | 'wide' | 'full'
  className?: string
  children: ReactNode
}) {
  const Tag = as ?? 'div'
  const max = {
    narrow: 'max-w-3xl',
    default: 'max-w-container',
    wide: 'max-w-[1680px]',
    full: 'max-w-none',
  }[size]
  return (
    <Tag className={cn('mx-auto w-full px-gutter', max, className)}>
      {children}
    </Tag>
  )
}
