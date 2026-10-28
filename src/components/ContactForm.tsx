import { useState } from 'react'
import { PaperAirplaneIcon, CheckCircleIcon } from '@heroicons/react/24/solid'
import { useLang } from '../i18n'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type SendState = 'idle' | 'sending' | 'sent' | 'error'

export default function ContactForm() {
  const { t } = useLang()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [sendState, setSendState] = useState<SendState>('idle')

  const ready =
    name.trim().length > 0 && EMAIL_RE.test(email.trim()) && message.trim().length > 0

  const submit = async () => {
    if (!ready || sendState === 'sending') return
    setSendState('sending')
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, website: honeypot }),
      })
      if (res.ok) {
        setSendState('sent')
        setName('')
        setEmail('')
        setMessage('')
      } else {
        setSendState('error')
      }
    } catch {
      setSendState('error')
    }
  }

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-ink/10 bg-white p-6 sm:p-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="ct-name" className="mb-2.5 block text-xs font-semibold text-ink/45 uppercase">
            {t.contact.name} <span className="text-ink/30">*</span>
          </label>
          <input
            id="ct-name"
            className="field"
            placeholder={t.contact.namePh}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="ct-email" className="mb-2.5 block text-xs font-semibold text-ink/45 uppercase">
            {t.contact.email} <span className="text-ink/30">*</span>
          </label>
          <input
            id="ct-email"
            type="email"
            className="field"
            placeholder={t.contact.emailPh}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="ct-msg" className="mb-2.5 block text-xs font-semibold text-ink/45 uppercase">
          {t.contact.message} <span className="text-ink/30">*</span>
        </label>
        <textarea
          id="ct-msg"
          rows={5}
          className="field resize-y"
          placeholder={t.contact.messagePh}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {/* honeypot - hidden from humans, bots fill it and get silently dropped */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute -left-[9999px] h-px w-px opacity-0"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
      />

      <button
        type="button"
        onClick={submit}
        aria-disabled={!ready || sendState === 'sending'}
        className={`btn-dark mt-6 w-full px-6 py-3.5 text-sm uppercase ${
          ready && sendState !== 'sending' ? '' : 'cursor-not-allowed opacity-35'
        }`}
      >
        <PaperAirplaneIcon className="h-4 w-4" />
        {sendState === 'sending' ? t.contact.sending : t.contact.send}
      </button>

      {sendState === 'sent' && (
        <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-ink/10 bg-ink/[0.03] px-4 py-3">
          <CheckCircleIcon className="h-4 w-4 shrink-0 text-ink" />
          <p className="text-xs font-semibold">{t.contact.sent}</p>
        </div>
      )}
      {sendState === 'error' && (
        <p className="mt-4 text-center text-xs text-red-500/80">{t.contact.failed}</p>
      )}
      {!ready && sendState !== 'sent' && (
        <p className="mt-4 text-center text-xs text-ink/45">{t.contact.fillRequired}</p>
      )}
    </div>
  )
}
