# Salon Poke Password Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let invited administrators securely create or recover a password and then enter the Salon Poke ADMIN area.

**Architecture:** Put password validation and redirect derivation in a small framework-independent auth module. Two focused client forms request recovery and update the authenticated user, while the existing callback remains the single session-exchange boundary. Pages compose those forms and the ADMIN login links to recovery.

**Tech Stack:** Next.js 16 App Router, React, `@supabase/ssr`, Node test runner, Vercel, Supabase Auth.

## Global Constraints

- Redirect destinations must remain local paths and must never allow `//` or external URLs.
- Passwords go directly from the browser to Supabase and must not be logged or persisted by the application.
- New passwords require at least eight characters and exact confirmation.
- Recovery requests must not reveal whether an email exists.
- Existing customer sign-in, appointment, and ADMIN authorization behavior must remain unchanged.

## File map

- Create `lib/auth/password-recovery.js`: pure validation and redirect helpers.
- Create `app/components/PasswordRecoveryForm.jsx`: request a recovery email.
- Create `app/components/PasswordResetForm.jsx`: update password for the current recovery session and route by ADMIN membership.
- Create `app/forgot-password/page.js`: recovery-request page.
- Create `app/reset-password/page.js`: password-update page.
- Modify `app/components/AuthForm.jsx`: expose recovery link on sign-in forms.
- Modify `app/auth/callback/route.js`: retain safe `next` redirect and use the shared helper.
- Create `tests/password-recovery.test.mjs`: executable behavioral tests for validation and redirect contracts.

---

### Task 1: Password recovery contracts

**Files:**
- Create: `lib/auth/password-recovery.js`
- Create: `tests/password-recovery.test.mjs`
- Modify: `app/auth/callback/route.js`

**Interfaces:**
- Produces: `safeAuthPath(value, fallback) -> string`
- Produces: `buildRecoveryRedirect(origin) -> string`
- Produces: `validateNewPassword(password, confirmation) -> { ok: true } | { ok: false, error: string }`
- Produces: `postPasswordPath(isAdmin) -> '/admin' | '/account'`

- [ ] **Step 1: Write failing behavioral tests**

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import recovery from '../lib/auth/password-recovery.js'

test('recovery callback returns to the password reset page', () => {
  assert.equal(recovery.buildRecoveryRedirect('https://www.salonpoke.com'), 'https://www.salonpoke.com/auth/callback?next=%2Freset-password')
})

test('auth redirects reject external and protocol-relative destinations', () => {
  assert.equal(recovery.safeAuthPath('https://evil.example', '/account'), '/account')
  assert.equal(recovery.safeAuthPath('//evil.example', '/account'), '/account')
  assert.equal(recovery.safeAuthPath('/reset-password', '/account'), '/reset-password')
})

test('new passwords must be long enough and match', () => {
  assert.deepEqual(recovery.validateNewPassword('short', 'short'), { ok:false, error:'Use at least 8 characters.' })
  assert.deepEqual(recovery.validateNewPassword('secure-pass', 'different'), { ok:false, error:'Passwords do not match.' })
  assert.deepEqual(recovery.validateNewPassword('secure-pass', 'secure-pass'), { ok:true })
})

