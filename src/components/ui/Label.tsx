import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Mono uppercase label for specs, counters, eyebrows.
 * Geist Mono, .15em tracking (see the .label component class).
 */
export function Label({
  as,
  className,
  children,
}: {
  as?: ElementType
  className?: string
  children: ReactNode
}) {
  const Tag = as ?? 'span'
  return <Tag className={cn('label text-muted', className)}>{children}</Tag>
}
