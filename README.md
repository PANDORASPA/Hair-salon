# Salon Poke Bristol

Git-backed public website, customer booking flow, account area, and focused administration system for Salon Poke Bristol.

## Public website

The application preserves the live routes `/`, `/services`, `/booking`, `/gallery`, `/about`, `/location`, `/contact`, `/signin`, `/signup`, `/account`, `/terms`, and `/privacy`. Public fallback content is in `content/salon-poke-defaults.js`; recovered gallery assets are in `public/gallery`.

## Administration

`/admin` is protected by Supabase Auth plus an active row in `admin_users`. It contains only:

- appointments;
- services and prices;
- weekly hours and blocked dates;
- gallery images;
- public site content;
- administrator accounts.

Authorization never relies on user-editable metadata. Every exposed table has RLS enabled and administrative mutations are audited.

## Local setup

1. Install the locked dependencies with `pnpm install --frozen-lockfile`.
2. Copy `.env.example` to `.env.local` and fill the four required values.
3. Apply `supabase/migrations` in filename order to a new Supabase project.
4. Run `supabase/seed-salon-poke.sql`.
5. Create the first Auth user and insert its UUID into `admin_users` as described in `docs/ADMIN_OPERATIONS.md`.
6. Run `pnpm dev`.

## Verification

```bash
pnpm test
pnpm build
pnpm security:scan
npm audit --production
```

Deployment, initial administrator, rollback, and routine operations are documented in `docs/DEPLOYMENT.md` and `docs/ADMIN_OPERATIONS.md`.
