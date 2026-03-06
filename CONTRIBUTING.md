# Contributing

## Branching

- Base branch de integración: `dev`.
- Producción: `main`.
- Usa ramas `codex/<scope>-<descripcion-corta>`.

## Conventional Commits

Formato:

- `type(scope): message`

Tipos sugeridos:

- `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `ci`

## Pull Requests

1. Sincroniza con `dev`.
2. Ejecuta localmente:
   - `npm run lint`
   - `npm run test:unit`
   - `npm run build`
3. Documenta cambios y capturas si aplica.
4. Solicita review según `CODEOWNERS`.

## Estándares

- TypeScript estricto.
- No exponer secretos en cliente.
- Validar inputs con `zod`.
- Mantener componentes accesibles (`label`, `focus-visible`, `aria-*` cuando aplique).

## Testing mínimo

- Unit tests para utilidades/validaciones.
- Smoke test de acceso al login/dashboard.
