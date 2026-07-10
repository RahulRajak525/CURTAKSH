import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'
import type { ButtonSize } from './Button'

export interface SlideButtonProps extends ComponentPropsWithoutRef<'button'> {
  size?: ButtonSize
  /** Side the incoming (inverted) layer slides in from. Default 'left'. */
  from?: 'left' | 'right'
  /** Visible label. Used for both slide layers and the accessible name. */
  children: string
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-14 px-8 text-base',
}

/**
 * Slide-swap action. On hover the dark layer (bg-ink / text-bg) slides out to
 * the left while an inverted layer (bg-bg / text-ink) slides in from the right —
 * a smooth, weighted colour flip. Theme-reactive via tokens; snaps under
 * reduced-motion. Layout width comes from an invisible in-flow sizer so both
 * moving layers can be absolutely positioned.
 */
export const SlideButton = forwardRef<HTMLButtonElement, SlideButtonProps>(
  ({ size = 'md', from = 'left', className, children, ...props }, ref) => {
    const layer =
      'absolute inset-0 flex items-center justify-center transition-transform duration-[520ms] ease-[cubic-bezier(0.83,0,0.17,1)] motion-reduce:transition-none'

    // Incoming enters from `from`; the default layer exits to the opposite side.
    const incomingStart =
      from === 'left' ? '-translate-x-full' : 'translate-x-full'
    const defaultExit =
      from === 'left' ? 'group-hover:translate-x-full' : 'group-hover:-translate-x-full'

    return (
      <button
        ref={ref}
        className={cn(
          'group relative inline-flex select-none items-center justify-center overflow-hidden rounded-full border border-ink font-sans font-medium',
          'transition-transform duration-fast ease-settle active:scale-[0.98]',
          'disabled:pointer-events-none disabled:opacity-50',
          SIZES[size],
          className,
        )}
        {...props}
      >
        {/* Invisible sizer — defines intrinsic width and the accessible name. */}
        <span className="opacity-0">{children}</span>

        {/* Default layer: dark fill, light text — slides out on hover. */}
        <span
          aria-hidden="true"
          className={cn(layer, 'bg-ink text-bg', defaultExit)}
        >
          {children}
        </span>

        {/* Incoming layer: light fill, dark text — slides in on hover. */}
        <span
          aria-hidden="true"
          className={cn(
            layer,
            'bg-bg text-ink group-hover:translate-x-0',
            incomingStart,
          )}
        >
          {children}
        </span>
      </button>
    )
  },
)

SlideButton.displayName = 'SlideButton'
