# Salon Poke password setup and recovery design

## Problem

Supabase invitation and confirmation links currently establish a session and then send the user to the default account destination. The site has no password-setup screen, so an invited administrator reaches the site without ever creating a password and cannot subsequently use the ADMIN login form.

## Intended experience

- Invitation and password-recovery links finish at `/reset-password` while preserving the authenticated recovery session.
- The reset page asks for a new password and confirmation, validates them, and updates the current Supabase user.
- Successful setup sends an active administrator to `/admin`; a normal customer goes to `/account`.
- The ADMIN login page includes a clear “Forgot or haven’t set a password?” action.
- That action accepts the administrator email and sends a Supabase recovery email whose redirect target is `/auth/callback?next=/reset-password`.
- Expired or invalid links show a useful message and a way to request another recovery email.

## Components and data flow

1. A small client-side recovery-request form calls `supabase.auth.resetPasswordForEmail` with the production callback URL.
2. The existing `/auth/callback` route exchanges the supplied code or token for a session and applies its existing safe relative redirect validation.
3. A new `/reset-password` page verifies that a user session exists before presenting the password form.
4. The password form calls `supabase.auth.updateUser({ password })`, displays errors without exposing sensitive details, and redirects according to active `admin_users` membership.
5. The ADMIN login page links to the recovery request screen. Existing sign-in and customer-account behavior remains unchanged.

## Security and error handling

- Redirect destinations remain restricted to local paths, preventing open redirects.
- Passwords are submitted directly from the browser to Supabase and are never logged or stored by the application.
- The form requires matching passwords and a minimum length of eight characters.
- Recovery requests display the same success response whether or not an email exists, avoiding account enumeration.
- A missing or expired recovery session cannot update a password and offers a fresh recovery request.

## Testing and release

- Add tests that initially fail because the reset route, recovery action, secure callback target, and ADMIN link do not exist.
- Implement the smallest code necessary to pass those tests, then run the full existing suite and production build.
- Deploy a Vercel preview and verify the request, callback, password update, ADMIN redirect, and ADMIN login in Chrome.
- Promote only after the preview flow passes, then repeat the smoke checks on `www.salonpoke.com`.

## Scope

This change covers email/password setup and recovery only. It does not add social login, multi-factor authentication, passwordless login, or changes to appointment and ADMIN authorization policies.
