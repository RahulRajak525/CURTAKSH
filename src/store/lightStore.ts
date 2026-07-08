import { create } from 'zustand'
import { clampPhase } from '@/lib/theme'

/**
 * The single source of truth for the app's light phase (0..1).
 *   0    = Dawn
 *   0.33 = Noon (default)
 *   0.66 = Dusk
 *   1    = Night
 *
 * This store only holds *state*. Turning a phase into painted CSS variables is
 * the LightProvider's job (it subscribes here and calls lib/theme.setLightPhase).
 */
export interface LightState {
  lightPhase: number
  /** When true, the phase slowly oscillates on its own. */
  autoDrift: boolean
  setLightPhase: (phase: number) => void
  /** Relative change, e.g. keyboard arrows. */
  nudgePhase: (delta: number) => void
  toggleAutoDrift: () => void
  setAutoDrift: (value: boolean) => void
}

export const useLightStore = create<LightState>((set, get) => ({
  lightPhase: 0.33,
  autoDrift: false,
  setLightPhase: (phase) => set({ lightPhase: clampPhase(phase) }),
  nudgePhase: (delta) =>
    set({ lightPhase: clampPhase(get().lightPhase + delta) }),
  toggleAutoDrift: () => set({ autoDrift: !get().autoDrift }),
  setAutoDrift: (value) => set({ autoDrift: value }),
}))
