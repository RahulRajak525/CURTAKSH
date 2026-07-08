import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Restrained glassmorphism: surface at ~60% alpha + 20px backdrop blur +
 * 1px --line border (see the .glass component class). Theme-reactive.
 */
export function GlassPanel({
  as,
  radius = 'lg',
  className,
  children,
}: {
  as?: ElementType
  radius?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  children: ReactNode
}) {
  const Tag = as ?? 'div'
  const radii = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
  }[radius]
  return <Tag className={cn('glass', radii, className)}>{children}</Tag>
}
