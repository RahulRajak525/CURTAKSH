import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Standard vertical rhythm block: clamp(96px,14vh,220px) padding. */
export function Section({
  as,
  id,
  className,
  children,
}: {
  as?: ElementType
  id?: string
  className?: string
  children: ReactNode
}) {
  const Tag = as ?? 'section'
  return (
    <Tag id={id} className={cn('py-section', className)}>
      {children}
    </Tag>
  )
}
