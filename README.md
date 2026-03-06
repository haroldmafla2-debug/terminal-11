# Portal Web Escolar

Portal Web Escolar es una plataforma web production-ready para [COLEGIO], enfocada en gestión académica y comunicación entre administración, docentes, estudiantes y acudientes.

## Estado del proyecto

- Milestone actual: `PR1` (setup del repo + auth base + UI base por roles).
- Stack: Next.js (App Router) + TypeScript + Tailwind + shadcn/ui + Supabase.

## Suposiciones usadas

- Nombre del colegio: `[COLEGIO]`.
- Año académico inicial: `2026`.
- Escala de notas: `0.0` a `5.0`.
- Nota mínima aprobatoria: `3.0`.
- Periodos: `P1`, `P2`, `P3`, `P4`.
- En `PR1`, el rol se toma de `app_metadata.role` (fallback a `user_metadata.role`) hasta conectar `profiles` y RLS en `PR2`.

## Estructura principal

- `src/app`: rutas App Router (login, dashboard y módulos base por rol).
- `src/components`: componentes UI y layout.
- `src/lib`: utilidades, auth guards, Supabase SSR clients.
- `src/services`: servicios por módulo (PR1 incluye `auth`).
- `tests/unit`: pruebas unitarias (Vitest).
- `tests/e2e`: smoke tests (Playwright).
- `.github/workflows/ci.yml`: pipeline básico para PRs.

## Setup local

1. Instalar dependencias:
   - `npm install`
2. Crear entorno local:
   - `copy .env.example .env.local` (Windows)
3. Levantar el proyecto:
   - `npm run dev`

## Variables de entorno

Definidas en `.env.example`:

- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_SCHOOL_NAME`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (uso server-only, no exponer)
- `ACADEMIC_YEAR`
- `GRADE_SCALE_MIN`
- `GRADE_SCALE_MAX`
- `PASSING_GRADE`

## Scripts

- `npm run dev`: desarrollo.
- `npm run build`: build de producción.
- `npm run start`: arrancar build.
- `npm run lint`: lint estricto.
- `npm run lint:fix`: autofix lint.
- `npm run typecheck`: chequeo de tipos.
- `npm run format`: formateo.
- `npm run format:check`: validación de formato.
- `npm run test:unit`: unit tests (Vitest).
- `npm run test:e2e`: smoke tests (Playwright).
- `npm run test`: unit + e2e.

## Flujo de ramas y commits

- Ramas: `main` y `dev`.
- Feature branches recomendadas: `codex/<scope>-<short-name>`.
- Commits: Conventional Commits (ej: `feat(auth): add role-based middleware`).

## CI (PRs)

El workflow ejecuta en pull requests:

- `npm ci`
- `npm run lint`
- `npm run test:unit`
- `npx playwright install --with-deps chromium`
- `npm run test:e2e`
- `npm run build`

## Despliegue

- Frontend: Vercel.
- Backend: Supabase (DB/Auth/Storage/Edge Functions).

### Vercel

1. Conectar repositorio.
2. Configurar variables de entorno de `.env.example`.
3. Deploy automático sobre `main`.

### Supabase

1. Crear proyecto.
2. Configurar Auth providers.
3. Aplicar migraciones (`PR2` en adelante).
4. Cargar seeds (`PR2` en adelante).

## Guías rápidas

- Ver contribución: `CONTRIBUTING.md`.
- Reglas de ownership: `.github/CODEOWNERS`.
- Seguridad: evitar logs con secretos y depender siempre de RLS como autoridad final (a partir de PR2).
