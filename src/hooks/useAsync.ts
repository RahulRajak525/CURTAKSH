import { useEffect, useState } from 'react'
import type { AsyncState } from '@/types'

/**
 * Runs an async factory and tracks { data, isLoading, error }. Handles
 * unmount/stale-response races via a cancellation flag. `deps` controls re-run.
 */
export function useAsync<T>(
  factory: () => Promise<T>,
  deps: readonly unknown[],
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false
    setState({ data: null, isLoading: true, error: null })

    factory()
      .then((data) => {
        if (!cancelled) setState({ data, isLoading: false, error: null })
      })
      .catch((error: unknown) => {
        if (!cancelled)
          setState({
            data: null,
            isLoading: false,
            error: error instanceof Error ? error : new Error(String(error)),
          })
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
