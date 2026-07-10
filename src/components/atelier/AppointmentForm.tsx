import { useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui'
import { requestConsultation } from '@/services'
import { content } from '@/config/content'
import { cn } from '@/lib/utils'
import { openWhatsApp, composeWhatsappMessage } from '@/lib/whatsapp'

type Fields = {
  name: string
  email: string
  phone: string
  city: string
  projectType: string
  message: string
}

const empty: Fields = {
  name: '',
  email: '',
  phone: '',
  city: '',
  projectType: '',
  message: '',
}

const f = content.designService.form

export function AppointmentForm() {
  const [values, setValues] = useState<Fields>(empty)
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({})
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  const set = (key: keyof Fields, v: string) => {
    setValues((prev) => ({ ...prev, [key]: v }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const validate = (): boolean => {
    const next: Partial<Record<keyof Fields, string>> = {}
    if (!values.name.trim()) next.name = 'Please enter your name'
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email))
      next.email = 'Enter a valid email'
    if (!values.phone.trim()) next.phone = 'Please enter a phone number'
    if (!values.city.trim()) next.city = 'Please enter your city'
    if (!values.projectType) next.projectType = 'Choose a project type'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    // Route the booking inquiry to WhatsApp (app on mobile, web on desktop).
    // Opened synchronously within the submit gesture so it isn't popup-blocked.
    openWhatsApp(
      composeWhatsappMessage('Hi Curtaksh, I’d like to book a consultation.', [
        ['Name', values.name],
        ['Email', values.email],
        ['Phone', values.phone],
        ['City', values.city],
        ['Project', values.projectType],
        ['Message', values.message],
      ]),
    )

    setBusy(true)
    await requestConsultation({
      name: values.name,
      email: values.email,
      phone: values.phone,
      city: values.city,
      projectType: values.projectType,
      message: values.message || undefined,
    })
    setBusy(false)
    setDone(true)
  }

  if (done) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-lg border border-line bg-surface/50 p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
          <Check className="h-6 w-6" strokeWidth={2} />
        </span>
        <p className="max-w-sm text-body text-ink">{f.success}</p>
      </div>
    )
  }

  const field = (
    key: keyof Fields,
    label: string,
    type = 'text',
    autoComplete?: string,
  ) => (
    <label className="block">
      <span className="mb-1.5 block text-small text-muted">{label}</span>
      <input
        type={type}
        value={values[key]}
        autoComplete={autoComplete}
        aria-invalid={!!errors[key]}
        onChange={(e) => set(key, e.target.value)}
        className={cn(
          'h-11 w-full rounded-lg border bg-transparent px-3.5 text-body text-ink outline-none transition-colors',
          errors[key] ? 'border-red-500/70' : 'border-line focus:border-ink',
        )}
      />
      {errors[key] && (
        <span className="mt-1 block text-small text-red-500">{errors[key]}</span>
      )}
    </label>
  )

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {field('name', f.labels.name, 'text', 'name')}
        {field('email', f.labels.email, 'email', 'email')}
        {field('phone', f.labels.phone, 'tel', 'tel')}
        {field('city', f.labels.city, 'text', 'address-level2')}
      </div>

      <label className="block">
        <span className="mb-1.5 block text-small text-muted">
          {f.labels.projectType}
        </span>
        <select
          value={values.projectType}
          aria-invalid={!!errors.projectType}
          onChange={(e) => set('projectType', e.target.value)}
          className={cn(
            'h-11 w-full rounded-lg border bg-transparent px-3.5 text-body text-ink outline-none transition-colors',
            errors.projectType ? 'border-red-500/70' : 'border-line focus:border-ink',
          )}
        >
          <option value="">Select…</option>
          {f.projectTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {errors.projectType && (
          <span className="mt-1 block text-small text-red-500">
            {errors.projectType}
          </span>
        )}
      </label>

      <label className="block">
        <span className="mb-1.5 block text-small text-muted">
          {f.labels.message}
        </span>
        <textarea
          value={values.message}
          onChange={(e) => set('message', e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-line bg-transparent px-3.5 py-3 text-body text-ink outline-none transition-colors focus:border-ink"
        />
      </label>

      <Button type="submit" variant="solid" size="lg" disabled={busy} className="self-start">
        {busy ? 'Sending…' : f.labels.submit}
      </Button>
    </form>
  )
}
