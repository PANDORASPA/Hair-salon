'use client'

import Link from 'next/link'
import { useState } from 'react'
import { getBrowserClient } from '../../lib/supabase/browser'
import recovery from '../../lib/auth/password-recovery'

const { recoveryRequestOptions } = recovery
const successMessage = 'If an account exists, a password email has been sent.'

export default function PasswordRecoveryForm() {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    setError('')
    const email = String(new FormData(event.currentTarget).get('email')).trim().toLowerCase()
    const { error: requestError } = await getBrowserClient().auth.resetPasswordForEmail(
      email,
      recoveryRequestOptions(window.location.origin),
    )
    setBusy(false)
    if (requestError) {
      setError('We could not send the password email. Please try again shortly.')
      return
    }
    setMessage(successMessage)
  }

  return <form className="salon-form auth-form" onSubmit={submit}>
    <label>Email<input type="email" name="email" autoComplete="email" required /></label>
    {error ? <p role="alert" className="salon-error">{error}</p> : null}
    {message ? <p role="status" className="salon-success">{message}</p> : null}
    <button className="salon-button" disabled={busy}>{busy ? 'Please wait…' : 'Send password email'}</button>
    <p><Link href="/admin/login">Back to ADMIN sign in</Link></p>
  </form>
}
