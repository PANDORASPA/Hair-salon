const safeAuthPath = (value, fallback = '/account') =>
  value?.startsWith('/') && !value.startsWith('//') ? value : fallback

const buildRecoveryRedirect = (origin) =>
  `${String(origin).replace(/\/$/, '')}/auth/callback?next=${encodeURIComponent('/reset-password')}`

const recoveryRequestOptions = (origin) => ({
  redirectTo: buildRecoveryRedirect(origin),
})

const validateNewPassword = (password, confirmation) => {
  if (String(password).length < 8) return { ok: false, error: 'Use at least 8 characters.' }
  if (password !== confirmation) return { ok: false, error: 'Passwords do not match.' }
  return { ok: true }
}

const postPasswordPath = (isAdmin) => (isAdmin ? '/admin' : '/account')

module.exports = {
  safeAuthPath,
  buildRecoveryRedirect,
  recoveryRequestOptions,
  validateNewPassword,
  postPasswordPath,
}
