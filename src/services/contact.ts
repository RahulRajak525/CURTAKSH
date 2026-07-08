import type { ContactMessage, ContactConfirmation } from '@/types'
import { resolve } from './client'

/** Contact form service — stub. Real interface, no-op body. */
export function submitContact(
  message: ContactMessage,
): Promise<ContactConfirmation> {
  void message
  return resolve<ContactConfirmation>({
    id: `msg-${Date.now()}`,
    status: 'received',
  })
}
