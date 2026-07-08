/**
 * Mock transport. Every service resolves local seed data through here so that
 * call sites already deal with promises + latency — the day a real API arrives,
 * only this file and the service bodies change.
 */

/** Simulated network latency (ms). Set VITE_MOCK_LATENCY=0 to disable. */
const LATENCY = Number(import.meta.env.VITE_MOCK_LATENCY ?? 220)

/** Resolve a (deep-cloned) copy of local data after a short delay. */
export function resolve<T>(data: T, latency = LATENCY): Promise<T> {
  const copy =
    typeof structuredClone === 'function'
      ? structuredClone(data)
      : (JSON.parse(JSON.stringify(data)) as T)
  if (latency <= 0) return Promise.resolve(copy)
  return new Promise((res) => setTimeout(() => res(copy), latency))
}

/** Reject after a delay — for exercising error UI in development. */
export function reject(message: string, latency = LATENCY): Promise<never> {
  return new Promise((_, rej) =>
    setTimeout(() => rej(new Error(message)), latency),
  )
}
