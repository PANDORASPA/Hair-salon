import test from 'node:test'
import assert from 'node:assert/strict'
import recovery from '../lib/auth/password-recovery.js'

test('recovery callback returns to the password reset page', () => {
  assert.equal(
    recovery.buildRecoveryRedirect('https://www.salonpoke.com'),
    'https://www.salonpoke.com/auth/callback?next=%2Freset-password',
  )
})

test('auth redirects reject external and protocol-relative destinations', () => {
  assert.equal(recovery.safeAuthPath('https://evil.example', '/account'), '/account')
  assert.equal(recovery.safeAuthPath('//evil.example', '/account'), '/account')
  assert.equal(recovery.safeAuthPath('/reset-password', '/account'), '/reset-password')
})

test('new passwords must be long enough and match', () => {
  assert.deepEqual(recovery.validateNewPassword('short', 'short'), {
    ok: false,
    error: 'Use at least 8 characters.',
  })
  assert.deepEqual(recovery.validateNewPassword('secure-pass', 'different'), {
    ok: false,
    error: 'Passwords do not match.',
  })
  assert.deepEqual(recovery.validateNewPassword('secure-pass', 'secure-pass'), { ok: true })
})

test('post-password destination follows administrator membership', () => {
  assert.equal(recovery.postPasswordPath(true), '/admin')
  assert.equal(recovery.postPasswordPath(false), '/account')
})

test('recovery requests use the secure reset callback', () => {
  assert.deepEqual(recovery.recoveryRequestOptions('https://www.salonpoke.com/'), {
    redirectTo: 'https://www.salonpoke.com/auth/callback?next=%2Freset-password',
  })
})
