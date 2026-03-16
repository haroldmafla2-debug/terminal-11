# Profe Harold Mafla - Plataforma Escolar Python (sin IA)

Plataforma academica para colegio con editor Python en navegador, ejecucion segura en sandbox, autosave, envio de actividades y revision docente.

## 1) Arquitectura del sistema
Resumen: ver [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md).

- `frontend` (Next.js): UI estudiante/profesor.
- `backend` (FastAPI): auth, cursos, actividades, entregas, historial y auditoria.
- `runner` (FastAPI): ejecucion aislada de Python.
- `postgres`: persistencia.
- `redis`: base para rate limiting.

## 2) Stack final elegido
- Frontend: Next.js + TypeScript + Monaco Editor.
- Backend: FastAPI + SQLAlchemy.
- DB: PostgreSQL.
- Auth: JWT en cookies seguras HttpOnly.
- Sandbox: runner aislado + limites de recursos + validacion AST.
- Orquestacion local: Docker Compose.

## 3) Arbol de carpetas
```text
.
+- backend/
�  +- app/
�  �  +- clients/
�  �  +- core/
�  �  +- db/
�  �  +- routers/
�  �  +- main.py
�  �  +- models.py
�  �  +- schemas.py
�  �  +- utils.py
�  +- migrations/001_init.sql
�  +- tests/test_security.py
�  +- Dockerfile
�  +- requirements.txt
+- frontend/
�  +- app/
�  �  +- login/page.tsx
�  �  +- student/page.tsx
�  �  +- student/activity/[id]/page.tsx
�  �  +- teacher/page.tsx
�  �  +- globals.css
�  �  +- layout.tsx
�  +- lib/api.ts
�  +- Dockerfile
�  +- package.json
+- runner/
�  +- app/main.py
�  +- app/sandbox.py
�  +- tests/test_sandbox.py
�  +- Dockerfile
�  +- requirements.txt
+- docs/
�  +- ARCHITECTURE.md
�  +- SECURITY.md
�  +- DEPLOY_VPS.md
+- docker-compose.yml
+- .env.example
```

## 4) Plan de implementacion por fases
- Fase 1 (MVP): login, curso, actividad, editor Python, ejecutar, guardar, enviar, revision profesor.
- Fase 2: historial de versiones y filtros avanzados.
- Fase 3: reportes exportables y mejoras de auditoria.
- Fase 4: modo examen (temporizador, copiar/pegar, fullscreen).
- Fase 5: hardening final y despliegue VPS.

## 5) MVP implementado
- Login profesor/estudiante.
- Crear curso.
- Crear actividad.
- Estudiante escribe Python en Monaco.
- Ejecutar en sandbox aislado (servicio separado).
- Guardar solucion (manual + autosave cada 15s).
- Enviar actividad.
- Profesor revisa entregas y salida.

## 6) API documentada
Con backend arriba:
- OpenAPI JSON: `http://localhost:8000/openapi.json`
- Swagger UI: `http://localhost:8000/docs`

## 7) Instalacion local paso a paso
1. Copiar variables:
```bash
cp .env.example .env
```
2. Levantar plataforma:
```bash
docker compose up --build
```
3. Abrir:
- Frontend: `http://localhost:3000`
- Backend docs: `http://localhost:8000/docs`

## 8) Datos de prueba
Semilla automatica al iniciar backend:
- `admin / Admin123*`
- `profesor1 / Profesor123*`
- `estudiante1 / Estudiante123*`
- Curso inicial: `601-A`

## 9) Migraciones
- Archivo inicial: `backend/migrations/001_init.sql`
- En MVP, el backend crea tablas automaticamente al iniciar (`Base.metadata.create_all`).

## 10) Tests minimos criticos
- Backend: `backend/tests/test_security.py`
- Runner: `runner/tests/test_sandbox.py`

## 11) Seguridad
Detalle completo en [docs/SECURITY.md](./docs/SECURITY.md).

Controles MVP aplicados:
- Roles y control de acceso por endpoints.
- Codigo ejecutado fuera del backend principal.
- Timeout, memoria, pids y CPU limitados en runner.
- Bloqueo de imports peligrosos.
- Limite de tamano de codigo.
- Auditoria basica de acciones.

## 12) Despliegue VPS
Ver [docs/DEPLOY_VPS.md](./docs/DEPLOY_VPS.md).

## 13) Despliegue en Vercel (frontend)
1. Importar el repositorio en Vercel.
2. No necesitas cambiar comandos: el archivo [`vercel.json`](./vercel.json) de la raiz ya construye `frontend` automaticamente.
3. Variables en Vercel:
   - `NEXT_PUBLIC_API_URL` = URL publica del backend (no localhost).
4. Deploy.

## 14) Restricciones de producto cumplidas
- Sin IA.
- Sin chatbot.
- Sin autocompletado inteligente.
- Sin generacion automatica de codigo.
