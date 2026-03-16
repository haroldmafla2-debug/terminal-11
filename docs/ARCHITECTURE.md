# Arquitectura propuesta

## Stack final elegido
- Frontend: Next.js + TypeScript + Monaco Editor.
- Backend: FastAPI + SQLAlchemy + JWT en cookies seguras.
- Base de datos: PostgreSQL.
- Servicio de ejecucion: FastAPI separado (`runner`) con Python aislado.
- Infraestructura local: Docker Compose.

## Justificacion de backend
Se elige **FastAPI** por tres razones:
1. El dominio principal es Python (editor y ejecucion Python), lo que reduce complejidad operativa y de equipo.
2. OpenAPI integrado para documentar API rapidamente.
3. Integracion natural con validacion, seguridad y pruebas en un stack unico.

## Componentes
1. `frontend` (puerto 3000): UI estudiante/profesor.
2. `backend` (puerto 8000): autenticacion, cursos, actividades, entregas, versiones, auditoria.
3. `runner` (interno): ejecucion restringida de codigo Python.
4. `postgres` (puerto 5432): almacenamiento transaccional.
5. `redis` (puerto 6379): soporte para rate limiting (extensible).

## Flujo de ejecucion
1. Estudiante pulsa "Ejecutar" en frontend.
2. Backend valida tamano y permisos.
3. Backend llama al `runner` por red interna.
4. Runner valida AST y bloquea imports peligrosos.
5. Runner ejecuta en proceso efimero con timeout y limites de recursos.
6. Backend guarda salida, contador de ejecuciones e historial de version.

## Seguridad de alto nivel
- Runner separado del backend.
- Runner sin puertos publicos.
- Red interna `sandbox_net` para runner.
- Contenedor runner: `cap_drop: ALL`, `no-new-privileges`, `read_only`, `tmpfs`, `pids_limit`, `mem_limit`, `cpus`.
- Timeout duro por ejecucion y limite de memoria.
- Bloqueo de imports peligrosos por AST.
- Auditoria basica de eventos criticos.

