import { cn } from '@/lib/utils'

/** Hairline rule in the theme's --line colour. */
export function Divider({
  orientation = 'horizontal',
  className,
}: {
  orientation?: 'horizontal' | 'vertical'
  className?: string
}) {
  return (
    <span
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'block bg-line',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
    />
  )
}
