import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useMagnetic } from '@/hooks/useMagnetic'

export type ButtonVariant = 'solid' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Ease toward the cursor on hover (disabled under reduced-motion). */
  magnetic?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
}

const VARIANTS: Record<ButtonVariant, string> = {
  solid: 'bg-ink text-bg hover:bg-ink/90',
  outline: 'border border-line text-ink hover:border-ink hover:bg-ink/[0.04]',
  ghost: 'text-ink hover:bg-ink/[0.06]',
}

/** Tint of the hover light-sweep, keyed to each variant's surface. */
const SHEEN: Record<ButtonVariant, string> = {
  solid: 'via-bg/30',
  outline: 'via-ink/10',
  ghost: 'via-ink/10',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-14 px-8 text-base',
}

/**
 * Primary action. Variants: solid / outline / ghost. Optional `magnetic` hover
 * that eases the button toward the cursor. Theme-reactive via tokens.
 *
 * The magnetic transform lives on a wrapper span so it never collides with the
 * button's own event props.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'solid',
      size = 'md',
      magnetic = false,
      iconLeft,
      iconRight,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const mag = useMagnetic<HTMLSpanElement>()

    const button = (
      <button
        ref={ref}
        className={cn(
          'group relative inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-full font-sans font-medium',
          'transition-[background-color,border-color,color,transform] duration-fast ease-settle',
          'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
          VARIANTS[variant],
          SIZES[size],
          className,
        )}
        {...props}
      >
        {/* Light-sweep: a slow sheen glides across on hover. */}
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 -translate-x-[130%] skew-x-[-20deg] bg-gradient-to-r from-transparent to-transparent',
            'transition-transform duration-[900ms] ease-out group-hover:translate-x-[130%]',
            'motion-reduce:hidden',
            SHEEN[variant],
          )}
        />
        {iconLeft && (
          <span className="relative z-[1] inline-flex transition-transform duration-base ease-settle group-hover:-translate-x-0.5 motion-reduce:transform-none">
            {iconLeft}
          </span>
        )}
        <span className="relative z-[1]">{children}</span>
        {iconRight && (
          <span className="relative z-[1] inline-flex transition-transform duration-base ease-settle group-hover:translate-x-0.5 motion-reduce:transform-none">
            {iconRight}
          </span>
        )}
      </button>
    )

    if (!magnetic) return button

    return (
      <motion.span
        ref={mag.ref}
        style={mag.style}
        onMouseMove={mag.onMouseMove}
        onMouseLeave={mag.onMouseLeave}
        className="inline-flex"
      >
        {button}
      </motion.span>
    )
  },
)

Button.displayName = 'Button'
