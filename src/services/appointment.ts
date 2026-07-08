import type {
  AppointmentSlot,
  AppointmentRequest,
  AppointmentConfirmation,
  ConsultationRequest,
  ConsultationConfirmation,
} from '@/types'
import { resolve } from './client'

/**
 * Appointment booking service — stub. Real interface, no-op/local body.
 * Generates a rolling set of slots and "confirms" requests locally.
 */
export function getAvailableSlots(
  kind: AppointmentRequest['kind'] = 'showroom',
): Promise<AppointmentSlot[]> {
  const now = new Date()
  const slots: AppointmentSlot[] = []
  for (let day = 1; day <= 7; day++) {
    for (const hour of [10, 13, 16]) {
      const start = new Date(now)
      start.setDate(now.getDate() + day)
      start.setHours(hour, 0, 0, 0)
      slots.push({
        id: `${kind}-${start.toISOString()}`,
        start: start.toISOString(),
        // deterministically mark a few as taken
        available: (day + hour) % 3 !== 0,
      })
    }
  }
  return resolve(slots)
}

export function requestAppointment(
  request: AppointmentRequest,
): Promise<AppointmentConfirmation> {
  // No-op: pretend the booking succeeded.
  return resolve<AppointmentConfirmation>({
    id: `appt-${Date.now()}`,
    status: 'confirmed',
    request,
  })
}

/** Design-service enquiry (Atelier form). Stub — no-op body. */
export function requestConsultation(
  request: ConsultationRequest,
): Promise<ConsultationConfirmation> {
  return resolve<ConsultationConfirmation>({
    id: `consult-${Date.now()}`,
    status: 'received',
    request,
  })
}
