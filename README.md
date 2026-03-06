# Portal Web Escolar

Portal Web Escolar is a production-ready platform for [COLEGIO], focused on academic operations and communication between admin, teachers, students, and guardians.

## Current status

- Milestone: `PR2` (database schema + strict RLS + seed data).
- Stack: Next.js (App Router) + TypeScript + Tailwind + shadcn/ui + Supabase.

## Assumptions

- School name: `[COLEGIO]`
- Academic year: `2026`
- Grade scale: `0.0` to `5.0`
- Passing grade: `3.0`
- Periods: `P1`, `P2`, `P3`, `P4`

## Main structure

- `src/app`: App Router pages (auth, dashboard, role modules).
- `src/components`: UI and layout components.
- `src/lib`: shared utils, auth guards, Supabase clients.
- `src/services`: module services and zod validation.
- `supabase/migrations`: SQL migrations.
- `supabase/seed.sql`: initial seed for local/dev.
- `tests/unit`: Vitest tests.
- `tests/e2e`: Playwright smoke tests.

## Local setup

1. Install dependencies:
   - `npm install`
2. Configure env:
   - `copy .env.example .env.local`
3. Run app:
   - `npm run dev`

## Environment variables

Defined in `.env.example`:

- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_SCHOOL_NAME`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- `ACADEMIC_YEAR`
- `GRADE_SCALE_MIN`
- `GRADE_SCALE_MAX`
- `PASSING_GRADE`

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run lint:fix`
- `npm run typecheck`
- `npm run format`
- `npm run format:check`
- `npm run test:unit`
- `npm run test:e2e`
- `npm run test`

## Supabase DB (PR2)

### Files

- Migration: `supabase/migrations/20260305220000_pr2_core_schema.sql`
- Seed: `supabase/seed.sql`
- Config: `supabase/config.toml`

### Run migrations and seed (local CLI)

1. `supabase start`
2. `supabase db reset`

`supabase db reset` applies all migrations and executes `supabase/seed.sql`.

### Seed credentials (local/dev)

All users use password `Password123*`:

- Admin: `admin@colegio.local`
- Coordination: `coordinacion@colegio.local`
- Teacher: `docente@colegio.local`
- Student: `estudiante@colegio.local`
- Guardian: `acudiente@colegio.local`

## Security model

- Route/session protection in Next.js middleware.
- Server-side validation with zod.
- RLS with least-privilege policies per role.
- RLS is the final authority for data access.

## Branch and commit strategy

- Main branches: `main`, `dev`
- Feature branches: `codex/<scope>-<short-name>`
- Conventional commits required

## CI for pull requests

Workflow in `.github/workflows/ci.yml` runs:

- `npm ci`
- `npm run lint`
- `npm run test:unit`
- `npm run test:e2e`
- `npm run build`

## Deployment

- Frontend: Vercel
- Backend: Supabase (Postgres, Auth, Storage, Edge Functions)