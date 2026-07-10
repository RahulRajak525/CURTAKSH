import { useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui'
import { submitContact } from '@/services'
import { content } from '@/config/content'
import { cn } from '@/lib/utils'
import { openWhatsApp, composeWhatsappMessage } from '@/lib/whatsapp'

type Fields = { name: string; email: string; topic: string; message: string }
const empty: Fields = { name: '', email: '', topic: '', message: '' }
const c = content.contact

export function ContactForm() {
  const [values, setValues] = useState<Fields>(empty)
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({})
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  const set = (key: keyof Fields, v: string) => {
    setValues((p) => ({ ...p, [key]: v }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const next: Partial<Record<keyof Fields, string>> = {}
    if (!values.name.trim()) next.name = 'Please enter your name'
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email))
      next.email = 'Enter a valid email'
    if (!values.topic) next.topic = 'Choose a topic'
    if (!values.message.trim()) next.message = 'Please enter a message'
    setErrors(next)
    if (Object.keys(next).length) return

    // Route the inquiry to WhatsApp (app on mobile, web on desktop). Opened
    // synchronously within the submit gesture so the tab isn't popup-blocked.
    openWhatsApp(
      composeWhatsappMessage('Hi Curtaksh, I have an inquiry.', [
        ['Name', values.name],
        ['Email', values.email],
        ['Topic', values.topic],
        ['Message', values.message],
      ]),
    )

    setBusy(true)
    await submitContact(values)
    setBusy(false)
    setDone(true)
  }

  if (done) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-lg border border-line bg-surface/50 p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
          <Check className="h-6 w-6" strokeWidth={2} />
        </span>
        <p className="max-w-sm text-body text-ink">{c.success}</p>
      </div>
    )
  }

  const inputCls = (key: keyof Fields) =>
    cn(
      'w-full rounded-lg border bg-transparent px-3.5 text-body text-ink outline-none transition-colors',
      errors[key] ? 'border-red-500/70' : 'border-line focus:border-ink',
    )

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-small text-muted">{c.labels.name}</span>
          <input
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
            className={cn('h-11', inputCls('name'))}
          />
          {errors.name && <span className="mt-1 block text-small text-red-500">{errors.name}</span>}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-small text-muted">{c.labels.email}</span>
          <input
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
            className={cn('h-11', inputCls('email'))}
          />
          {errors.email && <span className="mt-1 block text-small text-red-500">{errors.email}</span>}
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-small text-muted">{c.labels.topic}</span>
        <select
          value={values.topic}
          onChange={(e) => set('topic', e.target.value)}
          className={cn('h-11', inputCls('topic'))}
        >
          <option value="">Select…</option>
          {c.topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {errors.topic && <span className="mt-1 block text-small text-red-500">{errors.topic}</span>}
      </label>

      <label className="block">
        <span className="mb-1.5 block text-small text-muted">{c.labels.message}</span>
        <textarea
          rows={5}
          value={values.message}
          onChange={(e) => set('message', e.target.value)}
          className={cn('py-3', inputCls('message'))}
        />
        {errors.message && <span className="mt-1 block text-small text-red-500">{errors.message}</span>}
      </label>

      <Button type="submit" variant="solid" size="lg" disabled={busy} className="self-start">
        {busy ? 'Sending…' : c.labels.submit}
      </Button>
    </form>
  )
}
