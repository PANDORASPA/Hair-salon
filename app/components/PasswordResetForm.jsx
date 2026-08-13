'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getBrowserClient } from '../../lib/supabase/browser'
import recovery from '../../lib/auth/password-recovery'

const { postPasswordPath, validateNewPassword } = recovery

export default function PasswordResetForm() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [hasSession, setHasSession] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getBrowserClient().auth.getUser().then(({ data }) => {
      if (active) {
        setHasSession(Boolean(data.user))
        setChecking(false)
      }
    }).catch(() => {
      if (active) setChecking(false)
    })
    return () => { active = false }
  }, [])

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    const form = new FormData(event.currentTarget)
    const password = String(form.get('password'))
    const confirmation = String(form.get('confirmation'))
    const validation = validateNewPassword(password, confirmation)
    if (!validation.ok) {
      setError(validation.error)
      return
    }
    setBusy(true)
    const supabase = getBrowserClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })
    if (updateError) {
      setError('This password link has expired. Please request a new one.')
      setBusy(false)
      return
    }
    const { data: { user } } = await supabase.auth.getUser()
    const { data: admin } = user
      ? await supabase.from('admin_users').select('is_active').eq('user_id', user.id).maybeSingle()
      : { data: null }
    router.push(postPasswordPath(Boolean(admin?.is_active)))
    router.refresh()
  }

  if (checking) return <p>Checking your password link…</p>
  if (!hasSession) return <div className="salon-form auth-form">
    <p role="alert" className="salon-error">This password link is missing or has expired.</p>
    <Link className="salon-button" href="/forgot-password">Request a new password email</Link>
  </div>

  return <form className="salon-form auth-form" onSubmit={submit}>
    <label>New password<input type="password" name="password" autoComplete="new-password" minLength="8" required /></label>
    <label>Confirm new password<input type="password" name="confirmation" autoComplete="new-password" minLength="8" required /></label>
    {error ? <p role="alert" className="salon-error">{error}</p> : null}
    <button className="salon-button" disabled={busy}>{busy ? 'Saving…' : 'Set password'}</button>
  </form>
}
