import { cn } from '@/lib/utils'

/**
 * Loading placeholder. Token-driven (uses --ink over --surface) so it reads on
 * every light phase. Shimmer is CSS-only and respects reduced-motion via the
 * global animation clamp in index.css.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative overflow-hidden rounded-md bg-ink/[0.06]',
        'before:absolute before:inset-0 before:-translate-x-full',
        'before:bg-gradient-to-r before:from-transparent before:via-ink/[0.06] before:to-transparent',
        'before:animate-[drape-shimmer_1.6s_infinite]',
        className,
      )}
    />
  )
}
