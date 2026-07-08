import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface IconButtonProps extends ComponentPropsWithoutRef<'button'> {
  /** Required accessible name — icon buttons have no text. */
  label: string
  variant?: 'outline' | 'ghost' | 'solid'
  size?: 'sm' | 'md'
  children: ReactNode
}

/** Circular icon-only button. `label` becomes aria-label. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, variant = 'outline', size = 'md', className, children, ...props }, ref) => {
    const variants = {
      outline: 'border border-line text-ink hover:border-ink hover:bg-ink/[0.04]',
      ghost: 'text-ink hover:bg-ink/[0.06]',
      solid: 'bg-ink text-bg hover:bg-ink/90',
    }
    const sizes = { sm: 'h-9 w-9', md: 'h-11 w-11' }
    return (
      <button
        ref={ref}
        aria-label={label}
        title={label}
        className={cn(
          'inline-flex items-center justify-center rounded-full transition-colors duration-fast ease-settle',
          'active:scale-[0.96] disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    )
  },
)

IconButton.displayName = 'IconButton'