test('post-password destination follows administrator membership', () => {
  assert.equal(recovery.postPasswordPath(true), '/admin')
  assert.equal(recovery.postPasswordPath(false), '/account')
})
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test tests/password-recovery.test.mjs`

Expected: FAIL because `lib/auth/password-recovery.js` does not exist.

- [ ] **Step 3: Implement the minimal pure helper module**

```js
const safeAuthPath = (value, fallback = '/account') => value?.startsWith('/') && !value.startsWith('//') ? value : fallback
const buildRecoveryRedirect = origin => `${String(origin).replace(/\/$/,'')}/auth/callback?next=${encodeURIComponent('/reset-password')}`
const validateNewPassword = (password, confirmation) => password.length < 8 ? { ok:false,error:'Use at least 8 characters.' } : password !== confirmation ? { ok:false,error:'Passwords do not match.' } : { ok:true }
const postPasswordPath = isAdmin => isAdmin ? '/admin' : '/account'
module.exports = { safeAuthPath, buildRecoveryRedirect, validateNewPassword, postPasswordPath }
```

- [ ] **Step 4: Use `safeAuthPath` in the callback and verify GREEN**

Run: `node --test tests/password-recovery.test.mjs`

Expected: four passing tests.

- [ ] **Step 5: Commit**

```bash
git add lib/auth/password-recovery.js app/auth/callback/route.js tests/password-recovery.test.mjs
git commit -m "test: define password recovery contracts"
```

### Task 2: Recovery request and password update UI

**Files:**
- Create: `app/components/PasswordRecoveryForm.jsx`
- Create: `app/components/PasswordResetForm.jsx`
- Create: `app/forgot-password/page.js`
- Create: `app/reset-password/page.js`
- Modify: `app/components/AuthForm.jsx`
- Test: `tests/password-recovery.test.mjs`

**Interfaces:**
- Consumes: `buildRecoveryRedirect`, `validateNewPassword`, and `postPasswordPath` from Task 1.
- Produces: public routes `/forgot-password` and `/reset-password`.

- [ ] **Step 1: Add a failing recovery-request options test**

Extend `tests/password-recovery.test.mjs` with this independently derived boundary contract:

```js
test('recovery requests use the secure reset callback', () => {
  assert.deepEqual(recovery.recoveryRequestOptions('https://www.salonpoke.com/'), {
    redirectTo: 'https://www.salonpoke.com/auth/callback?next=%2Freset-password',
  })
})
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/password-recovery.test.mjs`

Expected: FAIL because `recoveryRequestOptions` does not exist.

- [ ] **Step 3: Implement `PasswordRecoveryForm`**

Add `recoveryRequestOptions(origin)` to `lib/auth/password-recovery.js`. The form collects email and calls:

```js
await supabase.auth.resetPasswordForEmail(email, {
  ...recoveryRequestOptions(window.location.origin),
})
```

On either a successful request or an unknown-address response, show: `If an account exists, a password email has been sent.` Disable repeated submission while pending.

- [ ] **Step 4: Implement `PasswordResetForm`**

Validate both password fields using `validateNewPassword`. Confirm a session with `supabase.auth.getUser()`, call `supabase.auth.updateUser({password})`, query active `admin_users` membership, and route with `postPasswordPath(Boolean(data?.is_active))`. Missing sessions show an expired-link message and link to `/forgot-password`.

- [ ] **Step 5: Compose pages and add the sign-in link**

Use the existing `PageIntro` and `salon-form` patterns. Add `Forgot or haven’t set a password?` below the sign-in submit button, linking to `/forgot-password`; keep signup mode unchanged.

- [ ] **Step 6: Verify GREEN, build the real routes, and run regression tests**

Run: `node --test tests/password-recovery.test.mjs`

Expected: PASS.

Run: `pnpm test`

Expected: all existing and new tests pass.

Run: `pnpm build`

Expected: the Next.js route table includes `/forgot-password` and `/reset-password`, proving the actual pages compile and register.

- [ ] **Step 7: Commit**

```bash
git add app/components/PasswordRecoveryForm.jsx app/components/PasswordResetForm.jsx app/components/AuthForm.jsx app/forgot-password/page.js app/reset-password/page.js tests/password-recovery.test.mjs
git commit -m "feat: add password setup and recovery flow"
```

### Task 3: Build, deploy, and end-to-end verification

**Files:**
- Verify: entire application
- Update only if verification reveals a defect: the smallest file responsible for that defect, with a failing regression test first.

**Interfaces:**
- Consumes: the complete recovery flow from Tasks 1 and 2.
- Produces: a verified Vercel production deployment on `www.salonpoke.com`.

- [ ] **Step 1: Build locally**

Run: `pnpm build`

Expected: successful Next.js production build including `/forgot-password` and `/reset-password`.

- [ ] **Step 2: Push the feature branch and wait for Vercel preview**

```bash
git push origin codex/salon-poke-admin-rebuild
```

Expected: Vercel preview reaches Ready.

- [ ] **Step 3: Verify preview routes in Chrome**

Check that `/admin/login` shows the recovery link, `/forgot-password` submits without account enumeration, callback preserves `next=/reset-password`, an authenticated recovery session can set a matching eight-character-or-longer password, and active ADMIN membership redirects to `/admin`.

- [ ] **Step 4: Publish and verify production**

Fast-forward `main`, wait for Vercel production Ready, then verify the same route and ADMIN login flow at `https://www.salonpoke.com`.

- [ ] **Step 5: Final repository and runtime audit**

Run: `git status --short`, `git rev-parse HEAD`, and `git rev-parse origin/main`.

Expected: clean worktree and matching deployed commit. Confirm no password, recovery token, API key, browser capture, or runtime log is tracked.
