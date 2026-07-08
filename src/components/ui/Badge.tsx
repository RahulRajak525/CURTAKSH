import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'outline' | 'solid' | 'accent'

/** Small mono pill — status, category, or counter. */
export function Badge({
  variant = 'outline',
  className,
  children,
}: {
  variant?: BadgeVariant
  className?: string
  children: ReactNode
}) {
  const styles: Record<BadgeVariant, string> = {
    outline: 'border border-line text-ink/80',
    solid: 'bg-ink text-bg',
    accent: 'bg-accent/15 text-accent border border-accent/30',
  }
  return (
    <span
      className={cn(
        'label inline-flex items-center gap-1.5 rounded-full px-3 py-1',
        styles[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
